import "server-only";

import { SupabaseClient } from "@supabase/supabase-js";
import type { FeedbackStatus } from "@/lib/types";

export type FeedbackInsertPayload = {
    customer_name: string;
    comment: string;
    rating: number;
    status: "pending";
};

export class FeedbackRepository {
    async insert(client: SupabaseClient, payload: FeedbackInsertPayload) {
        return client.from("feedbacks").insert(payload);
    }

    async listApproved(client: SupabaseClient) {
        return client
            .from("feedbacks")
            .select("id, created_at, customer_name, comment, rating")
            .eq("status", "approved")
            .order("created_at", { ascending: false });
    }

    async listForModeration(client: SupabaseClient, status?: FeedbackStatus) {
        let query = client
            .from("feedbacks")
            .select("*")
            .order("created_at", { ascending: false });

        if (status) {
            query = query.eq("status", status);
        }

        return query;
    }

    async setStatus(client: SupabaseClient, id: string, status: FeedbackStatus, moderatedBy: string | null) {
        return client
            .from("feedbacks")
            .update({
                status,
                moderated_at: new Date().toISOString(),
                moderated_by: moderatedBy,
            })
            .eq("id", id);
    }

    async deleteById(client: SupabaseClient, id: string) {
        return client.from("feedbacks").delete().eq("id", id);
    }
}

export const feedbackRepository = new FeedbackRepository();
