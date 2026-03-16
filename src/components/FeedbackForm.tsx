"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import { submitFeedbackWithState } from "@/actions/feedback";
import type { ActionResult } from "@/lib/contracts/action-result";

export function FeedbackForm() {
    const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(submitFeedbackWithState, null);

    return (
        <form action={formAction} className="bg-white dark:bg-[#2a120d] rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] p-6 md:p-7 space-y-4">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Deixe seu feedback</h3>
                <p className="text-xs text-slate-500">Seu comentário passa por moderação</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="customer_name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Nome
                    </label>
                    <input
                        id="customer_name"
                        name="customer_name"
                        required
                        minLength={2}
                        maxLength={80}
                        className="w-full rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-[#f6ede5] dark:bg-[#341810] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        placeholder="Seu nome"
                    />
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="rating" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Avaliação
                    </label>
                    <select
                        id="rating"
                        name="rating"
                        defaultValue="5"
                        className="w-full rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-[#f6ede5] dark:bg-[#341810] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                        <option value="5">5 estrelas</option>
                        <option value="4">4 estrelas</option>
                        <option value="3">3 estrelas</option>
                        <option value="2">2 estrelas</option>
                        <option value="1">1 estrela</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="comment" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Comentário
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    required
                    minLength={10}
                    maxLength={800}
                    rows={4}
                    className="w-full rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-[#f6ede5] dark:bg-[#341810] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Conte como foi sua experiência"
                />
            </div>

            {state && (
                <p
                    role="status"
                    aria-live="polite"
                    className={`text-sm font-semibold ${state.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                    {state.message}
                </p>
            )}

            <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {pending ? "Enviando..." : "Enviar feedback"}
            </button>
        </form>
    );
}
