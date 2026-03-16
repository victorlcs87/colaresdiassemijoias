import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";

export type ProductPayload = {
    name: string;
    description: string | null;
    price: number;
    is_available: boolean;
    image_url: string | null;
    image_gallery: string[];
    sizes: unknown;
    category: string | null;
    color: string | null;
    cost_price: number | null;
    promotional_price: number | null;
    condition: "novo" | "seminovo";
    stock_quantity: number;
};

export class ProductRepository {
    async insert(client: SupabaseClient, payload: ProductPayload) {
        return client.from("products").insert(payload);
    }

    async update(client: SupabaseClient, id: string, payload: ProductPayload) {
        return client.from("products").update(payload).eq("id", id);
    }

    async setAvailability(client: SupabaseClient, id: string, isAvailable: boolean) {
        return client.from("products").update({ is_available: isAvailable }).eq("id", id);
    }

    async deleteById(client: SupabaseClient, id: string) {
        return client.from("products").delete().eq("id", id);
    }

    async findById(client: SupabaseClient, id: string) {
        return client.from("products").select("*").eq("id", id).single();
    }
}

export const productRepository = new ProductRepository();
