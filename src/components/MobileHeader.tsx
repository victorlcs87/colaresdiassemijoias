"use client";

import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { CartDrawer } from './CartDrawer';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/lib/supabase/client';

export function MobileHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
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
            setSearchOpen(false);
            setSearch("");
        }
    };

    if (pathname?.startsWith('/admin')) return null;

    return (
        <>
            <header className="sticky top-0 z-40 flex md:hidden items-center justify-between border-b border-[#d9b7a6] dark:border-[#5a3329] bg-[#f6ede5]/90 dark:bg-[#2a120d]/90 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#5a3329] transition-colors"
                    >
                        <Menu className="h-6 w-6 text-slate-900 dark:text-slate-100" />
                    </button>
                    <Link className="flex items-center gap-2" href="/">
                        <Image src="/brand/logo-colares-dias.png" alt="Logo Colares Dias Semijoias" width={60} height={58} className="object-contain" priority />
                    </Link>
                </div>
                <div className="flex gap-1 items-center">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#5a3329] transition-colors"
                    >
                        <Search className="h-5 w-5 text-slate-900 dark:text-slate-100" />
                    </button>
                    <ThemeToggle />
                    <CartDrawer />
                </div>
            </header>

            {/* Search Bar slide-down */}
            {searchOpen && (
                <div className="md:hidden sticky top-[73px] z-30 bg-[#f6ede5] dark:bg-[#2a120d] border-b border-[#d9b7a6] dark:border-[#5a3329] px-4 py-3 animate-in slide-in-from-top duration-200">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full bg-white dark:bg-[#3a1c15] py-2.5 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-primary placeholder-slate-400 dark:text-white"
                            placeholder="Buscar produtos..."
                            type="text"
                            autoFocus
                        />
                    </form>
                </div>
            )}

            {/* Menu Drawer Overlay */}
            {menuOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="absolute top-0 left-0 h-full w-[280px] bg-[#f6ede5] dark:bg-[#2a120d] shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-[#d9b7a6] dark:border-[#5a3329]">
                            <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                                <Image src="/brand/logo-colares-dias.png" alt="Logo Colares Dias Semijoias" width={56} height={54} className="object-contain" />
                            </Link>
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#5a3329]"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-4 space-y-1 pb-24">
                            {[
                                { href: "/", label: "Início" },
                                { href: "/catalog", label: "Catálogo" },
                                { href: "/catalog?promo=true", label: "🔥 Promoções" },
                                { href: "/about", label: "Sobre Nós" },
                                { href: "/how-to-buy", label: "Como Comprar" },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-[#f0ddcf] dark:hover:bg-[#341810] hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}

                            <div className="mt-6 pt-4 border-t border-[#d9b7a6] dark:border-[#5a3329]">
                                <Link
                                    href={isAuthenticated ? "/admin/dashboard" : "/admin"}
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-[#3a1c15]/70 hover:bg-[#f0ddcf] hover:text-primary transition-colors"
                                >
                                    {isAuthenticated ? "Painel Admin" : "Acesso Admin"}
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
