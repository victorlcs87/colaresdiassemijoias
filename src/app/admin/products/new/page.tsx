"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Info, DollarSign, Image as ImageIcon, Save, Ruler, Tag, X, Plus, Palette } from "lucide-react";
import { createProduct } from "@/actions/product";
import { MultipleImageUpload } from "@/components/admin/MultipleImageUpload";

export default function AdminAddProductPage() {
    const [statusActive, setStatusActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageGallery, setImageGallery] = useState<string[]>([]);
    const [sizesEnabled, setSizesEnabled] = useState(false);
    const [sizeLabel, setSizeLabel] = useState("Tamanho");
    const [sizeOptions, setSizeOptions] = useState<string[]>([]);
    const [sizeInput, setSizeInput] = useState("");
    const [category, setCategory] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        formData.append("is_available", statusActive.toString());
        formData.append("image_gallery", JSON.stringify(imageGallery));
        formData.append("category", category);
        if (sizesEnabled && sizeOptions.length > 0) {
            formData.append("sizes", JSON.stringify({ label: sizeLabel, options: sizeOptions }));
        }

        try {
            const result = await createProduct(formData);
            if (result && result.error) {
                setError(result.error);
                setLoading(false);
            }
        } catch (err) {
            setError("Erro inesperado ao salvar o produto.");
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <Link href="/admin/products" className="hover:text-primary transition-colors">Produtos</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-primary font-medium">Adicionar Novo</span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Adicionar Novo Produto</h1>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/admin/products"
                            className="px-4 py-2 text-sm font-semibold border border-slate-200 dark:border-[#5a3329] text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-[#341810] transition-colors"
                        >
                            Descartar
                        </Link>
                        <button disabled={loading} type="submit" className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold text-sm rounded-lg hover:brightness-110 transition-all shadow-sm disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {loading ? "Salvando..." : "Salvar Produto"}
                        </button>
                    </div>
                </div>

                {error && <div className="mb-6 p-4 text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informação Básica */}
                        <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Info className="text-primary w-5 h-5" />
                                Informações Básicas
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nome do Produto</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                        placeholder="Ex. Colar de Prata com Pingente"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Descrição</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400 resize-y"
                                        placeholder="Descreva os materiais, tamanho, e detalhes do produto..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preço e Estoque */}
                        <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <DollarSign className="text-primary w-5 h-5" />
                                Preços e Estoque
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preço (R$)</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">R$</span>
                                        <input
                                            type="number"
                                            name="price"
                                            required
                                            step="0.01"
                                            className="w-full pl-10 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Quantidade em Estoque</label>
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        required
                                        min="0"
                                        defaultValue="1"
                                        className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                        placeholder="Ex: 10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preço de Custo (R$)</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">R$</span>
                                        <input
                                            type="number"
                                            name="cost_price"
                                            step="0.01"
                                            className="w-full pl-10 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Uso interno — não visível ao cliente.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <ImageIcon className="text-primary w-5 h-5" />
                                Imagem do Produto
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Fotos do Produto</label>
                                <MultipleImageUpload onUploadSuccess={setImageGallery} />
                                <input type="hidden" name="image_gallery" value={JSON.stringify(imageGallery)} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings & Meta */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Status */}
                        <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                            <h3 className="text-base font-bold mb-4 text-slate-900 dark:text-white">Status do Produto</h3>
                            <div className="flex items-center justify-between p-3 bg-[#f6ede5] dark:bg-[#341810] rounded-lg border border-[#d9b7a6] dark:border-[#5a3329]">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${statusActive ? 'bg-primary animate-pulse' : 'bg-slate-400'}`}></div>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                        {statusActive ? 'Ativo' : 'Rascunho'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStatusActive(!statusActive)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${statusActive ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${statusActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Categoria e Condição */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                                <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Tag className="w-4 h-4 text-primary" />
                                    Categoria
                                </h3>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                    placeholder="Ex: Vestidos, Acessórios, Bebidas..."
                                />
                            </div>

                            <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                                <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Tag className="w-4 h-4 text-primary" />
                                    Condição
                                </h3>
                                <select
                                    name="condition"
                                    defaultValue="novo"
                                    className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                >
                                    <option value="novo">Novo</option>
                                    <option value="seminovo">Seminovo</option>
                                </select>
                            </div>
                        </div>

                        {/* Cor do Produto */}
                        <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                            <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Palette className="w-4 h-4 text-primary" />
                                Cor do Produto
                            </h3>
                            <input
                                type="text"
                                name="color"
                                className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                placeholder="Ex: Vermelho, Azul Marinho, Rosa..."
                            />
                            <p className="text-xs text-slate-400 mt-2">Produtos com o mesmo nome e cores diferentes serão exibidos como variações.</p>
                        </div>

                        {/* Tamanhos / Variações */}
                        <div className="bg-white dark:bg-[#2a120d] p-6 rounded-xl border border-[#d9b7a6] dark:border-[#5a3329] shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Ruler className="w-4 h-4 text-primary" />
                                    Tamanhos / Variações
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setSizesEnabled(!sizesEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sizesEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sizesEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            {sizesEnabled && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Rótulo da Variação</label>
                                        <input
                                            type="text"
                                            value={sizeLabel}
                                            onChange={(e) => setSizeLabel(e.target.value)}
                                            className="w-full bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                            placeholder="Ex: Tamanho, Volume, Cor..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Opções</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {sizeOptions.map((opt, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1.5 rounded-lg">
                                                    {opt}
                                                    <button type="button" onClick={() => setSizeOptions(sizeOptions.filter((_, i) => i !== idx))}>
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={sizeInput}
                                                onChange={(e) => setSizeInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (sizeInput.trim() && !sizeOptions.includes(sizeInput.trim())) {
                                                            setSizeOptions([...sizeOptions, sizeInput.trim()]);
                                                            setSizeInput("");
                                                        }
                                                    }
                                                }}
                                                className="flex-1 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder-slate-400"
                                                placeholder="Digite e aperte Enter"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (sizeInput.trim() && !sizeOptions.includes(sizeInput.trim())) {
                                                        setSizeOptions([...sizeOptions, sizeInput.trim()]);
                                                        setSizeInput("");
                                                    }
                                                }}
                                                className="p-2.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
