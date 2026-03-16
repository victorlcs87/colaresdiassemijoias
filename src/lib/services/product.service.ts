import "server-only";

import { type ActionResult, fail, ok } from "@/lib/contracts/action-result";
import { type ProductPayload, productRepository } from "@/lib/repositories/product.repository";
import { parseProductFormData } from "@/lib/validation/product";

export class ProductService {
    parseFormData(formData: FormData): ActionResult<ProductPayload> {
        return parseProductFormData(formData);
    }

    async create(supabase: Parameters<typeof productRepository.insert>[0], payload: ProductPayload): Promise<ActionResult> {
        const { error } = await productRepository.insert(supabase, payload);
        if (error) {
            return fail("PRODUCT_CREATE_ERROR", `Erro ao criar produto: ${error.message} (Code: ${error.code})`);
        }

        return ok("Produto criado com sucesso.");
    }

    async update(supabase: Parameters<typeof productRepository.update>[0], id: string, payload: ProductPayload): Promise<ActionResult> {
        const { error } = await productRepository.update(supabase, id, payload);
        if (error) {
            return fail("PRODUCT_UPDATE_ERROR", `Erro ao atualizar produto: ${error.message}`);
        }

        return ok("Produto atualizado com sucesso.");
    }

    async delete(supabase: Parameters<typeof productRepository.deleteById>[0], id: string): Promise<ActionResult> {
        const { error } = await productRepository.deleteById(supabase, id);
        if (error) {
            return fail("PRODUCT_DELETE_ERROR", `Erro ao excluir produto: ${error.message}`);
        }

        return ok("Produto excluído com sucesso.");
    }

    async duplicate(supabase: Parameters<typeof productRepository.findById>[0], productId: string): Promise<ActionResult> {
        const { data: product, error: fetchError } = await productRepository.findById(supabase, productId);

        if (fetchError || !product) {
            return fail("PRODUCT_NOT_FOUND", "Produto original não encontrado.");
        }

        const { error: insertError } = await productRepository.insert(supabase, {
            name: product.name,
            description: product.description,
            price: product.price,
            is_available: true,
            image_url: product.image_url,
            image_gallery: product.image_gallery || [],
            sizes: product.sizes,
            category: product.category,
            color: product.color,
            cost_price: product.cost_price,
            promotional_price: product.promotional_price,
            condition: product.condition || "novo",
            stock_quantity: product.stock_quantity ?? 1,
        });

        if (insertError) {
            return fail("PRODUCT_DUPLICATE_ERROR", `Erro ao duplicar produto: ${insertError.message}`);
        }

        return ok("Produto duplicado com sucesso.");
    }
}

export const productService = new ProductService();
