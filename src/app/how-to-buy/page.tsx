import { Header } from "@/components/Header";
import Link from "next/link";
import { Search, MessageCircle, CreditCard, Truck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Como Comprar",
    description: "Aprenda como comprar na Colares Dias Semijoias em 4 passos simples via WhatsApp. Pix, cartão e entrega rápida.",
};

export default function HowToBuyPage() {
    const steps = [
        {
            icon: <Search className="size-7" />,
            step: "Passo 1",
            title: "Navegue no Catálogo",
            description: "Explore nossos produtos no site. Use as categorias e filtros para encontrar exatamente o que você procura."
        },
        {
            icon: <MessageCircle className="size-7" />,
            step: "Passo 2",
            title: "Mande uma Mensagem",
            description: "Clique no botão do WhatsApp ou mande o link/foto do produto diretamente para o nosso número."
        },
        {
            icon: <CreditCard className="size-7" />,
            step: "Passo 3",
            title: "Confirme os Detalhes",
            description: "Nosso time confirmará o estoque e enviará as opções de pagamento. Após o pagamento, preparamos o seu pedido."
        },
        {
            icon: <Truck className="size-7" />,
            step: "Passo 4",
            title: "Receba em Casa",
            description: "Relaxe e espere! Enviaremos o pedido para o endereço informado em até 3 dias úteis."
        }
    ];

    const timeline = [
        {
            icon: <Search className="size-4" />,
            step: "Passo 1",
            title: "Encontre seu item",
            description: "Navegue pelas categorias e use a busca para encontrar produtos específicos ou tendências."
        },
        {
            icon: <MessageCircle className="size-4" />,
            step: "Passo 2",
            title: "Conecte-se no WhatsApp",
            description: "Mande um 'Oi' para nosso número. Nossa equipe responde rapidamente para te orientar."
        },
        {
            icon: <CreditCard className="size-4" />,
            step: "Passo 3",
            title: "Pagamento Seguro",
            description: "Aceitamos Pix e transferência bancária."
        },
        {
            icon: <Truck className="size-4" />,
            step: "Passo 4",
            title: "Pedido Recebido",
            description: "Acompanhe seu pacote pelo link que enviaremos no WhatsApp. Aproveite sua compra!"
        }
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 antialiased">
            <Header />

            <main className="flex-grow flex flex-col items-center w-full">
                {/* Hero */}
                <div className="w-full bg-gradient-to-b from-primary/5 to-transparent py-12 md:py-20 px-4">
                    <div className="max-w-[960px] mx-auto text-center space-y-6">
                        <div className="inline-flex items-center justify-center p-2 bg-white dark:bg-[#2a120d] rounded-full shadow-sm mb-4">
                            <Search className="size-4 text-primary mr-2" />
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 pr-2">Guia de Compras Simples</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Como Comprar
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
                            Comprar seus produtos favoritos via WhatsApp é muito simples. Siga nosso guia rápido e comece agora.
                        </p>
                    </div>
                </div>

                {/* Cards de Passos */}
                <div className="w-full max-w-[1100px] px-4 py-12 md:py-16">
                    <div className="flex flex-col gap-4 mb-10">
                        <h2 className="text-3xl font-bold leading-tight">Processo de Compra</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base">
                            Siga estes 4 passos simples para receber seu pedido na sua porta.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((item, i) => (
                            <div key={i} className="group flex flex-col gap-4 p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#2a120d] hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{item.step}</span>
                                    <h3 className="text-lg font-bold">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Vertical */}
                <div className="w-full bg-white dark:bg-[#2a120d] py-16 border-y border-[#d9b7a6] dark:border-[#5a3329]">
                    <div className="max-w-[720px] mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold mb-2">Passo a Passo Detalhado</h2>
                            <p className="text-slate-500 dark:text-slate-400">Uma visão mais próxima de cada etapa.</p>
                        </div>
                        <div className="relative">
                            {/* Linha Vertical */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-[#d9b7a6] dark:bg-[#5a3329] z-0"></div>

                            {timeline.map((item, i) => (
                                <div key={i} className={`relative z-10 grid grid-cols-[40px_1fr] gap-6 ${i < timeline.length - 1 ? 'mb-10' : ''}`}>
                                    <div className="flex flex-col items-center">
                                        <div className={`size-10 rounded-full border-2 border-primary flex items-center justify-center shadow-sm ${i === timeline.length - 1 ? 'bg-primary text-white' : 'bg-white dark:bg-[#2a120d] text-primary'}`}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold">{item.title}</h3>
                                            <span className="bg-[#d9b7a6] dark:bg-[#5a3329] text-slate-500 dark:text-slate-400 text-xs px-2 py-1 rounded-full font-medium">{item.step}</span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="w-full py-20 px-4 flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-black leading-tight mb-4">
                        Pronta para comprar?
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-lg">
                        Navegue pelo catálogo agora e descubra a forma mais fácil de comprar online.
                    </p>
                    <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
                        <Link
                            href="/catalog"
                            className="bg-primary text-white hover:bg-primary/90 px-8 py-3 rounded-xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 min-w-[200px]"
                        >
                            <span>Começar a Comprar</span>
                            <ArrowRight className="size-4" />
                        </Link>
                        <a
                            href="https://wa.me/5561982865191"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white dark:bg-[#2a120d] border border-[#d9b7a6] dark:border-[#5a3329] hover:bg-gray-50 dark:hover:bg-[#5a3329] px-8 py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 min-w-[200px]"
                        >
                            <span>Falar com Suporte</span>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
