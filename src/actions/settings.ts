"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { resolveAdminContext } from "@/lib/auth/admin-guard";
import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";

export async function getStoreSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("store_settings").select("key, value");

    if (error) {
        // Suppress missing table errors during development
        if (error.code !== '42P01') {
            console.warn("Warn fetching settings:", error.message);
        }
        return {};
    }

    // Converter array de [{key, value}] para objeto { key: value }
    return data.reduce<Record<string, string>>((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
}

export async function updateStoreSettings(settings: Record<string, string>): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }

    const { supabase } = auth.data;

    const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
    }));

    const { error } = await supabase.from("store_settings").upsert(updates, { onConflict: "key" });

    if (error) {
        console.error("Error updating settings:", error);
        return fail("SETTINGS_UPDATE_ERROR", error.message);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/catalog", "layout");

    return ok("Configurações atualizadas com sucesso.");
}
