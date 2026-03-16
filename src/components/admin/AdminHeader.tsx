/* eslint-disable @next/next/no-img-element */
"use client";

import { Search, Bell, Menu, X, Package, PlusCircle, Settings, Receipt, LogOut, MessageSquareQuote } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";

export function AdminHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [headerNotice, setHeaderNotice] = useState("");
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/admin/products") {
            return pathname === path || (pathname.startsWith("/admin/products") && !pathname.includes("new"));
        }
        return pathname === path || pathname.startsWith(`${path}/`);
    };
    return (
        <>
            <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-[#f6ede5] dark:bg-[#2a120d] border-b border-[#d9b7a6] dark:border-[#5a3329] shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-3 flex-1 max-w-[200px] sm:max-w-md">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#341810] text-slate-600 dark:text-slate-400"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="w-full relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            className="w-full bg-white dark:bg-[#341810] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/50 text-sm placeholder-slate-400 dark:text-white"
                            placeholder="Buscar..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setHeaderNotice("Não há notificações no momento.");
                            window.setTimeout(() => setHeaderNotice(""), 2500);
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#341810] relative text-slate-600 dark:text-slate-400 transition-colors"
                        aria-label="Ver notificações"
                    >
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-slate-200 dark:bg-[#5a3329] mx-2"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Admin Colares Dias</p>
                            <p className="text-[10px] text-slate-500">Administradora</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-[#5a3329] overflow-hidden bg-slate-100 dark:bg-[#341810]">
                            {/* Placeholder for admin avatar */}
                            <img
                                src="https://ui-avatars.com/api/?name=Colares+Dias&background=6b2b17&color=ffffff"
                                alt="Admin profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>
            {headerNotice && (
                <div
                    role="status"
                    aria-live="polite"
                    className="px-4 md:px-8 py-2 text-xs font-medium text-amber-700 bg-amber-50 border-b border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/40"
                >
                    {headerNotice}
                </div>
            )}

            {/* Mobile Drawer */}
            {
                menuOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="relative w-[280px] h-full bg-[#f6ede5] dark:bg-[#2a120d] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                            <div className="p-4 flex items-center justify-between border-b border-[#d9b7a6] dark:border-[#5a3329]">
                                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                                    <Image src="/brand/logo-colares-dias.png" alt="Logo Colares Dias Semijoias" width={56} height={54} className="object-contain" />
                                </Link>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="p-2 justify-end rounded-full hover:bg-slate-100 dark:hover:bg-[#5a3329]"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                                <Link
                                    href="/admin/products"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/products")
                                        ? "bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f6ede5] dark:hover:bg-[#341810] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Package className="w-5 h-5" />
                                    <span>Produtos</span>
                                </Link>
                                <Link
                                    href="/admin/products/new"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/products/new")
                                        ? "bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f6ede5] dark:hover:bg-[#341810] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span>Add Produto</span>
                                </Link>
                                <Link
                                    href="/admin/sales"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/sales")
                                        ? "bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f6ede5] dark:hover:bg-[#341810] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Receipt className="w-5 h-5" />
                                    <span>Vendas</span>
                                </Link>
                                <Link
                                    href="/admin/feedback"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/feedback")
                                        ? "bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f6ede5] dark:hover:bg-[#341810] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <MessageSquareQuote className="w-5 h-5" />
                                    <span>Feedbacks</span>
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/settings")
                                        ? "bg-[#f0ddcf] dark:bg-[#3a1c15] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f6ede5] dark:hover:bg-[#341810] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Configurações</span>
                                </Link>
                            </nav>
                            <div className="p-4 border-t border-[#d9b7a6] dark:border-[#5a3329]">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        signOut();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
