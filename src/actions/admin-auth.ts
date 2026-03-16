"use server";

import { adminAuthService } from "@/lib/services/admin-auth.service";
import type { ActionResult } from "@/lib/contracts/action-result";

type SignInAdminInput = {
    username: string;
    password: string;
};

type SignInAdminOutput = {
    redirectTo: string;
};

export async function signInAdmin(input: SignInAdminInput): Promise<ActionResult<SignInAdminOutput>> {
    return adminAuthService.signInByUsername(input);
}

