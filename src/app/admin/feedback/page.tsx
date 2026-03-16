import { CheckCircle2, Clock3, Star, XCircle } from "lucide-react";
import { approveFeedbackAction, listFeedbackForAdmin, rejectFeedbackAction } from "@/actions/feedback";
import type { Feedback } from "@/lib/types";

function FeedbackCard({
    feedback,
    showActions = false,
}: {
    feedback: Feedback;
    showActions?: boolean;
}) {
    const approveAction = approveFeedbackAction.bind(null, feedback.id);
    const rejectAction = rejectFeedbackAction.bind(null, feedback.id);

    return (
        <article className="rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#2a120d] p-5">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-bold text-slate-900 dark:text-white">{feedback.customer_name}</p>
                    <p className="text-xs text-slate-500">
                        {new Date(feedback.created_at).toLocaleDateString("pt-BR")}
                    </p>
                </div>
                <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: feedback.rating }, (_, idx) => (
                        <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                &quot;{feedback.comment}&quot;
            </p>

            {showActions && (
                <div className="mt-4 flex items-center gap-2">
                    <form action={approveAction}>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Aprovar
                        </button>
                    </form>
                    <form action={rejectAction}>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                        >
                            <XCircle className="h-4 w-4" />
                            Rejeitar
                        </button>
                    </form>
                </div>
            )}
        </article>
    );
}

export default async function AdminFeedbackPage() {
    const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        listFeedbackForAdmin("pending"),
        listFeedbackForAdmin("approved"),
        listFeedbackForAdmin("rejected"),
    ]);

    if (!pendingResult.success || !approvedResult.success || !rejectedResult.success) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Feedbacks</h2>
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                    Não foi possível carregar os feedbacks para moderação.
                </p>
            </div>
        );
    }

    const pendingFeedbacks = pendingResult.data || [];
    const approvedFeedbacks = approvedResult.data || [];
    const rejectedFeedbacks = rejectedResult.data || [];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Moderação de Feedbacks</h2>
                <p className="text-slate-500 mt-1">
                    Aprove ou rejeite comentários antes da publicação no site.
                </p>
            </div>

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-amber-600" />
                    <h3 className="text-xl font-bold">Pendentes ({pendingFeedbacks.length})</h3>
                </div>
                {pendingFeedbacks.length === 0 ? (
                    <p className="rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#2a120d] p-4 text-sm text-slate-500">
                        Nenhum feedback pendente.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingFeedbacks.map((feedback) => (
                            <FeedbackCard key={feedback.id} feedback={feedback} showActions />
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h3 className="text-xl font-bold">Aprovados ({approvedFeedbacks.length})</h3>
                </div>
                {approvedFeedbacks.length === 0 ? (
                    <p className="rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#2a120d] p-4 text-sm text-slate-500">
                        Nenhum feedback aprovado.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {approvedFeedbacks.map((feedback) => (
                            <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="text-xl font-bold">Rejeitados ({rejectedFeedbacks.length})</h3>
                </div>
                {rejectedFeedbacks.length === 0 ? (
                    <p className="rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#2a120d] p-4 text-sm text-slate-500">
                        Nenhum feedback rejeitado.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rejectedFeedbacks.map((feedback) => (
                            <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
