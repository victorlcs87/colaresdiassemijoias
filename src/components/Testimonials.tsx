import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { feedbackService } from "@/lib/services/feedback.service";
import { FeedbackForm } from "@/components/FeedbackForm";

type TestimonialsProps = {
    withForm?: boolean;
};

export async function Testimonials({ withForm = true }: TestimonialsProps) {
    const supabase = await createClient();
    const feedbackResult = await feedbackService.listShowcase(supabase, 3);
    const testimonials = feedbackResult.success && feedbackResult.data ? feedbackResult.data : [];

    return (
        <section className="bg-[#f0ddcf] dark:bg-[#2a120d]/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">O que nossas clientes dizem</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Feedback real de quem ama semijoias</p>
            </div>

            {testimonials.length === 0 ? (
                <div className="rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white/80 dark:bg-[#2a120d] p-6 text-center text-sm text-slate-600 dark:text-slate-300">
                    Ainda não há feedbacks aprovados para exibir.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white dark:bg-[#2a120d] rounded-xl p-6 shadow-sm border border-[#d9b7a6] dark:border-[#5a3329] hover:shadow-md transition-shadow duration-300">
                            <div className="flex gap-1 text-yellow-400 mb-4">
                                {Array.from({ length: testimonial.rating }, (_, idx) => (
                                    <Star key={idx} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed mb-6">&quot;{testimonial.comment}&quot;</p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {testimonial.customer_name[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{testimonial.customer_name}</p>
                                    <p className="text-xs text-slate-500">Cliente Verificada</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {withForm && (
                <div className="mt-8 md:mt-10">
                    <FeedbackForm />
                </div>
            )}
        </section>
    );
}
