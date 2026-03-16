import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Camila Oliveira",
        quote: "Comprei meu primeiro conjunto na Colares Dias e fiquei encantada. O atendimento no WhatsApp foi rápido e atencioso."
    },
    {
        name: "Renata Souza",
        quote: "As peças chegaram lindas e com ótimo acabamento. Dá para perceber o cuidado em cada detalhe."
    },
    {
        name: "Mariana Costa",
        quote: "Adorei a curadoria da loja. Recebi recomendações certeiras e já estou escolhendo meu próximo colar."
    }
];

export function Testimonials() {
    return (
        <section className="bg-[#f0ddcf] dark:bg-[#2a120d]/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">O que nossas clientes dizem</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Feedback real de quem ama semijoias</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-white dark:bg-[#2a120d] rounded-xl p-6 shadow-sm border border-[#d9b7a6] dark:border-[#5a3329] hover:shadow-md transition-shadow duration-300">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className="h-5 w-5 fill-current" />
                            ))}
                        </div>
                        <p className="text-sm leading-relaxed mb-6">&quot;{testimonial.quote}&quot;</p>
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                {testimonial.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{testimonial.name}</p>
                                <p className="text-xs text-slate-500">Cliente Verificada</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
