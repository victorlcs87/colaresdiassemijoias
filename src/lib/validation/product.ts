import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";
import type { ProductPayload } from "@/lib/repositories/product.repository";

export function parseProductFormData(formData: FormData): ActionResult<ProductPayload> {
    const name = (formData.get("name") as string)?.trim();
    const descriptionRaw = (formData.get("description") as string)?.trim();
    const price = parseFloat(formData.get("price") as string);
    const is_available = formData.get("is_available") === "true";
    const image_url_form = (formData.get("image_url") as string) || null;

    const image_gallery_str = formData.get("image_gallery") as string;
    let image_gallery: string[] = [];
    try {
        if (image_gallery_str) {
            image_gallery = JSON.parse(image_gallery_str);
        }
    } catch {
        return fail("VALIDATION_ERROR", "Galeria de imagens inválida.");
    }

    const image_url = image_url_form || (image_gallery.length > 0 ? image_gallery[0] : null);

    const stock_quantity_str = formData.get("stock_quantity") as string;
    const stock_quantity = stock_quantity_str ? parseInt(stock_quantity_str, 10) : 1;

    const color = (formData.get("color") as string)?.trim() || null;
    const cost_price_str = formData.get("cost_price") as string;
    const cost_price = cost_price_str ? parseFloat(cost_price_str) : null;
    const promotional_price_str = formData.get("promotional_price") as string;
    const promotional_price = promotional_price_str ? parseFloat(promotional_price_str) : null;
    const condition = ((formData.get("condition") as "novo" | "seminovo") || "novo");
    const category = (formData.get("category") as string)?.trim() || null;

    const sizes_str = formData.get("sizes") as string;
    let sizes = null;
    try {
        if (sizes_str) {
            const parsed = JSON.parse(sizes_str);
            if (parsed && parsed.label && parsed.options && parsed.options.length > 0) {
                sizes = parsed;
            }
        }
    } catch {
        return fail("VALIDATION_ERROR", "Variações/tamanhos inválidos.");
    }

    if (!name) {
        return fail("VALIDATION_ERROR", "Nome do produto é obrigatório.");
    }

    if (Number.isNaN(price)) {
        return fail("VALIDATION_ERROR", "Preço inválido.");
    }

    if (Number.isNaN(stock_quantity) || stock_quantity < 0) {
        return fail("VALIDATION_ERROR", "Quantidade em estoque inválida.");
    }

    if (cost_price !== null && (Number.isNaN(cost_price) || cost_price < 0)) {
        return fail("VALIDATION_ERROR", "Preço de custo inválido.");
    }

    if (promotional_price !== null && (Number.isNaN(promotional_price) || promotional_price < 0)) {
        return fail("VALIDATION_ERROR", "Preço promocional inválido.");
    }

    if (condition !== "novo" && condition !== "seminovo") {
        return fail("VALIDATION_ERROR", "Condição do produto inválida.");
    }

    return ok("Dados do produto válidos.", {
        name,
        description: descriptionRaw || null,
        price,
        is_available,
        image_url,
        image_gallery,
        sizes,
        category,
        color,
        cost_price,
        promotional_price,
        condition,
        stock_quantity,
    });
}
