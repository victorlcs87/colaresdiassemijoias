import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import Link from "next/link";

import { HeroBanner } from "@/components/HeroBanner";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explore o catálogo completo de acessórios e semijoias da Colares Dias.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; cat?: string; promo?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { q, cat, promo } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_available", true);

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  if (cat) {
    query = query.eq("category", cat);
  }

  if (promo === 'true') {
    query = query.not("promotional_price", "is", null);
  }

  const { data: products } = await query.order("created_at", { ascending: false });

  // Buscar todas as categorias ativas para preencher a sidebar
  const { data: allActiveProducts } = await supabase
    .from("products")
    .select("category")
    .eq("is_available", true);

  const uniqueCategories = Array.from(new Set(allActiveProducts?.map(p => p.category).filter(Boolean))).sort();

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 antialiased">
      <Header />

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-10 md:gap-16">
        {/* Banner Principal */}
        <HeroBanner />

        {/* Breadcrumb / Filtros Top */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              {q ? `Busca: "${q}"` : cat ? `Categoria: ${cat}` : promo ? 'Promoções' : 'Catálogo'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {products?.length || 0} produtos encontrados
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtros Mobile ou dropdown em breve */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Menu Lateral de Filtros (Visão Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-[#2a120d] p-6 rounded-2xl border border-[#d9b7a6] dark:border-[#5a3329]">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Categorias</h3>
              <div className="flex flex-col gap-2">
                <Link href="/catalog" className={`text-sm py-2 px-3 rounded-lg transition-colors ${!cat && !promo ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-[#f6ede5] dark:hover:bg-[#341810]'}`}>Todos os Produtos</Link>
                <Link href="/catalog?promo=true" className={`text-sm py-2 px-3 rounded-lg transition-colors ${promo === 'true' ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-[#f6ede5] dark:hover:bg-[#341810]'}`}>Promoções 🏷️</Link>
                {uniqueCategories.map(c => (
                  <Link
                    key={c}
                    href={`/catalog?cat=${encodeURIComponent(c as string)}`}
                    className={`text-sm py-2 px-3 rounded-lg transition-colors capitalize ${cat === c ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-[#f6ede5] dark:hover:bg-[#341810]'}`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="lg:col-span-9">
            {(!products || products.length === 0) ? (
              <div className="text-center py-20 bg-white dark:bg-[#3a1c15] rounded-2xl border border-gray-100 dark:border-[#5a3329] shadow-sm">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">Nenhum produto encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Tente buscar por outro termo ou limpe os filtros.</p>
                <Link href="/catalog" className="inline-block mt-6 px-6 py-2 bg-primary text-white font-bold rounded-full">Ver tudo</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Paginação (Simplificada/Exemplo) */}
            {products && products.length > 0 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 opacity-50" disabled>
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-[#f6ede5] dark:bg-[#2a120d] border-t border-[#d9b7a6] dark:border-[#5a3329] py-8 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Colares Dias Semijoias. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link className="hover:text-slate-900 dark:hover:text-white" href="/about">Página Institucional</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
