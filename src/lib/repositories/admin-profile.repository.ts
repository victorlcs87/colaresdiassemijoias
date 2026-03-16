import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";

export type AdminProfile = {
    id: string;
    username: string;
    email: string;
};

export class AdminProfileRepository {
    async findByUsername(client: SupabaseClient, username: string): Promise<AdminProfile | null> {
        const { data } = await client
            .from("admin_profiles")
            .select("id, username, email")
            .eq("username", username)
            .maybeSingle();

        return (data as AdminProfile | null) ?? null;
    }

    async findByEmail(client: SupabaseClient, email: string): Promise<AdminProfile | null> {
        const { data } = await client
            .from("admin_profiles")
            .select("id, username, email")
            .eq("email", email)
            .maybeSingle();

        return (data as AdminProfile | null) ?? null;
    }
}

export const adminProfileRepository = new AdminProfileRepository();

