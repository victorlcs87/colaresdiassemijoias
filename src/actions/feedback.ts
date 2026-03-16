"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resolveAdminContext } from "@/lib/auth/admin-guard";
import { feedbackService } from "@/lib/services/feedback.service";
import { fail, type ActionResult } from "@/lib/contracts/action-result";
import type { Feedback, FeedbackStatus } from "@/lib/types";

export async function submitFeedback(formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();
    const result = await feedbackService.submit(supabase, formData);

    if (result.success) {
        revalidatePath("/");
        revalidatePath("/catalog");
    }

    return result;
}

export async function submitFeedbackWithState(
    _prevState: ActionResult | null,
    formData: FormData,
): Promise<ActionResult> {
    return submitFeedback(formData);
}

export async function listFeedbackForAdmin(status?: FeedbackStatus): Promise<ActionResult<Feedback[]>> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }

    return feedbackService.listForAdmin(auth.data.supabase, status);
}

export async function approveFeedback(id: string): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }

    const moderatedBy = auth.data.user.email || null;
    const result = await feedbackService.moderate(auth.data.supabase, id, "approved", moderatedBy);

    if (result.success) {
        revalidatePath("/");
        revalidatePath("/catalog");
        revalidatePath("/admin/feedback");
    }

    return result;
}

export async function rejectFeedback(id: string): Promise<ActionResult> {
    const auth = await resolveAdminContext();
    if (!auth.success || !auth.data) {
        return fail(auth.code, auth.message);
    }

    const moderatedBy = auth.data.user.email || null;
    const result = await feedbackService.moderate(auth.data.supabase, id, "rejected", moderatedBy);

    if (result.success) {
        revalidatePath("/");
        revalidatePath("/catalog");
        revalidatePath("/admin/feedback");
    }

    return result;
}

export async function approveFeedbackAction(id: string): Promise<void> {
    await approveFeedback(id);
}

export async function rejectFeedbackAction(id: string): Promise<void> {
    await rejectFeedback(id);
}
