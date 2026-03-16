import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";

const MAX_KEY_LENGTH = 64;
const MAX_VALUE_LENGTH = 500;

export function parseStoreSettingsInput(input: Record<string, string>): ActionResult<Record<string, string>> {
    if (!input || typeof input !== "object") {
        return fail("VALIDATION_ERROR", "Payload de configurações inválido.");
    }

    const normalized = Object.entries(input).reduce<Record<string, string>>((acc, [rawKey, rawValue]) => {
        const key = String(rawKey || "").trim();
        const value = String(rawValue || "").trim();

        if (!key) {
            return acc;
        }

        acc[key] = value;
        return acc;
    }, {});

    for (const [key, value] of Object.entries(normalized)) {
        if (key.length > MAX_KEY_LENGTH) {
            return fail("VALIDATION_ERROR", `Chave de configuração muito longa: ${key}.`);
        }

        if (value.length > MAX_VALUE_LENGTH) {
            return fail("VALIDATION_ERROR", `Valor de configuração muito longo para: ${key}.`);
        }
    }

    return ok("Configurações válidas.", normalized);
}
