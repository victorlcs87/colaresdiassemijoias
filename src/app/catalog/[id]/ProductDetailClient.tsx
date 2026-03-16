"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { MessageCircle, Heart, ShoppingCart, Minus, Plus } from "lucide-react";

interface ProductDetailClientProps {
    product: Product;
    whatsappUrl: string;
    formattedPrice: string;
    relatedProducts: Product[];
}

const COLOR_MAP: Record<string, string> = {
    "vermelho": "#DC2626", "red": "#DC2626",
    "azul": "#2563EB", "blue": "#2563EB",
    "azul marinho": "#1E3A5F", "navy": "#1E3A5F",
    "azul claro": "#93C5FD", "light blue": "#93C5FD",
    "verde": "#16A34A", "green": "#16A34A",
    "verde escuro": "#166534",
    "amarelo": "#EAB308", "yellow": "#EAB308",
    "laranja": "#EA580C", "orange": "#EA580C",
    "roxo": "#9333EA", "purple": "#9333EA",
    "rosa": "#EC4899", "pink": "#EC4899",
    "preto": "#1E1E1E", "black": "#1E1E1E",
    "branco": "#F8F8F8", "white": "#F8F8F8",
    "cinza": "#6B7280", "gray": "#6B7280", "grey": "#6B7280",
    "marrom": "#92400E", "brown": "#92400E",
    "bege": "#D4C5A9", "beige": "#D4C5A9",
    "dourado": "#D4A017", "gold": "#D4A017",
    "prata": "#C0C0C0", "silver": "#C0C0C0",
    "vinho": "#722F37", "burgundy": "#722F37",
    "coral": "#FF7F50",
    "terracota": "#C2622D",
    "lilás": "#C8A2C8", "lilac": "#C8A2C8",
    "creme": "#FFFDD0", "cream": "#FFFDD0",
    "nude": "#E3BC9A",
    "caramelo": "#C68E17",
    "mostarda": "#FFDB58",
    "turquesa": "#40E0D0", "turquoise": "#40E0D0",
    "salmão": "#FA8072", "salmon": "#FA8072",
    "oliva": "#808000", "olive": "#808000",
};

function colorNameToHex(name: string): string {
    return COLOR_MAP[name.toLowerCase().trim()] || "#CBD5E1";
}

export default function ProductDetailClient({
    product,
    whatsappUrl,
    formattedPrice,
    relatedProducts,
}: ProductDetailClientProps) {
    const formattedPromotionalPrice = product.promotional_price ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product.promotional_price) : null;

    const images = product.image_gallery && product.image_gallery.length > 0
        ? product.image_gallery
        : product.image_url
            ? [product.image_url]
            : [];

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const maxQuantity = product.stock_quantity ?? 10;
    const normalizedDescription = (product.description || "Nenhuma descrição detalhada disponível.")
        .replace(/\s*\n+\s*/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim();

    const increaseQuantity = () => {
        if (quantity < maxQuantity) setQuantity(q => q + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    const defaultImage = "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600&auto=format&fit=crop";
    const sizeOptions = product.sizes?.options ?? [];
    const sizeLabel = product.sizes?.label ?? "ml";

    return (
        <div className="max-w-[1460px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
            <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
                <div className="w-full xl:flex-1 min-w-0 flex gap-3 md:gap-4">
                    {images.length > 1 && (
                        <div className="hidden sm:flex flex-col gap-2 md:gap-3 w-20 md:w-24 flex-shrink-0">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-20 h-24 md:w-24 md:h-28 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx
                                        ? "border-primary"
                                        : "border-transparent opacity-80 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} - ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-white/70 dark:bg-[#2a120d] border border-[#d9b7a6]/30 dark:border-[#5a3329]">
                        <Image
                            src={images[activeImage] || defaultImage}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1280px) 100vw, 58vw"
                            priority
                        />
                    </div>
                </div>

                <div className="w-full xl:w-[560px] flex-shrink-0">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Início</Link>
                        <span>&gt;</span>
                        <Link href="/catalog" className="hover:text-primary transition-colors">Catálogo</Link>
                        {product.category && (
                            <>
                                <span>&gt;</span>
                                <Link href={`/catalog?cat=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">
                                    {product.category}
                                </Link>
                            </>
                        )}
                        <span>&gt;</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{product.name}</span>
                    </div>

                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                            {product.name}
                        </h1>
                        <button className="h-12 w-12 rounded-full border border-[#d9b7a6] dark:border-[#5a3329] flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                            <Heart className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="mb-6">
                        {formattedPromotionalPrice ? (
                            <div className="flex items-end gap-3 flex-wrap">
                                <span className="text-5xl font-black text-primary">{formattedPromotionalPrice}</span>
                                <span className="text-xl text-slate-400 line-through">{formattedPrice}</span>
                            </div>
                        ) : (
                            <span className="text-5xl font-black text-primary">{formattedPrice}</span>
                        )}
                    </div>

                    <div className="border-t border-[#d9b7a6]/60 dark:border-[#5a3329] pt-6 space-y-6">
                        {product.color && (
                            <div>
                                <p className="text-[32px] leading-none font-black text-primary sr-only">{product.color}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl text-slate-700 dark:text-slate-300">Cor:</span>
                                    <span
                                        className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-600"
                                        style={{ backgroundColor: colorNameToHex(product.color) }}
                                        title={product.color}
                                    />
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{product.color}</span>
                                </div>

                                {relatedProducts.length > 0 && (
                                    <div className="mt-3 flex items-center gap-2">
                                        {relatedProducts.slice(0, 5).map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/catalog/${p.id}`}
                                                className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600"
                                                style={{ backgroundColor: colorNameToHex(p.color || "") }}
                                                title={p.color || p.name}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {sizeOptions.length > 0 && (
                            <div>
                                <p className="text-3xl font-semibold text-slate-800 dark:text-slate-100 lowercase">{sizeLabel}</p>
                                <div className="mt-3">
                                    <span className="inline-flex items-center justify-center min-w-24 h-12 rounded-2xl border-2 border-[#d9b7a6] dark:border-[#5a3329] bg-[#f6ede5]/60 dark:bg-[#2a120d] px-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                                        {sizeOptions[0]}
                                    </span>
                                </div>
                            </div>
                        )}

                        {product.is_available && (
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex items-center justify-between border-2 border-[#d9b7a6] dark:border-[#5a3329] rounded-2xl h-14 w-full md:w-40 px-3 bg-[#f6ede5]/60 dark:bg-[#341810]">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-[#d9b7a6]/50 dark:hover:bg-[#5a3329] transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="font-bold text-xl text-slate-900 dark:text-white">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity >= maxQuantity}
                                        className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-50 hover:bg-[#d9b7a6]/50 dark:hover:bg-[#5a3329] transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xl flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-colors"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Comprar ({formattedPrice})
                                </button>
                            </div>
                        )}

                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-14 rounded-2xl border-2 border-[#d9b7a6] dark:border-[#5a3329] text-slate-700 dark:text-slate-300 font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#d9b7a6]/40 dark:hover:bg-[#341810] transition-colors"
                        >
                            <MessageCircle className="h-5 w-5 text-whatsapp" />
                            Prefere um toque humano? Compre pelo WhatsApp
                        </a>
                    </div>

                    <div className="mt-10 pt-8 border-t border-[#d9b7a6]/60 dark:border-[#5a3329]">
                        <h3 className="text-3xl font-black uppercase tracking-wide text-slate-900 dark:text-white mb-5">
                            Detalhes e Especificações
                        </h3>
                        <p className="text-2xl leading-relaxed text-slate-700 dark:text-slate-300">
                            {normalizedDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
