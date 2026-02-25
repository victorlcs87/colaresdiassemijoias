export function AboutUs() {
    return (
        <section id="about" className="bg-white dark:bg-[#152a20] rounded-3xl overflow-hidden shadow-sm border border-[#e7f3ed] dark:border-[#2a4538]">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Coluna de Texto */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9f5] dark:bg-[#1e362a] text-primary text-xs font-bold uppercase tracking-wide w-fit mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Por trás da marca
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                        Muito prazer, nós somos a <span className="text-primary">Lojinha da Lari</span>
                    </h2>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300">
                        <p>
                            Nascida da paixão por moda acessível e do desejo de oferecer um atendimento verdadeiramente próximo, a Lojinha da Lari não é só mais um e-commerce. Nós somos a sua vitrine digital de tendências.
                        </p>
                        <p>
                            Acreditamos que comprar roupas deve ser tão fácil quanto conversar com uma amiga. Por isso, simplificamos o processo: você escolhe seus looks no nosso catálogo e finaliza tudo pelo WhatsApp, com um atendimento humano que entende do seu estilo.
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Mais do que looks, entregamos carinho em forma de pacotinhos.
                        </p>
                    </div>

                </div>

                {/* Coluna da Imagem */}
                <div className="relative min-h-[400px] md:min-h-full">
                    {/* Imagem Placeholder de Moda/Costura/Loja - usando Unsplash com url absoluta */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop"
                        alt="Detalhes das nossas peças"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay para facilitar transição */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/20 dark:from-[#152a20] dark:via-[#152a20]/20 to-transparent w-full h-full"></div>
                </div>
            </div>
        </section>
    );
}
