"use server";

import { revalidatePath } from "next/cache";
import { resolveAdminContext } from "@/lib/auth/admin-guard";
import { fail, type ActionResult } from "@/lib/contracts/action-result";
import { productService } from "@/lib/services/product.service";
import { salesService } from "@/lib/services/sales.service";
import { salesRepository } from "@/lib/repositories/sales.repository";

export async function registerSale(formData: FormData): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const result = await salesService.registerSale(supabase, formData);
    if (!result.success) {
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/sales");
    revalidatePath("/catalog");
    revalidatePath("/");

    return result;
}

export async function undoSale(saleId: string): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const result = await salesService.undoSale(supabase, saleId);
    if (!result.success) {
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/sales");
    revalidatePath("/catalog");
    revalidatePath("/");

    return result;
}

export async function getSales(startDate?: string, endDate?: string) {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return [];
    }
    const { supabase } = auth.data;

    const { data, error } = await salesRepository.list(supabase, startDate, endDate);

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

    const result = await productService.duplicate(supabase, productId);
    if (!result.success) {
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");

    return result;
}
