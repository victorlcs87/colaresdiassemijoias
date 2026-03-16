export function AboutUs() {
    return (
        <section id="about" className="bg-white dark:bg-[#2a120d] rounded-3xl overflow-hidden shadow-sm border border-[#d9b7a6] dark:border-[#5a3329]">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Coluna de Texto */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary text-xs font-bold uppercase tracking-wide w-fit mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Por trás da marca
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                        Muito prazer, nós somos a <span className="text-primary">Colares Dias Semijoias</span>
                    </h2>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300">
                        <p>
                            Nascida da paixão por acessórios marcantes e atendimento próximo, a Colares Dias Semijoias é mais do que uma vitrine online. É um espaço para encontrar peças com personalidade.
                        </p>
                        <p>
                            Acreditamos que escolher semijoias deve ser tão simples quanto conversar com uma amiga. Você escolhe suas peças no catálogo e finaliza pelo WhatsApp com atendimento humano e rápido.
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                            Mais do que acessórios, entregamos beleza, cuidado e confiança em cada envio.
                        </p>
                    </div>

                </div>

                {/* Coluna da Imagem */}
                <div className="relative min-h-[400px] md:min-h-full">
                    {/* Imagem Placeholder de Moda/Costura/Loja - usando Unsplash com url absoluta */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1200&auto=format&fit=crop"
                        alt="Detalhes das semijoias da Colares Dias"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Overlay para facilitar transição */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/20 dark:from-[#2a120d] dark:via-[#2a120d]/20 to-transparent w-full h-full"></div>
                </div>
            </div>
        </section>
    );
}
