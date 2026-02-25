"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
    return data.reduce((acc: any, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});
}

export async function updateStoreSettings(settings: Record<string, string>) {
    const supabase = await createClient();

    // Defense in depth: Check if user is authenticated at the API level
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Unauthorized attempt to update settings");
        return { error: "Sem autorização para alterar configurações." };
    }

    const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
    }));

    const { error } = await supabase.from("store_settings").upsert(updates, { onConflict: "key" });

    if (error) {
        console.error("Error updating settings:", error);
        return { error: error.message };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/catalog", "layout");

    return { success: true };
}
