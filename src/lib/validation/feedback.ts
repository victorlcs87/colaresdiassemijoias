import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";
import type { FeedbackStatus } from "@/lib/types";

export type FeedbackSubmission = {
    customerName: string;
    comment: string;
    rating: number;
};

export function parseFeedbackFormData(formData: FormData): ActionResult<FeedbackSubmission> {
    const customerName = (formData.get("customer_name") as string)?.trim();
    const comment = (formData.get("comment") as string)?.trim();
    const ratingRaw = Number(formData.get("rating") as string);

    if (!customerName || customerName.length < 2 || customerName.length > 80) {
        return fail("VALIDATION_ERROR", "Informe um nome entre 2 e 80 caracteres.");
    }

    if (!comment || comment.length < 10 || comment.length > 800) {
        return fail("VALIDATION_ERROR", "O comentário deve ter entre 10 e 800 caracteres.");
    }

    if (!Number.isInteger(ratingRaw) || ratingRaw < 1 || ratingRaw > 5) {
        return fail("VALIDATION_ERROR", "A avaliação deve ser entre 1 e 5 estrelas.");
    }

    return ok("Feedback válido.", {
        customerName,
        comment,
        rating: ratingRaw,
    });
}

export function parseFeedbackStatus(status: string): ActionResult<FeedbackStatus> {
    if (status !== "pending" && status !== "approved" && status !== "rejected") {
        return fail("VALIDATION_ERROR", "Status de moderação inválido.");
    }

    return ok("Status válido.", status);
}
