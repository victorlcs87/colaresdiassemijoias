import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryData {
    href: string;
    label: string;
    title: string;
    image: string;
}

export function FeaturedCategories({ categories }: { categories: CategoryData[] }) {
    if (!categories || categories.length === 0) return null;

    const gridCols = categories.length === 1 ? 'md:grid-cols-1 lg:max-w-2xl lg:mx-auto' :
        categories.length === 2 ? 'md:grid-cols-2' :
            categories.length === 3 ? 'md:grid-cols-3' :
                'md:grid-cols-2 lg:grid-cols-4';

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Categorias em Destaque</h2>
                <Link className="text-primary font-bold text-sm hover:underline flex items-center gap-1" href="/catalog">
                    Ver Todas <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
                {categories.map((cat) => (
                    <Link key={cat.href} href={cat.href} className="group relative h-28 md:h-36 overflow-hidden rounded-xl cursor-pointer">
                        <Image
                            src={cat.image}
                            alt={cat.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full">
                            <p className="text-primary text-[10px] md:text-xs font-bold uppercase mb-0.5">{cat.label}</p>
                            <h3 className="text-white text-lg md:text-xl font-bold">{cat.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
