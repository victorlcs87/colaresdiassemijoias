"use client";

import { useEffect, useState } from "react";

type PublicStoreSettings = {
    storeName: string;
    storeDescription: string;
    whatsappNumber: string;
    instagramUser: string;
    contactEmail: string;
};

const DEFAULT_SETTINGS: PublicStoreSettings = {
    storeName: "Colares Dias Semijoias",
    storeDescription: "Catálogo virtual de acessórios e semijoias com curadoria exclusiva da Colares Dias.",
    whatsappNumber: "+5561982865191",
    instagramUser: "colares.dias.semijoias",
    contactEmail: "contato@colaresdias.com.br",
};

export function usePublicStoreSettings() {
    const [settings, setSettings] = useState<PublicStoreSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        let mounted = true;

        async function fetchSettings() {
            try {
                const response = await fetch("/api/public/settings", { cache: "no-store" });
                if (!response.ok) return;
                const payload = (await response.json()) as Partial<PublicStoreSettings>;
                if (!mounted) return;
                setSettings({
                    ...DEFAULT_SETTINGS,
                    ...payload,
                });
            } catch {
                // Fallback silencioso para defaults.
            }
        }

        fetchSettings();

        return () => {
            mounted = false;
        };
    }, []);

    return settings;
}

