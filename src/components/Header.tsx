"use client";

import { Search, UserCircle } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { CartDrawer } from "./CartDrawer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Header() {
    const [search, setSearch] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsAuthenticated(!!session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/catalog?q=${encodeURIComponent(search.trim())}`);
        }
    };

    if (pathname?.startsWith('/admin')) return null;

    return (
        <header className="hidden md:block sticky top-0 z-50 w-full bg-[#f6ede5] dark:bg-[#2a120d] border-b border-[#d9b7a6] dark:border-[#5a3329]">
            <div className="px-8 lg:px-12 py-4 flex items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <Link className="flex items-center gap-3 text-slate-900 dark:text-slate-100 group" href="/">
                        <Image src="/brand/logo-colares-dias.png" alt="Logo Colares Dias Semijoias" width={72} height={69} className="object-contain" priority />
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 pl-4">
                        <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/catalog">Catálogo</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/about">Sobre Nós</Link>
                        <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/how-to-buy">Como Comprar</Link>
                        <Link className="text-sm font-semibold text-[#8b2e1f] hover:text-[#6b2b17] transition-colors" href="/catalog?promo=true">Promoção</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <form onSubmit={handleSearch} className="hidden lg:flex w-full max-w-sm relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search className="h-5 w-5" />
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-full border-none bg-white dark:bg-[#3a1c15] py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary placeholder-slate-400 dark:text-white shadow-sm"
                            placeholder="Buscar produtos..."
                            type="text"
                        />
                    </form>
                    <div className="flex gap-2 items-center">
                        <ThemeToggle />
                        <CartDrawer />
                        <Link href={isAuthenticated ? "/admin/dashboard" : "/admin"} className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#3a1c15] hover:bg-slate-100 dark:hover:bg-[#5a3329] transition-colors shadow-sm text-slate-900 dark:text-slate-100" title={isAuthenticated ? "Painel Admin" : "Acesso Admin"}>
                            <UserCircle className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
