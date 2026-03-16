import "server-only";

import { fail, ok, type ActionResult } from "@/lib/contracts/action-result";
import { feedbackRepository } from "@/lib/repositories/feedback.repository";
import type { Feedback, FeedbackStatus } from "@/lib/types";
import { parseFeedbackFormData } from "@/lib/validation/feedback";

export class FeedbackService {
    parseSubmission(formData: FormData) {
        return parseFeedbackFormData(formData);
    }

    async submit(
        supabase: Parameters<typeof feedbackRepository.insert>[0],
        formData: FormData,
    ): Promise<ActionResult> {
        const parsed = this.parseSubmission(formData);
        if (!parsed.success || !parsed.data) {
            return fail(parsed.code, parsed.message);
        }

        const { customerName, comment, rating } = parsed.data;

        const { error } = await feedbackRepository.insert(supabase, {
            customer_name: customerName,
            comment,
            rating,
            status: "pending",
        });

        if (error) {
            return fail("FEEDBACK_CREATE_ERROR", `Erro ao enviar feedback: ${error.message}`);
        }

        return ok("Feedback enviado com sucesso e aguardando moderação.");
    }

    async listShowcase(
        supabase: Parameters<typeof feedbackRepository.listApproved>[0],
        limit = 3,
    ): Promise<ActionResult<Feedback[]>> {
        const { data, error } = await feedbackRepository.listApproved(supabase);
        if (error) {
            return fail("FEEDBACK_FETCH_ERROR", `Erro ao carregar feedbacks: ${error.message}`);
        }

        const approved = (data || []) as Feedback[];

        if (approved.length <= limit) {
            return ok("Feedbacks carregados.", approved);
        }

        // Rodízio previsível: muda a cada 2 horas.
        const rotationSeed = Math.floor(Date.now() / (1000 * 60 * 60 * 2));
        const startIndex = rotationSeed % approved.length;
        const rotated = approved.slice(startIndex).concat(approved.slice(0, startIndex));

        return ok("Feedbacks carregados com rodízio.", rotated.slice(0, limit));
    }

    async listForAdmin(
        supabase: Parameters<typeof feedbackRepository.listForModeration>[0],
        status?: FeedbackStatus,
    ): Promise<ActionResult<Feedback[]>> {
        const { data, error } = await feedbackRepository.listForModeration(supabase, status);
        if (error) {
            return fail("FEEDBACK_FETCH_ERROR", `Erro ao carregar feedbacks: ${error.message}`);
        }

        return ok("Feedbacks carregados.", (data || []) as Feedback[]);
    }

    async moderate(
        supabase: Parameters<typeof feedbackRepository.setStatus>[0],
        id: string,
        status: Exclude<FeedbackStatus, "pending">,
        moderatedBy: string | null,
    ): Promise<ActionResult> {
        if (!id) {
            return fail("VALIDATION_ERROR", "ID do feedback é obrigatório.");
        }

        const { error } = await feedbackRepository.setStatus(supabase, id, status, moderatedBy);
        if (error) {
            return fail("FEEDBACK_MODERATION_ERROR", `Erro ao moderar feedback: ${error.message}`);
        }

        return ok("Status de feedback atualizado com sucesso.");
    }
}

export const feedbackService = new FeedbackService();
