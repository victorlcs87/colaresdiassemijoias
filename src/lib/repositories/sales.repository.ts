import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";

export type SaleInsertPayload = {
    product_id: string;
    product_name: string;
    product_color: string | null;
    product_image: string | null;
    cost_price: number | null;
    sale_price: number;
    sale_date: string;
    notes: string | null;
};

export class SalesRepository {
    async insert(client: SupabaseClient, payload: SaleInsertPayload) {
        return client.from("sales").insert(payload);
    }

    async findById(client: SupabaseClient, saleId: string) {
        return client.from("sales").select("product_id").eq("id", saleId).single();
    }

    async deleteById(client: SupabaseClient, saleId: string) {
        return client.from("sales").delete().eq("id", saleId);
    }

    async list(client: SupabaseClient, startDate?: string, endDate?: string) {
        let query = client.from("sales").select("*").order("sale_date", { ascending: false });

        if (startDate) {
            query = query.gte("sale_date", startDate);
        }

        if (endDate) {
            query = query.lte("sale_date", endDate);
        }

        return query;
    }
}

export const salesRepository = new SalesRepository();

