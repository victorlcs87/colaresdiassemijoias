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

    const formattedPromotionalPrice = product.promotional_price
        ? new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(product.promotional_price)
        : null;

    const defaultImage = "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600&auto=format&fit=crop";
    const mainImage = product.image_gallery && product.image_gallery.length > 0
        ? product.image_gallery[0]
        : (product.image_url || defaultImage);

    const hoverImage = product.image_gallery && product.image_gallery.length > 1
        ? product.image_gallery[1]
        : mainImage;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md dark:bg-[#3a1c15] dark:ring-[#5a3329]">
            <Link href={`/catalog/${product.id}`} className="flex flex-1 flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-[#2a120d]">
                    <Image
                        alt={product.name}
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${product.image_gallery && product.image_gallery.length > 1
                            ? "group-hover:opacity-0"
                            : "group-hover:scale-105 transition-transform"
                            }`}
                        src={mainImage}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {product.image_gallery && product.image_gallery.length > 1 && (
                        <Image
                            alt={`${product.name} - Detalhe`}
                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                            src={hoverImage}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}

                    {product.promotional_price && product.is_available && (
                        <span className="absolute right-3 top-3 z-10 rounded bg-[#8b2e1f] px-2 py-1 text-[10px] font-bold text-white shadow-sm sm:text-xs">
                            OFERTA
                        </span>
                    )}

                    {!product.is_available && (
                        <span className="absolute left-3 top-3 z-10 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                            Esgotado
                        </span>
                    )}
                </div>

                <div className="flex flex-grow flex-col p-5">
                    <div className="mb-2">
                        <div className="mb-1 flex items-center gap-2">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{product.category || "Novidade"}</p>
                            {product.condition === "seminovo" && (
                                <span className="rounded-md border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                    Seminovo
                                </span>
                            )}
                        </div>
                        <h4 className="leading-tight text-lg font-bold text-slate-900 dark:text-white">
                            {product.name}
                        </h4>
                    </div>

                    <div className="mb-4 flex flex-wrap items-baseline gap-2">
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
                        className={`mt-auto w-full rounded-xl py-3 text-center font-bold shadow-lg transition-colors ${product.is_available
                            ? "bg-primary text-white shadow-primary/20"
                            : "cursor-not-allowed bg-gray-200 text-gray-500 shadow-none"
                            }`}
                    >
                        {product.is_available ? "Ver Detalhes" : "Indisponível"}
                    </div>
                </div>
            </Link>

            {product.is_available && (
                <div className="px-5 pb-5">
                    <button
                        onClick={() => addItem(product)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#d9b7a6] bg-[#f6ede5] px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-[#ecd8ca] dark:border-[#5a3329] dark:bg-[#341810] dark:text-[#cf8f7c] dark:hover:bg-[#402018]"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Adicionar ao Carrinho
                    </button>
                </div>
            )}
        </article>
    );
}
