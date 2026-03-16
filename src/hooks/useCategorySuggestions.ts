"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export function useCategorySuggestions() {
    const [categories, setCategories] = useState<string[]>([]);

    const supabase = useMemo(
        () =>
            createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            ),
        []
    );

    useEffect(() => {
        let mounted = true;

        async function fetchCategories() {
            const { data, error } = await supabase
                .from("products")
                .select("category")
                .not("category", "is", null)
                .limit(1000);

            if (error || !data || !mounted) {
                return;
            }

            const uniqueCategories = Array.from(
                new Set(
                    data
                        .map((item) => item.category?.trim())
                        .filter((category): category is string => Boolean(category))
                )
            ).sort((a, b) => a.localeCompare(b, "pt-BR"));

            setCategories(uniqueCategories);
        }

        fetchCategories();

        return () => {
            mounted = false;
        };
    }, [supabase]);

    return categories;
}
