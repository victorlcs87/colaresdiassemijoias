import "server-only";

import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";
import { storeSettingsRepository } from "@/lib/repositories/store-settings.repository";
import { parseStoreSettingsInput } from "@/lib/validation/settings";

export class StoreSettingsService {
    async getAll(supabase: Parameters<typeof storeSettingsRepository.list>[0]): Promise<Record<string, string>> {
        const { data, error } = await storeSettingsRepository.list(supabase);

        if (error) {
            if (error.code !== "42P01") {
                console.warn("Warn fetching settings:", error.message);
            }

            return {};
        }

        return (data || []).reduce<Record<string, string>>((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
    }

    async update(supabase: Parameters<typeof storeSettingsRepository.upsertMany>[0], settings: Record<string, string>): Promise<ActionResult> {
        const parsed = parseStoreSettingsInput(settings);
        if (!parsed.success || !parsed.data) {
            return fail(parsed.code, parsed.message);
        }

        const { error } = await storeSettingsRepository.upsertMany(supabase, parsed.data);

        if (error) {
            return fail("SETTINGS_UPDATE_ERROR", error.message);
        }

        return ok("Configurações atualizadas com sucesso.");
    }
}

export const storeSettingsService = new StoreSettingsService();
