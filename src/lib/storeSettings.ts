type GenericSettings = Record<string, string>;

export function getSetting(settings: GenericSettings, snakeKey: string, camelKey?: string) {
    if (settings[snakeKey]) return settings[snakeKey];
    if (camelKey && settings[camelKey]) return settings[camelKey];
    return "";
}

export function getStoreName(settings: GenericSettings) {
    return getSetting(settings, "store_name", "storeName") || "Colares Dias Semijoias";
}

export function getStoreDescription(settings: GenericSettings) {
    return (
        getSetting(settings, "store_description", "storeDescription") ||
        "Catálogo virtual de acessórios e semijoias com curadoria exclusiva da Colares Dias."
    );
}

export function getStoreWhatsapp(settings: GenericSettings) {
    return getSetting(settings, "whatsapp_number", "whatsappNumber") || "+5561982865191";
}

export function getStoreContactEmail(settings: GenericSettings) {
    return getSetting(settings, "contact_email", "contactEmail") || "contato@colaresdias.com.br";
}

export function getStoreInstagram(settings: GenericSettings) {
    return getSetting(settings, "instagram_user", "instagramUser") || "colares.dias.semijoias";
}
