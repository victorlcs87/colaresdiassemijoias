/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, Receipt, Copy, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { Product } from "@/lib/types";

export default function AdminProductsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "archived">("all");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Sales Modal State
    const [saleModalOpen, setSaleModalOpen] = useState(false);
    const [selectedSaleProduct, setSelectedSaleProduct] = useState<Product | null>(null);
    const [salePrice, setSalePrice] = useState("");
    const [saleDate, setSaleDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [saleNotes, setSaleNotes] = useState("");
    const [isSubmittingSale, setIsSubmittingSale] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
            if (!error && data) {
                setProducts(data);
            }
            setLoading(false);
        }
        fetchProducts();
    }, [supabase]);

    const filteredProducts = products.filter(p => {
        if (activeTab === "all") return true;
        if (activeTab === "active") return p.is_available === true;
        if (activeTab === "draft") return p.is_available === false;
        return false;
    });

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
                    className="inline-flex items-center justify-center gap-2 bg-primary text-slate-900 font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Novo Produto</span>
                </Link>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-[#e7f3ed] dark:border-[#2a4538]">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === "all"
                            ? "border-primary text-slate-900 dark:text-white"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        Todos ({products.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("active")}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "active"
                            ? "border-primary text-slate-900 dark:text-white"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        Ativos ({products.filter(p => p.is_available).length})
                    </button>
                    <button
                        onClick={() => setActiveTab("draft")}
                        className={`pb-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "draft"
                            ? "border-primary text-slate-900 dark:text-white"
                            : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        Rascunhos ({products.filter(p => !p.is_available).length})
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-[#152a20] border border-[#e7f3ed] dark:border-[#2a4538] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#f8fcfa] dark:bg-[#1b2f24]/50 border-b border-[#e7f3ed] dark:border-[#2a4538]">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Imagem</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nome do Produto</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Preço</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7f3ed] dark:divide-[#2a4538]">
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
                                filteredProducts.slice(0, 5).map((product) => (
                                    <tr key={product.id} className="hover:bg-[#f8fcfa]/50 dark:hover:bg-[#1b2f24]/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/catalog/${product.id}`} target="_blank">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-[#1b2f24] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                                    <img
                                                        src={product.image_url || "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600"}
                                                        alt={product.name}
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
                                                            setSaleModalOpen(true);
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                                                        title="Registrar Venda"
                                                    >
                                                        <Receipt className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={async () => {
                                                        if (confirm("Duplicar este produto?")) {
                                                            const { duplicateProduct } = await import("@/actions/sales");
                                                            const res = await duplicateProduct(product.id);
                                                            if (res.success) {
                                                                alert("Produto duplicado! Recarregue a página para ver.");
                                                                window.location.reload();
                                                            } else {
                                                                alert("Erro: " + res.error);
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                                    title="Duplicar Produto"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm("Tem certeza que deseja excluir este produto?")) {
                                                            const { deleteProduct } = await import("@/actions/product");
                                                            const res = await deleteProduct(product.id);
                                                            if (res.success) {
                                                                setProducts(products.filter(p => p.id !== product.id));
                                                            } else {
                                                                alert("Erro ao excluir: " + res.error);
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Excluir"
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

            {/* Modal de Venda */}
            {saleModalOpen && selectedSaleProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#152a20] rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-[#e7f3ed] dark:border-[#2a4538]">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Preço de Venda (R$) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={salePrice}
                                    onChange={(e) => setSalePrice(e.target.value)}
                                    required
                                    className="w-full bg-[#f8fcfa] dark:bg-[#1b2f24] border border-slate-200 dark:border-[#2a4538] rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
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
                                    className="w-full bg-[#f8fcfa] dark:bg-[#1b2f24] border border-slate-200 dark:border-[#2a4538] rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Observações</label>
                                <textarea
                                    value={saleNotes}
                                    onChange={(e) => setSaleNotes(e.target.value)}
                                    rows={2}
                                    className="w-full bg-[#f8fcfa] dark:bg-[#1b2f24] border border-slate-200 dark:border-[#2a4538] rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white resize-none"
                                    placeholder="Detalhes opcionais sobre a venda..."
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-[#e7f3ed] dark:border-[#2a4538] flex gap-3 justify-end bg-slate-50 dark:bg-[#1e362a]/30">
                            <button
                                type="button"
                                onClick={() => setSaleModalOpen(false)}
                                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    if (!salePrice || !saleDate) {
                                        alert("Preço e Data são obrigatórios.");
                                        return;
                                    }
                                    setIsSubmittingSale(true);
                                    try {
                                        const fd = new FormData();
                                        fd.append("product_id", selectedSaleProduct.id);
                                        fd.append("sale_price", salePrice);
                                        fd.append("sale_date", saleDate);
                                        fd.append("notes", saleNotes);

                                        const { registerSale } = await import("@/actions/sales");
                                        const res = await registerSale(fd);

                                        if (res.success) {
                                            setProducts(products.map(p => p.id === selectedSaleProduct.id ? { ...p, is_available: false } : p));
                                            setSaleModalOpen(false);
                                        } else {
                                            alert("Erro: " + res.error);
                                        }
                                    } catch (e) {
                                        alert("Erro inesperado ao registrar a venda.");
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
        </div>
    );
}
