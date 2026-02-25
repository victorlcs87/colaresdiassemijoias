"use client";

import { useState, useEffect } from "react";
import {
    Receipt,
    TrendingUp,
    DollarSign,
    Calendar,
    Package,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    RotateCcw,
} from "lucide-react";
import { getSalesReport, undoSale } from "@/actions/sales";

interface Sale {
    id: string;
    product_name: string;
    product_color: string | null;
    product_image: string | null;
    cost_price: number | null;
    sale_price: number;
    sale_date: string;
    notes: string | null;
    created_at: string;
}

interface Report {
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
    totalSales: number;
    sales: Sale[];
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export default function AdminSalesPage() {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<Report | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    async function loadReport() {
        setLoading(true);
        const data = await getSalesReport(startDate || undefined, endDate || undefined);
        setReport(data);
        setLoading(false);
    }

    useEffect(() => {
        loadReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUndoSale = async (saleId: string) => {
        if (!confirm("Tem certeza que deseja desfazer esta venda? O produto voltará a ficar disponível na loja.")) return;

        setLoading(true);
        const res = await undoSale(saleId);
        if (res.success) {
            await loadReport();
        } else {
            alert(res.error || "Erro ao desfazer venda");
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Relatório de Vendas</h2>
                    <p className="text-slate-500 mt-1">Acompanhe suas vendas, custos e lucros</p>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Data Início</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-[#f8fcfa] dark:bg-[#1b2f24] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Data Fim</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-[#f8fcfa] dark:bg-[#1b2f24] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={loadReport}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-slate-900 font-bold text-sm rounded-lg hover:brightness-110 transition-all shadow-sm disabled:opacity-50"
                    >
                        <Calendar className="w-4 h-4" />
                        Filtrar
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : report ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vendas</span>
                                <Package className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{report.totalSales}</p>
                        </div>
                        <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receita Total</span>
                                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                            </div>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(report.totalRevenue)}</p>
                        </div>
                        <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Custo Total</span>
                                <ArrowDownRight className="w-5 h-5 text-red-500" />
                            </div>
                            <p className="text-2xl font-black text-red-600 dark:text-red-400">{formatCurrency(report.totalCost)}</p>
                        </div>
                        <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lucro</span>
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <p className={`text-2xl font-black ${report.totalProfit >= 0 ? "text-primary" : "text-red-500"}`}>{formatCurrency(report.totalProfit)}</p>
                        </div>
                    </div>

                    {/* Sales Table */}
                    <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#e7f3ed] dark:border-[#2a4538]">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-primary" />
                                Histórico de Vendas
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#e7f3ed] dark:border-[#2a4538]">
                                        <th className="px-6 py-3">Produto</th>
                                        <th className="px-6 py-3">Cor</th>
                                        <th className="px-6 py-3">Custo</th>
                                        <th className="px-6 py-3">Vendido por</th>
                                        <th className="px-6 py-3">Lucro</th>
                                        <th className="px-6 py-3">Data</th>
                                        <th className="px-6 py-3">Obs.</th>
                                        <th className="px-6 py-3 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e7f3ed] dark:divide-[#2a4538]">
                                    {report.sales.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                                Nenhuma venda registrada no período.
                                            </td>
                                        </tr>
                                    ) : (
                                        report.sales.map((sale) => {
                                            const profit = sale.sale_price - (sale.cost_price || 0);
                                            return (
                                                <tr key={sale.id} className="hover:bg-[#f8fcfa]/50 dark:hover:bg-[#1b2f24]/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {sale.product_image && (
                                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-[#1b2f24] overflow-hidden flex-shrink-0">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={sale.product_image} alt={sale.product_name} className="w-full h-full object-cover" />
                                                                </div>
                                                            )}
                                                            <span className="font-semibold text-sm text-slate-900 dark:text-white">{sale.product_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{sale.product_color || "—"}</td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{sale.cost_price ? formatCurrency(sale.cost_price) : "—"}</td>
                                                    <td className="px-6 py-4 font-bold text-sm text-emerald-600 dark:text-emerald-400">{formatCurrency(sale.sale_price)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font-bold text-sm ${profit >= 0 ? "text-primary" : "text-red-500"}`}>
                                                            {sale.cost_price ? formatCurrency(profit) : "—"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                        {new Date(sale.sale_date + "T00:00:00").toLocaleDateString("pt-BR")}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[150px] truncate">{sale.notes || "—"}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleUndoSale(sale.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-[#2a4538]"
                                                            title="Desfazer Venda"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
