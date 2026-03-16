"use client";

import Link from "next/link";
import { Package, LayoutDashboard, TrendingUp, DollarSign } from "lucide-react";

interface AdminDashboardContentProps {
    username: string;
    stats: {
        totalProducts: number;
        activeProducts: number;
        avgPrice: number;
    };
}

export default function AdminDashboardContent({ username, stats }: AdminDashboardContentProps) {

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* O Header do Admin global já está cuidando da Topbar através do AdminLayout */}

            {/* Conteúdo do Dashboard */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Bem-vinda ao Painel, {username}! 🌸
                    </h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Gerencie seus produtos, visualize estatísticas e administre sua loja.
                    </p>
                </div>

                {/* Cards de estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total de Produtos */}
                    <div className="bg-white dark:bg-[#2a120d] rounded-lg shadow p-6 border border-[#d9b7a6] dark:border-[#5a3329] flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-md">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total de Produtos</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-auto">{stats.totalProducts}</p>
                    </div>

                    {/* Produtos Ativos */}
                    <div className="bg-white dark:bg-[#2a120d] rounded-lg shadow p-6 border border-[#d9b7a6] dark:border-[#5a3329] flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Produtos Ativos</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-auto">{stats.activeProducts}</p>
                    </div>

                    {/* Produtos Inativos */}
                    <div className="bg-white dark:bg-[#2a120d] rounded-lg shadow p-6 border border-[#d9b7a6] dark:border-[#5a3329] flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                                <LayoutDashboard className="h-5 w-5 text-slate-500" />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Rascunhos</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-auto">{stats.totalProducts - stats.activeProducts}</p>
                    </div>

                    {/* Preço Médio */}
                    <div className="bg-white dark:bg-[#2a120d] rounded-lg shadow p-6 border border-[#d9b7a6] dark:border-[#5a3329] flex flex-col">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Preço Médio</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-auto">
                            R$ {stats.avgPrice.toFixed(2).replace('.', ',')}
                        </p>
                    </div>
                </div>

                {/* Ações rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/admin/products"
                        className="bg-white dark:bg-[#2a120d] rounded-lg shadow p-6 border border-[#d9b7a6] dark:border-[#5a3329] hover:shadow-md transition-shadow group flex flex-col justify-between h-full"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                    Gerenciar Produtos
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Acesse a listagem completa
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-xs font-medium text-primary ml-auto">
                            Acessar →
                        </p>
                    </Link>
                </div>
            </main>
        </div>
    );
}
