import "server-only";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { adminProfileRepository } from "@/lib/repositories/admin-profile.repository";
import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";
import { validateAdminCredentials } from "@/lib/validation/admin-auth";

export type SignInAdminInput = {
    username: string;
    password: string;
};

export type SignInAdminOutput = {
    redirectTo: string;
};

export class AdminAuthService {
    async signInByUsername(input: SignInAdminInput): Promise<ActionResult<SignInAdminOutput>> {
        const parsed = validateAdminCredentials(input);
        if (!parsed.valid || !parsed.data) {
            return fail("INVALID_CREDENTIALS", "Credenciais inválidas.");
        }

        let profileEmail = "";
        try {
            const serviceRoleClient = createServiceRoleClient();
            const adminProfile = await adminProfileRepository.findByUsername(serviceRoleClient, parsed.data.username);

            if (!adminProfile?.email) {
                return fail("INVALID_CREDENTIALS", "Usuário ou senha inválidos.");
            }

            profileEmail = adminProfile.email;
        } catch {
            return fail("CONFIG_ERROR", "Falha de configuração do servidor para autenticação.");
        }

        const supabase = await createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: profileEmail,
            password: parsed.data.password,
        });

        if (error) {
            return fail("INVALID_CREDENTIALS", "Usuário ou senha inválidos.");
        }

        return ok("Autenticação realizada com sucesso.", { redirectTo: "/admin/dashboard" });
    }
}

export const adminAuthService = new AdminAuthService();

