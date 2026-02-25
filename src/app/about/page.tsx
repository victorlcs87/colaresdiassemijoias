import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users, Handshake, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sobre Nós",
    description: "Conheça a história da Lojinha da Lari — moda de qualidade, curadoria pessoal e atendimento humanizado via WhatsApp.",
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
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 text-white max-w-4xl">
                            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase mb-4 border border-white/10">
                                Desde 2024
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                                Mais do que uma loja.<br /> Somos uma <span className="text-primary">comunidade</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-100 font-light max-w-2xl leading-relaxed">
                                Bem-vinda ao nosso cantinho. Acreditamos em transparência, qualidade escolhida a dedo e em construir laços reais que vão além de uma compra.
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
                            Cada interação com a Lojinha da Lari é pensada para ser especial. Não estamos apenas vendendo produtos; estamos te entregando carinho em cada pacotinho.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-[#152a20] p-8 rounded-xl border border-[#e7f3ed] dark:border-[#2a4538] hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <ShieldCheck className="size-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Qualidade Escolhida a Dedo</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                A Lari pessoalmente verifica cada peça e produto para garantir que atende aos nossos padrões antes de chegar ao catálogo.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#152a20] p-8 rounded-xl border border-[#e7f3ed] dark:border-[#2a4538] hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Users className="size-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Suporte Personalizado</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Sem robôs. Converse diretamente com a Lari pelo WhatsApp para dicas de estilo, dúvidas de envio, ou apenas bater um papo sobre moda.
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#152a20] p-8 rounded-xl border border-[#e7f3ed] dark:border-[#2a4538] hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Handshake className="size-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Conexão Direta</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Encurtamos a distância entre você e as melhores peças. Sem intermediários, preços justos e um atendimento que faz você se sentir em casa.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Nossa Jornada */}
                <section className="w-full bg-[#f0f9f5] dark:bg-[#152a20]/50 py-20 border-y border-[#e7f3ed] dark:border-[#2a4538]">
                    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2">
                                <div className="relative">
                                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 dark:bg-[#1e362a]">
                                        <Image
                                            alt="Espaço de trabalho da Lojinha da Lari"
                                            className="object-cover hover:scale-105 transition-transform duration-500"
                                            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop"
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                                <h2 className="text-primary font-bold text-sm tracking-widest uppercase">Nossa Jornada</h2>
                                <h3 className="text-3xl md:text-4xl font-bold leading-tight">De um hobby de moda a uma comunidade de estilo.</h3>
                                <div className="space-y-4 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                                    <p>
                                        Tudo começou em 2024 com uma ideia simples: moda de qualidade deveria ser acessível para todas. A Lari viu que muitas peças lindas nunca chegavam a quem merecia usá-las, simplesmente por falta de um canal direto e descomplicado.
                                    </p>
                                    <p>
                                        O que começou como um catálogo caseiro cresceu e se tornou uma plataforma vibrante que conecta peças exclusivas a mulheres que valorizam estilo, qualidade e um atendimento que faz a diferença.
                                    </p>
                                    <p>
                                        Hoje, temos orgulho de ser essa ponte. Cuidamos da curadoria e da logística para que você só precise se preocupar com uma coisa: arrasar no look.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full py-20 px-4 flex flex-col items-center text-center bg-[#f0f9f5] dark:bg-[#152a20]/30">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-[#152a20] rounded-2xl p-10 md:p-16 shadow-sm border border-[#e7f3ed] dark:border-[#2a4538]">
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
                                href="https://wa.me/5511999999999"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 h-12 bg-white dark:bg-[#1e362a] border border-[#e7f3ed] dark:border-[#2a4538] text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-[#2a4538] transition-colors flex items-center justify-center gap-2"
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
