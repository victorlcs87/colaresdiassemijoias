"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, PlusCircle, Settings, LogOut, Store, Receipt, MessageSquareQuote } from "lucide-react";
import { signOut } from "@/actions/auth";

export function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/admin/products") {
            return pathname === path || (pathname.startsWith("/admin/products") && !pathname.includes("new"));
        }
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
        <aside className="hidden md:flex w-64 border-r border-[#d9b7a6] dark:border-[#5a3329] bg-[#f6ede5] dark:bg-[#2a120d] flex-col h-screen sticky top-0 shrink-0">
            <Link href="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm shrink-0">
                    <Store className="w-6 h-6" />
                </div>
                <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">Colares Dias</h1>
            </Link>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link
                    href="/admin/products"
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
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Sair</span>
                </button>
            </div>
        </aside>
    );
}
