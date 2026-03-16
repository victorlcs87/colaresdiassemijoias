"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { resolveAdminContext } from "@/lib/auth/admin-guard";
import { fail, type ActionResult } from "@/lib/contracts/action-result";
import { storeSettingsService } from "@/lib/services/store-settings.service";

export async function getStoreSettings() {
    const supabase = await createClient();
    return storeSettingsService.getAll(supabase);
}

export async function updateStoreSettings(settings: Record<string, string>): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }

    const { supabase } = auth.data;

    const result = await storeSettingsService.update(supabase, settings);
    if (!result.success) {
        console.error("Error updating settings:", result.error);
        return fail(result.code, result.message);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/catalog", "layout");

    return result;
}
