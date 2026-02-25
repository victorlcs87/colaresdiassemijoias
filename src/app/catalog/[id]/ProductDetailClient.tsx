"use client";

import { useState } from "react";
import Image from "next/image";
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
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const maxQuantity = product.stock_quantity ?? 10;

    const increaseQuantity = () => {
        if (quantity < maxQuantity) setQuantity(q => q + 1);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    const defaultImage = "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop";

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 md:py-8">
            {/* Product Main Section */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-12">

                {/* Left: Image Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-4 w-full md:w-[55%]">
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] flex-shrink-0 scrollbar-thin">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx
                                        ? "border-primary shadow-md"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt={`${product.name} - ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main Image */}
                    <div className="relative w-full aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#152a20]">
                        <Image
                            src={images[activeImage] || defaultImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 55vw"
                            priority
                        />
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="w-full md:w-[45%] flex flex-col">
                    {/* Breadcrumb (desktop) */}
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <a href="/" className="hover:text-primary transition-colors">Início</a>
                        <span className="text-slate-300">&gt;</span>
                        <a href="/catalog" className="hover:text-primary transition-colors">Catálogo</a>
                        {product.category && (
                            <>
                                <span className="text-slate-300">&gt;</span>
                                <a href={`/catalog?cat=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">{product.category}</a>
                            </>
                        )}
                        <span className="text-slate-300">&gt;</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{product.name}</span>
                    </div>

                    {/* Name + Favorite */}
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{product.name}</h1>
                        <button className="flex-shrink-0 ml-4 h-10 w-10 rounded-full border border-slate-200 dark:border-[#2a4538] flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                            <Heart className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                        {formattedPromotionalPrice ? (
                            <>
                                <span className="text-3xl md:text-4xl font-black text-[#ff4757]">
                                    {formattedPromotionalPrice}
                                </span>
                                <span className="text-xl font-medium text-slate-400 line-through">
                                    {formattedPrice}
                                </span>
                                <span className="px-2 py-1 bg-[#ff4757]/10 text-[#ff4757] text-xs font-bold rounded uppercase tracking-wider">
                                    Oferta
                                </span>
                            </>
                        ) : (
                            <span className="text-3xl md:text-4xl font-black text-primary">
                                {formattedPrice}
                            </span>
                        )}
                    </div>

                    {/* Color Display (always visible if product has color) */}
                    {product.color && (
                        <div className="mb-4 pt-4 border-t border-slate-100 dark:border-[#2a4538]">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cor:</span>
                                <span
                                    className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow-inner flex-shrink-0"
                                    style={{ backgroundColor: colorNameToHex(product.color) }}
                                    title={product.color}
                                />
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{product.color}</span>
                            </div>

                            {/* Other color variants */}
                            {relatedProducts.length > 0 && (
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Outras cores disponíveis:</p>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {relatedProducts.map(p => {
                                            const img = p.image_gallery && p.image_gallery.length > 0 ? p.image_gallery[0] : (p.image_url || defaultImage);
                                            return (
                                                <a
                                                    key={p.id}
                                                    href={`/catalog/${p.id}`}
                                                    title={p.color || "Padrão"}
                                                    className="flex flex-col items-center gap-1 group"
                                                >
                                                    <div className="relative w-10 h-14 rounded overflow-hidden border border-slate-200 dark:border-[#2a4538] group-hover:border-primary opacity-80 group-hover:opacity-100 transition-all">
                                                        <Image src={img} alt={p.color || p.name} fill className="object-cover" sizes="40px" />
                                                    </div>
                                                    {p.color && (
                                                        <span
                                                            className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                                                            style={{ backgroundColor: colorNameToHex(p.color) }}
                                                        />
                                                    )}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sizes (Conditional) */}
                    {product.sizes && product.sizes.options && product.sizes.options.length > 0 && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{product.sizes.label}</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => setSelectedSize(opt === selectedSize ? null : opt)}
                                        className={`min-w-[48px] h-11 px-4 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${selectedSize === opt
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-slate-200 dark:border-[#2a4538] text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CTA section (Quantity selector + Add to cart) */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-4">
                        {product.is_available && (
                            <>
                                {/* Quantity stringent selector */}
                                <div className="flex items-center justify-between border-2 border-slate-200 dark:border-[#2a4538] rounded-xl h-12 w-full sm:w-32 px-2 bg-[#f8fcfa] dark:bg-[#1b2f24]">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-[#2a4538] text-slate-600 dark:text-slate-300 disabled:opacity-50 transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="font-bold text-slate-900 dark:text-white w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity >= maxQuantity}
                                        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-[#2a4538] text-slate-600 dark:text-slate-300 disabled:opacity-50 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Add to Cart Action */}
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-12 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Comprar ({formattedPrice})
                                </button>
                            </>
                        )}
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 border-2 border-[#e7f3ed] dark:border-[#2a4538] bg-[#f8fcfa]/50 dark:bg-[#152a20] hover:bg-[#e7f3ed] dark:hover:bg-[#1b2f24] text-slate-700 dark:text-slate-300 font-bold text-sm py-3 rounded-xl transition-all"
                    >
                        <MessageCircle className="h-5 w-5 text-whatsapp" />
                        Prefere um toque humano? Compre pelo WhatsApp
                    </a>

                    {/* Single Description Paragraph Details */}
                    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-[#2a4538]">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Detalhes e Especificações</h3>
                        <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {product.description || "Nenhuma descrição detalhada disponível."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="mt-16 pb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Você Também Pode Gostar</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((p) => {
                            const img = p.image_gallery && p.image_gallery.length > 0
                                ? p.image_gallery[0]
                                : p.image_url || defaultImage;
                            const price = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.price);
                            return (
                                <a key={p.id} href={`/catalog/${p.id}`} className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#1e362a] ring-1 ring-slate-100 dark:ring-[#2a4538] hover:shadow-md transition-shadow">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-[#152a20]">
                                        <Image
                                            src={img}
                                            alt={p.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{p.name}</h4>
                                        {p.category && <p className="text-xs text-slate-400">{p.category}</p>}
                                        <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">{price}</p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
