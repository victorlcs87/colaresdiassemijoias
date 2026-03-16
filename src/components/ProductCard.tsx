"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product.price);

    const formattedPromotionalPrice = product.promotional_price ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product.promotional_price) : null;

    const defaultImage = "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600&auto=format&fit=crop";
    const mainImage = product.image_gallery && product.image_gallery.length > 0
        ? product.image_gallery[0]
        : (product.image_url || defaultImage);

    const hoverImage = product.image_gallery && product.image_gallery.length > 1
        ? product.image_gallery[1]
        : mainImage;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
    };

    return (
        <Link href={`/catalog/${product.id}`} className="group flex flex-col bg-white dark:bg-[#3a1c15] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ring-1 ring-gray-100 dark:ring-[#5a3329] h-full cursor-pointer relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-[#2a120d]">
                {/* Main Image */}
                <Image
                    alt={product.name}
                    className={`object-cover transition-opacity duration-500 absolute inset-0 w-full h-full ${product.image_gallery && product.image_gallery.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-105 transition-transform'}`}
                    src={mainImage}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Hover Image */}
                {product.image_gallery && product.image_gallery.length > 1 && (
                    <Image
                        alt={`${product.name} - Detalhe`}
                        className="object-cover transition-opacity duration-500 absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 group-hover:scale-105 transform"
                        src={hoverImage}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}

                {product.promotional_price && product.is_available && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-[#8b2e1f] text-white text-[10px] sm:text-xs font-bold rounded z-10 shadow-sm">
                        OFERTA
                    </div>
                )}

                {!product.is_available && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded z-10">Esgotado</div>
                )}

                {product.is_available && (
                    <button
                        onClick={handleAddToCart}
                        className="absolute bottom-3 right-3 p-3 bg-white dark:bg-[#3a1c15] text-primary rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10 border border-slate-100 dark:border-[#5a3329]"
                        title="Adicionar ao Carrinho"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{product.category || "Novidade"}</p>
                        {product.condition === 'seminovo' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                                Seminovo
                            </span>
                        )}
                    </div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                        {product.name}
                    </h4>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 mb-4">
                    {formattedPromotionalPrice ? (
                        <>
                            <span className="text-xl font-bold text-[#8b2e1f] dark:text-[#cf8f7c]">
                                {formattedPromotionalPrice}
                            </span>
                            <span className="text-sm font-medium text-slate-400 line-through">
                                {formattedPrice}
                            </span>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formattedPrice}
                        </span>
                    )}
                </div>

                <div
                    className={`mt-auto w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg
            ${product.is_available
                            ? 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                        }`}
                >
                    {product.is_available ? (
                        'Ver Detalhes'
                    ) : (
                        'Indisponível'
                    )}
                </div>
            </div>
        </Link>
    );
}
