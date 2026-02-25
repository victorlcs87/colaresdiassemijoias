import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { Testimonials } from "@/components/Testimonials";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
    const supabase = await createClient();

    const { data: allProducts } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });

    const products = allProducts?.slice(0, 4) || [];

    const dynamicCategories = [];
    const categoryMap = new Map<string, string>();
    let hasPromotions = false;

    if (allProducts) {
        for (const p of allProducts) {
            if (p.promotional_price) {
                hasPromotions = true;
            }
            if (p.category && !categoryMap.has(p.category)) {
                let img = null;
                if (p.image_gallery && p.image_gallery.length > 0) {
                    img = p.image_gallery[0];
                } else if (p.image_url) {
                    img = p.image_url;
                }

                if (img) {
                    categoryMap.set(p.category, img);
                    dynamicCategories.push({
                        href: `/catalog?cat=${encodeURIComponent(p.category)}`,
                        label: "Novidades",
                        title: p.category,
                        image: img
                    });
                }
            }
        }
    }

    const promoCategory = {
        href: "/catalog?promo=true",
        label: "Até 50% OFF",
        title: "Promoção",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop"
    };

    // Limits to 3 dynamic categories max (4 with promo)
    const displayCategories = dynamicCategories.slice(0, 3);
    displayCategories.push(promoCategory);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 antialiased">
            <Header />

            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-16">

                {/* Banner Principal */}
                <HeroBanner />

                {/* Destaque de Categorias */}
                <FeaturedCategories categories={displayCategories} />

                {/* Destaques para você */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Destaques Para Você</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {(!products || products.length === 0) ? (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                Nenhum produto destaque no momento.
                            </div>
                        ) : (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        )}
                    </div>
                </section>

                {/* Depoimentos */}
                <Testimonials />

            </main>
        </div>
    );
}
