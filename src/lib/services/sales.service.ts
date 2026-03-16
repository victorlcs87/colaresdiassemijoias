import "server-only";

import { type ActionResult, fail, ok } from "@/lib/contracts/action-result";
import { productRepository } from "@/lib/repositories/product.repository";
import { salesRepository } from "@/lib/repositories/sales.repository";
import { parseSaleFormData } from "@/lib/validation/sales";

export class SalesService {
    async registerSale(supabase: Parameters<typeof salesRepository.insert>[0], formData: FormData): Promise<ActionResult> {
        const parsed = parseSaleFormData(formData);
        if (!parsed.success || !parsed.data) {
            return fail(parsed.code, parsed.message);
        }

        const { productId, salePrice, saleDate, notes } = parsed.data;

        const { data: product, error: fetchError } = await productRepository.findById(supabase, productId);
        if (fetchError || !product) {
            return fail("PRODUCT_NOT_FOUND", "Produto não encontrado.");
        }

        const { error: saleError } = await salesRepository.insert(supabase, {
            product_id: productId,
            product_name: product.name,
            product_color: product.color || null,
            product_image: product.image_url || (product.image_gallery?.[0] ?? null),
            cost_price: product.cost_price || null,
            sale_price: salePrice,
            sale_date: saleDate,
            notes,
        });

        if (saleError) {
            return fail("SALE_REGISTER_ERROR", `Erro ao registrar venda: ${saleError.message}`);
        }

        await productRepository.setAvailability(supabase, productId, false);

        return ok("Venda registrada com sucesso.");
    }

    async undoSale(supabase: Parameters<typeof salesRepository.findById>[0], saleId: string): Promise<ActionResult> {
        const { data: sale, error: fetchError } = await salesRepository.findById(supabase, saleId);

        if (fetchError || !sale) {
            return fail("SALE_NOT_FOUND", "Venda não encontrada.");
        }

        const { error: deleteError } = await salesRepository.deleteById(supabase, saleId);
        if (deleteError) {
            return fail("SALE_UNDO_ERROR", `Erro ao desfazer venda: ${deleteError.message}`);
        }

        if (sale.product_id) {
            await productRepository.setAvailability(supabase, sale.product_id, true);
        }

        return ok("Venda desfeita com sucesso.");
    }
}

export const salesService = new SalesService();
