import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Sarah Jenkins",
        quote: "Eu estava cética em comprar pelo catálogo, mas foi tão simples! A Lari me ajudou a escolher o tamanho certo no WhatsApp e o vestido serviu perfeitamente."
    },
    {
        name: "Elena Rodriguez",
        quote: "A qualidade da blusa de seda superou minhas expectativas. A entrega foi rápida e a embalagem linda. Com certeza vou comprar de novo!"
    },
    {
        name: "Mariana Costa",
        quote: "Amei o toque pessoal de conversar com uma pessoa real. Me recomendaram alguns acessórios que combinaram perfeitamente com meu look novo."
    }
];

export function Testimonials() {
    return (
        <section className="bg-[#f0f9f5] dark:bg-[#152a20]/50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">O que nossas clientes dizem</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Feedback real de quem ama moda</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, i) => (
                    <div key={i} className="bg-white dark:bg-[#152a20] rounded-xl p-6 shadow-sm border border-[#e7f3ed] dark:border-[#2a4538] hover:shadow-md transition-shadow duration-300">
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
