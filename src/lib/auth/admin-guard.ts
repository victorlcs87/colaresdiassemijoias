import "server-only";

import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { adminProfileRepository, type AdminProfile } from "@/lib/repositories/admin-profile.repository";
import { fail, type ActionResult } from "@/lib/contracts/action-result";

export type AdminContext = {
    user: User;
    adminProfile: AdminProfile;
    supabase: Awaited<ReturnType<typeof createClient>>;
};

export async function resolveAdminContext(): Promise<ActionResult<AdminContext>> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        return fail("UNAUTHORIZED", "Sessão inválida ou expirada.");
    }

    const adminProfile = await adminProfileRepository.findByEmail(supabase, user.email);
    if (!adminProfile) {
        return fail("FORBIDDEN", "Usuário sem permissão administrativa.");
    }

    return {
        success: true,
        code: "OK",
        message: "Admin autenticado.",
        data: { user, adminProfile, supabase },
    };
}

export async function isCurrentUserAdmin(): Promise<boolean> {
    const auth = await resolveAdminContext();
    return auth.success;
}

