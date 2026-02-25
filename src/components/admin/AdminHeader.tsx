/* eslint-disable @next/next/no-img-element */
"use client";

import { Search, Bell, Menu, X, Package, PlusCircle, Settings, Receipt, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";

export function AdminHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/admin/products") {
            return pathname === path || (pathname.startsWith("/admin/products") && !pathname.includes("new"));
        }
        return pathname === path || pathname.startsWith(`${path}/`);
    };
    return (
        <>
            <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-[#152a20] border-b border-[#e7f3ed] dark:border-[#2a4538] shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-3 flex-1 max-w-[200px] sm:max-w-md">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1b2f24] text-slate-600 dark:text-slate-400"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="w-full relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            className="w-full bg-[#f8fcfa] dark:bg-[#1b2f24] border-none rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary/50 text-sm placeholder-slate-400 dark:text-white"
                            placeholder="Buscar..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => alert("Não há notificações no momento.")}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#1b2f24] relative text-slate-600 dark:text-slate-400 transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="h-8 w-px bg-slate-200 dark:bg-[#2a4538] mx-2"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">Larissa Colares</p>
                            <p className="text-[10px] text-slate-500">Administradora</p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-[#2a4538] overflow-hidden bg-slate-100 dark:bg-[#1b2f24]">
                            {/* Placeholder for admin avatar */}
                            <img
                                src="https://ui-avatars.com/api/?name=Larissa+Colares&background=13ec80&color=0d1b14"
                                alt="Admin profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            {
                menuOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                            onClick={() => setMenuOpen(false)}
                        />
                        <div className="relative w-[280px] h-full bg-white dark:bg-[#152a20] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                            <div className="p-4 flex items-center justify-between border-b border-[#e7f3ed] dark:border-[#2a4538]">
                                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                                    <Image src="/logo-transparent.png" alt="Lojinha da Lari Logo" width={100} height={32} className="object-contain" />
                                </Link>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="p-2 justify-end rounded-full hover:bg-slate-100 dark:hover:bg-[#2a4538]"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>

                            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                                <Link
                                    href="/admin/products"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/products")
                                        ? "bg-[#f0f9f5] dark:bg-[#1e362a] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f8fcfa] dark:hover:bg-[#1b2f24] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Package className="w-5 h-5" />
                                    <span>Produtos</span>
                                </Link>
                                <Link
                                    href="/admin/products/new"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/products/new")
                                        ? "bg-[#f0f9f5] dark:bg-[#1e362a] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f8fcfa] dark:hover:bg-[#1b2f24] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span>Add Produto</span>
                                </Link>
                                <Link
                                    href="/admin/sales"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/sales")
                                        ? "bg-[#f0f9f5] dark:bg-[#1e362a] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f8fcfa] dark:hover:bg-[#1b2f24] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Receipt className="w-5 h-5" />
                                    <span>Vendas</span>
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${isActive("/admin/settings")
                                        ? "bg-[#f0f9f5] dark:bg-[#1e362a] text-primary"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-[#f8fcfa] dark:hover:bg-[#1b2f24] hover:text-slate-900 dark:hover:text-white"
                                        }`}
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Configurações</span>
                                </Link>
                            </nav>
                            <div className="p-4 border-t border-[#e7f3ed] dark:border-[#2a4538]">
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
