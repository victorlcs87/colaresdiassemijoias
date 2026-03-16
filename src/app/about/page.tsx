import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users, Handshake, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sobre Nós",
    description: "Conheça a história da Colares Dias Semijoias, com curadoria autoral e atendimento humanizado via WhatsApp.",
};

export default function AboutPage() {
    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 antialiased">
            <Header />

            <main className="flex-grow">
                {/* Hero */}
                <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
                    <div className="relative w-full h-[500px] lg:h-[600px] rounded-xl overflow-hidden group shadow-md">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1600&auto=format&fit=crop')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 text-white max-w-4xl">
                            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-4 border border-white/10">
                                Desde 2024
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                                Mais do que uma loja.<br /> Somos uma <span className="text-[#f2e4d8]">experiência</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-100 font-light max-w-2xl leading-relaxed">
                                Acreditamos em atendimento próximo, qualidade e peças que valorizam sua identidade em cada ocasião.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Por que nos escolher */}
                <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-2xl">
                            <h2 className="text-primary font-bold text-sm tracking-widest uppercase mb-3">Por que nos escolher</h2>
                            <h3 className="text-3xl md:text-4xl font-bold leading-tight">Construída na confiança, alimentada pela paixão.</h3>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md text-base leading-relaxed">
                            Cada interação com a Colares Dias Semijoias é pensada para ser especial. Não estamos apenas vendendo produtos; estamos te entregando carinho em cada pacotinho.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#2a120d] p-8 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <ShieldCheck className="size-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Qualidade Escolhida a Dedo</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Cada item passa por curadoria cuidadosa antes de entrar no catálogo para garantir acabamento e estilo.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#2a120d] p-8 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Users className="size-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Suporte Personalizado</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Atendimento humano de verdade no WhatsApp para tirar dúvidas, receber sugestões e acompanhar seu pedido.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#2a120d] p-8 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Handshake className="size-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Conexão Direta</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Sem intermediários: você fala direto com a loja e compra com transparência, praticidade e segurança.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Nossa Jornada */}
                <section className="w-full bg-[#f0ddcf] dark:bg-[#2a120d]/50 py-20 border-y border-[#d9b7a6] dark:border-[#5a3329]">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2">
                                <div className="relative">
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#3a1c15]">
                                        <Image
                                            alt="Espaço de trabalho da Colares Dias Semijoias"
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                                <h2 className="text-primary font-bold text-sm tracking-widest uppercase">Nossa Jornada</h2>
                                <h3 className="text-3xl md:text-4xl font-bold leading-tight">De um sonho empreendedor a uma marca de semijoias.</h3>
                                <div className="space-y-4 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                                    <p>
                                        Tudo começou com uma ideia simples: tornar o acesso a acessórios e semijoias mais elegante, próximo e descomplicado.
                                    </p>
                                    <p>
                                        O catálogo evoluiu para uma loja digital com curadoria autoral, conectando peças exclusivas a clientes que valorizam personalidade e qualidade.
                                    </p>
                                    <p>
                                        Hoje, seguimos com o mesmo propósito: facilitar sua escolha e garantir uma experiência de compra acolhedora do início ao fim.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full py-20 px-4 flex flex-col items-center text-center bg-[#f0ddcf] dark:bg-[#2a120d]/30">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-[#2a120d] rounded-2xl p-10 md:p-16 shadow-sm border border-[#d9b7a6] dark:border-[#5a3329]">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronta para encontrar algo especial?</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                            Navegue pelo nosso catálogo ou mande uma mensagem. Estamos aqui para te ajudar a encontrar a peça perfeita.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/catalog"
                                className="w-full sm:w-auto px-8 h-12 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                Ver Catálogo
                                <ArrowRight className="size-4" />
                            </Link>
                            <a
                                href="https://wa.me/5561982865191"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 h-12 bg-white dark:bg-[#3a1c15] border border-[#d9b7a6] dark:border-[#5a3329] text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-[#5a3329] transition-colors flex items-center justify-center gap-2"
                            >
                                Chamar no WhatsApp
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
