"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, Receipt, Copy, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";
import { Product } from "@/lib/types";
import { registerSale, duplicateProduct } from "@/actions/sales";
import { deleteProduct } from "@/actions/product";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

type PendingAction = {
    type: "duplicate" | "delete";
    product: Product;
} | null;

export default function AdminProductsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "archived">("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<10 | 50 | 100>(10);

    // Sales Modal State
    const [saleModalOpen, setSaleModalOpen] = useState(false);
    const [selectedSaleProduct, setSelectedSaleProduct] = useState<Product | null>(null);
    const [salePrice, setSalePrice] = useState("");
    const [saleDate, setSaleDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [saleNotes, setSaleNotes] = useState("");
    const [isSubmittingSale, setIsSubmittingSale] = useState(false);
    const [saleError, setSaleError] = useState("");
    const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [isConfirmingAction, setIsConfirmingAction] = useState(false);

    const [supabase] = useState(() =>
        createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
    );

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProducts();
    }, [fetchProducts]);

    async function confirmPendingAction() {
        if (!pendingAction) return;
        setIsConfirmingAction(true);
        setFeedback(null);

        if (pendingAction.type === "duplicate") {
            const res = await duplicateProduct(pendingAction.product.id);
            if (res.success) {
                await fetchProducts();
                setFeedback({ type: "success", message: "Produto duplicado com sucesso." });
            } else {
                setFeedback({ type: "error", message: res.error || "Erro ao duplicar produto." });
            }
        }

        if (pendingAction.type === "delete") {
            const res = await deleteProduct(pendingAction.product.id);
            if (res.success) {
                setProducts((previous) => previous.filter((p) => p.id !== pendingAction.product.id));
                setFeedback({ type: "success", message: "Produto excluído com sucesso." });
            } else {
                setFeedback({ type: "error", message: res.error || "Erro ao excluir produto." });
            }
        }

        setPendingAction(null);
        setIsConfirmingAction(false);
    }

    const filteredProducts = products.filter(p => {
        if (activeTab === "all") return true;
        if (activeTab === "active") return p.is_available === true;
        if (activeTab === "draft") return p.is_available === false;
        return false;
    });

    const totalItems = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const normalizedCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (normalizedCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="p-8">
            {/* Content Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Produtos</h2>
                    <p className="text-slate-500 mt-1">Gerencie o catálogo e inventário da sua loja</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Novo Produto</span>
                </Link>
            </div>

            {feedback && (
                <div
                    role="status"
                    aria-live="polite"
                    className={`mb-6 rounded-xl border px-4 py-3 text-sm ${feedback.type === "error"
                        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300"
                        }`}
                >
                    {feedback.message}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6 border-b border-[#d9b7a6] dark:border-[#5a3329]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex gap-8">
                        <button
                            onClick={() => {
                                setActiveTab("all");
                                setCurrentPage(1);
                            }}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "all"
                                ? "border-primary text-slate-900 dark:text-white"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            Todos ({products.length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("active");
                                setCurrentPage(1);
                            }}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "active"
                                ? "border-primary text-slate-900 dark:text-white"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            Ativos ({products.filter(p => p.is_available).length})
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("draft");
                                setCurrentPage(1);
                            }}
                            className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "draft"
                                ? "border-primary text-slate-900 dark:text-white"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                }`}
                        >
                            Rascunhos ({products.filter(p => !p.is_available).length})
                        </button>
                    </div>
                    <div className="pb-3 flex items-center gap-3">
                        <label htmlFor="itemsPerPage" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Exibir
                        </label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value) as 10 | 50 | 100);
                                setCurrentPage(1);
                            }}
                            className="h-9 rounded-md border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#341810] px-3 text-sm text-slate-700 dark:text-slate-200"
                        >
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-[#2a120d] border border-[#d9b7a6] dark:border-[#5a3329] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#f6ede5] dark:bg-[#341810]/50 border-b border-[#d9b7a6] dark:border-[#5a3329]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Imagem</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nome do Produto</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Preço</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#d9b7a6] dark:divide-[#5a3329]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                        <p className="mt-2 text-sm font-medium">Carregando produtos...</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <p>Nenhum produto cadastrado.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#f6ede5]/50 dark:hover:bg-[#341810]/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/catalog/${product.id}`} target="_blank">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#341810] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                                    <Image
                                                        src={product.image_url || "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600"}
                                                        alt={product.name}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/products/edit/${product.id}`} className="font-semibold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer">
                                                {product.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                {product.promotional_price ? (
                                                    <>
                                                        <span className="font-medium text-red-600 dark:text-red-400">
                                                            R$ {product.promotional_price.toFixed(2).replace(".", ",")}
                                                        </span>
                                                        <span className="text-xs text-slate-400 line-through">
                                                            R$ {product.price?.toFixed(2).replace(".", ",")}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        R$ {product.price?.toFixed(2).replace(".", ",")}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.is_available ? 'bg-primary/20 text-emerald-700 dark:text-primary' : 'bg-slate-200 text-slate-700'}`}>
                                                {product.is_available ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                {product.is_available && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSaleProduct(product);
                                                            setSalePrice(product.price?.toString() || "");
                                                            setSaleDate(new Date().toISOString().split("T")[0]);
                                                            setSaleNotes("");
                                                            setSaleError("");
                                                            setSaleModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                                                        title="Registrar Venda"
                                                    >
                                                        <Receipt className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setPendingAction({ type: "duplicate", product })}
                                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                                    title="Duplicar Produto"
                                                    aria-label={`Duplicar ${product.name}`}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setPendingAction({ type: "delete", product })}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Excluir"
                                                    aria-label={`Excluir ${product.name}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && filteredProducts.length > 0 && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Mostrando {startIndex + 1}–{endIndex} de {totalItems} produtos
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={normalizedCurrentPage === 1}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-[#d9b7a6] dark:border-[#5a3329] text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f6ede5] dark:hover:bg-[#341810]"
                            aria-label="Página anterior"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        {pageNumbers.map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`h-9 min-w-9 px-2 inline-flex items-center justify-center rounded-md border text-sm font-semibold transition-colors ${page === normalizedCurrentPage
                                    ? "border-primary bg-primary text-white"
                                    : "border-[#d9b7a6] dark:border-[#5a3329] text-slate-700 dark:text-slate-200 hover:bg-[#f6ede5] dark:hover:bg-[#341810]"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={normalizedCurrentPage === totalPages}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-[#d9b7a6] dark:border-[#5a3329] text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#f6ede5] dark:hover:bg-[#341810]"
                            aria-label="Próxima página"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de Venda */}
            {saleModalOpen && selectedSaleProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sale-modal-title"
                        className="bg-white dark:bg-[#2a120d] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-[#d9b7a6] dark:border-[#5a3329]">
                            <h3 id="sale-modal-title" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-emerald-500" />
                                Registrar Venda
                            </h3>
                            <button
                                onClick={() => setSaleModalOpen(false)}
                                className="text-slate-400 hover:text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Produto:</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{selectedSaleProduct.name}</p>
                            </div>
                            {saleError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
                                    {saleError}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Preço de Venda (R$) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    required
                                    className="w-full bg-[#f6ede5] dark:bg-[#341810] border border-slate-200 dark:border-[#5a3329] rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Data da Venda <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={saleDate}
                                    onChange={(e) => setSaleDate(e.target.value)}
                                    required
                                    className="w-full bg-[#f6ede5] dark:bg-[#341810] border border-slate-200 dark:border-[#5a3329] rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Observações</label>
                                <textarea
                                    value={saleNotes}
                                    onChange={(e) => setSaleNotes(e.target.value)}
                                    rows={2}
                                    className="w-full bg-[#f6ede5] dark:bg-[#341810] border border-slate-200 dark:border-[#5a3329] rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white resize-none"
                                    placeholder="Detalhes opcionais sobre a venda..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-[#d9b7a6] dark:border-[#5a3329] flex gap-3 justify-end bg-slate-50 dark:bg-[#3a1c15]/30">
                            <button
                                type="button"
                                onClick={() => setSaleModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    setSaleError("");
                                    if (!salePrice || !saleDate) {
                                        setSaleError("Preço e data são obrigatórios.");
                                        return;
                                    }
                                    setIsSubmittingSale(true);
                                    try {
                                        const fd = new FormData();
                                        fd.append("product_id", selectedSaleProduct.id);
                                        fd.append("sale_price", salePrice);
                                        fd.append("sale_date", saleDate);
                                        fd.append("notes", saleNotes);

                                        const res = await registerSale(fd);

                                        if (res.success) {
                                            setProducts((current) => current.map((p) => p.id === selectedSaleProduct.id ? { ...p, is_available: false } : p));
                                            setSaleModalOpen(false);
                                            setFeedback({ type: "success", message: "Venda registrada com sucesso." });
                                        } else {
                                            setSaleError(res.error || "Erro ao registrar venda.");
                                        }
                                    } catch {
                                        setSaleError("Erro inesperado ao registrar a venda.");
                                    }
                                    setIsSubmittingSale(false);
                                }}
                                disabled={isSubmittingSale || !salePrice || !saleDate}
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
                            >
                                {isSubmittingSale ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
                                Confirmar Venda
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={Boolean(pendingAction)}
                title={pendingAction?.type === "delete" ? "Excluir produto" : "Duplicar produto"}
                description={pendingAction?.type === "delete"
                    ? `Tem certeza que deseja excluir "${pendingAction?.product.name}"? Esta ação não pode ser desfeita.`
                    : `Deseja criar uma cópia de "${pendingAction?.product.name}" no catálogo?`
                }
                confirmLabel={pendingAction?.type === "delete" ? "Excluir" : "Duplicar"}
                cancelLabel="Cancelar"
                variant={pendingAction?.type === "delete" ? "danger" : "default"}
                loading={isConfirmingAction}
                onClose={() => setPendingAction(null)}
                onConfirm={confirmPendingAction}
            />
        </div>
    );
}
