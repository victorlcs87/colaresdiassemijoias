"use server";

import { revalidatePath } from "next/cache";
import { resolveAdminContext } from "@/lib/auth/admin-guard";
import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";

export async function registerSale(formData: FormData): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const product_id = formData.get("product_id") as string;
    const sale_price = parseFloat(formData.get("sale_price") as string);
    const sale_date = (formData.get("sale_date") as string) || new Date().toISOString().split("T")[0];
    const notes = (formData.get("notes") as string) || null;

    if (!product_id || isNaN(sale_price)) {
        return fail("VALIDATION_ERROR", "Produto e preço de venda são obrigatórios.");
    }

    // Buscar dados do produto
    const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", product_id)
        .single();

    if (fetchError || !product) {
        return fail("PRODUCT_NOT_FOUND", "Produto não encontrado.");
    }

    // Inserir venda
    const { error: saleError } = await supabase.from("sales").insert({
        product_id,
        product_name: product.name,
        product_color: product.color || null,
        product_image: product.image_url || (product.image_gallery?.[0] ?? null),
        cost_price: product.cost_price || null,
        sale_price,
        sale_date,
        notes,
    });

    if (saleError) {
        return fail("SALE_REGISTER_ERROR", `Erro ao registrar venda: ${saleError.message}`);
    }

    // Marcar produto como indisponível
    await supabase
        .from("products")
        .update({ is_available: false })
        .eq("id", product_id);

    revalidatePath("/admin/products");
    revalidatePath("/admin/sales");
    revalidatePath("/catalog");
    revalidatePath("/");

    return ok("Venda registrada com sucesso.");
}

export async function undoSale(saleId: string): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    // Buscar a venda para saber o ID do produto
    const { data: sale, error: fetchError } = await supabase
        .from("sales")
        .select("product_id")
        .eq("id", saleId)
        .single();

    if (fetchError || !sale) {
        return fail("SALE_NOT_FOUND", "Venda não encontrada.");
    }

    // Deletar a venda
    const { error: deleteError } = await supabase
        .from("sales")
        .delete()
        .eq("id", saleId);

    if (deleteError) {
        return fail("SALE_UNDO_ERROR", `Erro ao desfazer venda: ${deleteError.message}`);
    }

    // Se a venda tinha um produto associado, torná-lo disponível novamente
    if (sale.product_id) {
        await supabase
            .from("products")
            .update({ is_available: true })
            .eq("id", sale.product_id);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/sales");
    revalidatePath("/catalog");
    revalidatePath("/");

    return ok("Venda desfeita com sucesso.");
}

export async function getSales(startDate?: string, endDate?: string) {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return [];
    }
    const { supabase } = auth.data;

    let query = supabase
        .from("sales")
        .select("*")
        .order("sale_date", { ascending: false });

    if (startDate) {
        query = query.gte("sale_date", startDate);
    }
    if (endDate) {
        query = query.lte("sale_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching sales:", error);
        return [];
    }

    return data || [];
}

export async function getSalesReport(startDate?: string, endDate?: string) {
    const sales = await getSales(startDate, endDate);

    const totalRevenue = sales.reduce((sum, s) => sum + (s.sale_price || 0), 0);
    const totalCost = sales.reduce((sum, s) => sum + (s.cost_price || 0), 0);
    const totalProfit = totalRevenue - totalCost;
    const totalSales = sales.length;

    return {
        totalRevenue,
        totalCost,
        totalProfit,
        totalSales,
        sales,
    };
}

export async function duplicateProduct(productId: string) {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (fetchError || !product) {
        return fail("PRODUCT_NOT_FOUND", "Produto original não encontrado.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, ...productData } = product;

    const { error: insertError } = await supabase.from("products").insert({
        ...productData,
        is_available: true,
    });

    if (insertError) {
        return fail("PRODUCT_DUPLICATE_ERROR", `Erro ao duplicar produto: ${insertError.message}`);
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");

    return ok("Produto duplicado com sucesso.");
}
