import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";

export type ParsedSaleInput = {
    productId: string;
    salePrice: number;
    saleDate: string;
    notes: string | null;
};

export function parseSaleFormData(formData: FormData): ActionResult<ParsedSaleInput> {
    const productId = (formData.get("product_id") as string)?.trim();
    const salePrice = parseFloat(formData.get("sale_price") as string);
    const saleDate = ((formData.get("sale_date") as string) || new Date().toISOString().split("T")[0]).trim();
    const notes = ((formData.get("notes") as string) || "").trim() || null;

    if (!productId) {
        return fail("VALIDATION_ERROR", "Produto é obrigatório.");
    }

    if (Number.isNaN(salePrice) || salePrice <= 0) {
        return fail("VALIDATION_ERROR", "Preço de venda inválido.");
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(saleDate)) {
        return fail("VALIDATION_ERROR", "Data de venda inválida.");
    }

    return ok("Dados de venda válidos.", {
        productId,
        salePrice,
        saleDate,
        notes,
    });
}

