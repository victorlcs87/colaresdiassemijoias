"use client";

import { Home, Grid, ShoppingCart } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';

export function MobileNav() {
    const pathname = usePathname();
    const totalItems = useCartStore((state) => state.getTotalItems());
    const openCart = useCartStore((state) => state.openCart);
    const isMounted = typeof window !== "undefined";

    // Don't show the mobile nav on admin pages
    if (pathname.startsWith('/admin')) return null;

    const links = [
        { href: "/", label: "Início", icon: Home },
        { href: "/catalog", label: "Catálogo", icon: Grid },
        { href: "/cart", label: "Carrinho", icon: ShoppingCart, badge: totalItems },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 w-full bg-[#f6ede5] dark:bg-[#2a120d] border-t border-slate-100 dark:border-[#5a3329] px-6 py-2 z-50 safe-bottom">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {links.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

                    if (item.href === "/cart") {
                        return (
                            <button
                                key={item.href}
                                onClick={openCart}
                                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors relative ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                            >
                                <div className="relative">
                                    <Icon className="h-5 w-5" />
                                    {isMounted && item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors relative ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'
                                }`}
                        >
                            <div className="relative">
                                <Icon className="h-5 w-5" />
                                {isMounted && item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
