"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    // Defense in depth: Check if user is authenticated at the API level
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Unauthorized attempt to create product");
        return { error: "Sem autorização para cadastrar produtos." };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const is_available = formData.get("is_available") === "true";
    const image_url_form = formData.get("image_url") as string || null;
    const image_gallery_str = formData.get("image_gallery") as string;
    let image_gallery: string[] = [];
    try {
        if (image_gallery_str) {
            image_gallery = JSON.parse(image_gallery_str);
        }
    } catch (e) { }

    const image_url = image_url_form || (image_gallery.length > 0 ? image_gallery[0] : null);

    const stock_quantity_str = formData.get("stock_quantity") as string;
    const stock_quantity = stock_quantity_str ? parseInt(stock_quantity_str, 10) : 1;

    const color = (formData.get("color") as string) || null;
    const cost_price_str = formData.get("cost_price") as string;
    const cost_price = cost_price_str ? parseFloat(cost_price_str) : null;
    const promotional_price_str = formData.get("promotional_price") as string;
    const promotional_price = promotional_price_str ? parseFloat(promotional_price_str) : null;
    const condition = (formData.get("condition") as 'novo' | 'seminovo') || 'novo';
    const category = (formData.get("category") as string) || null;
    const sizes_str = formData.get("sizes") as string;
    let sizes = null;
    try {
        if (sizes_str) {
            const parsed = JSON.parse(sizes_str);
            if (parsed && parsed.label && parsed.options && parsed.options.length > 0) {
                sizes = parsed;
            }
        }
    } catch (e) { }

    if (!name || isNaN(price)) {
        return { error: "Nome e preço são obrigatórios e preço deve ser um número válido." };
    }

    const { error } = await supabase.from("products").insert({
        name,
        description,
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

    if (error) {
        console.error("Failed to insert product", error);
        return { error: `Erro ao criar produto: ${error.message} (Code: ${error.code})` };
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    // Defense in depth: Check auth at API level
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Unauthorized attempt to delete product");
        return { error: "Sem autorização para excluir produtos." };
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
        console.error("Failed to delete product", error);
        return { error: `Erro ao excluir produto: ${error.message}` };
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
    return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = await createClient();

    // Defense in depth: Check auth at API level
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Unauthorized attempt to update product");
        return { error: "Sem autorização para atualizar produtos." };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const is_available = formData.get("is_available") === "true";
    const image_url_form = formData.get("image_url") as string || null;
    const image_gallery_str = formData.get("image_gallery") as string;
    let image_gallery: string[] = [];
    try {
        if (image_gallery_str) {
            image_gallery = JSON.parse(image_gallery_str);
        }
    } catch (e) { }

    const image_url = image_url_form || (image_gallery.length > 0 ? image_gallery[0] : null);

    const stock_quantity_str = formData.get("stock_quantity") as string;
    const stock_quantity = stock_quantity_str ? parseInt(stock_quantity_str, 10) : 1;

    const color = (formData.get("color") as string) || null;
    const cost_price_str = formData.get("cost_price") as string;
    const cost_price = cost_price_str ? parseFloat(cost_price_str) : null;
    const promotional_price_str = formData.get("promotional_price") as string;
    const promotional_price = promotional_price_str ? parseFloat(promotional_price_str) : null;
    const condition = (formData.get("condition") as 'novo' | 'seminovo') || 'novo';
    const category = (formData.get("category") as string) || null;
    const sizes_str = formData.get("sizes") as string;
    let sizes = null;
    try {
        if (sizes_str) {
            const parsed = JSON.parse(sizes_str);
            if (parsed && parsed.label && parsed.options && parsed.options.length > 0) {
                sizes = parsed;
            }
        }
    } catch (e) { }

    if (!name || isNaN(price)) {
        return { error: "Nome e preço são obrigatórios." };
    }

    const { error } = await supabase.from("products").update({
        name,
        description,
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
    }).eq("id", id);

    if (error) {
        console.error("Failed to update product", error);
        return { error: `Erro ao atualizar produto: ${error.message}` };
    }

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath(`/catalog/${id}`);
    revalidatePath("/");
    redirect("/admin/products");
}
