"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { resolveAdminContext } from "@/lib/auth/admin-guard";
import { fail, type ActionResult } from "@/lib/contracts/action-result";
import { productService } from "@/lib/services/product.service";

export async function createProduct(formData: FormData) {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        console.error("Unauthorized attempt to create product");
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const parsed = productService.parseFormData(formData);
    if (!parsed.success || !parsed.data) {
        return fail(parsed.code, parsed.message);
    }

    const result = await productService.create(supabase, parsed.data);
    if (!result.success) {
        console.error("Failed to insert product", result.error);
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        console.error("Unauthorized attempt to delete product");
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const result = await productService.delete(supabase, id);
    if (!result.success) {
        console.error("Failed to delete product", result.error);
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
    return result;
}

export async function updateProduct(id: string, formData: FormData) {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        console.error("Unauthorized attempt to update product");
        return fail(auth.code, auth.message);
    }
    const { supabase } = auth.data;

    const parsed = productService.parseFormData(formData);
    if (!parsed.success || !parsed.data) {
        return fail(parsed.code, parsed.message);
    }

    const result = await productService.update(supabase, id, parsed.data);
    if (!result.success) {
        console.error("Failed to update product", result.error);
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath(`/catalog/${id}`);
    revalidatePath("/");
    redirect("/admin/products");
}
