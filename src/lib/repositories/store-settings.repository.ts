import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";

export class StoreSettingsRepository {
    async list(client: SupabaseClient) {
        return client.from("store_settings").select("key, value");
    }

    async upsertMany(client: SupabaseClient, settings: Record<string, string>) {
        const updates = Object.entries(settings).map(([key, value]) => ({ key, value }));
        return client.from("store_settings").upsert(updates, { onConflict: "key" });
    }
}

export const storeSettingsRepository = new StoreSettingsRepository();

