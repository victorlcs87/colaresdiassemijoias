import { MessageCircle } from "lucide-react";

export function HeroBanner() {
    return (
        <section
            className="relative w-full rounded-2xl overflow-hidden min-h-[200px] md:min-h-[280px] flex items-center justify-start px-5 md:px-12 py-8"
            style={{
                backgroundImage: "linear-gradient(to right, rgba(16, 34, 25, 0.8) 0%, rgba(16, 34, 25, 0.4) 50%, rgba(0,0,0,0) 100%), url('https://images.unsplash.com/photo-1563089145-599997674dc9?w=1600&auto=format&fit=crop&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            <div className="relative z-10 max-w-xl flex flex-col gap-3 md:gap-4 animate-fade-in-up">
                <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary font-bold text-[10px] md:text-xs uppercase tracking-wider w-fit">
                    Destaques da Semana
                </span>
                <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight">
                    Novidades que <br className="hidden sm:block" /> <span className="text-primary">Encantam</span>
                </h1>
                <p className="text-gray-200 text-sm md:text-base font-medium leading-relaxed max-w-md hidden md:block">
                    Explore as peças exclusivas desta semana.
                </p>
                <button className="flex items-center justify-center gap-2 w-full md:w-fit bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 px-6 rounded-full text-sm transition-all transform hover:scale-105 shadow-xl mt-2">
                    <MessageCircle className="h-4 w-4" />
                    Compre pelo WhatsApp
                </button>
            </div>
        </section>
    );
}
