"use client";

import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { createPortal } from "react-dom";

export function CartDrawer() {
    const { isOpen, openCart, closeCart, items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

    const handleCheckout = () => {
        if (items.length === 0) return;

        // Vibração de sucesso (Haptic Feedback)
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([30, 100, 30]);
        }

        const cartDetails = items
            .map((item) => `🛍️ ${item.quantity}x *${item.name}*\n   R$ ${(item.price * item.quantity).toFixed(2)}`)
            .join("\n\n");
        const total = getTotalPrice().toFixed(2);

        // Pre-gerar um template simpático e escaneável para o atendimento da loja
        const message = `Olá, equipe Colares Dias! Separei esses itens no catálogo:\n\n${cartDetails}\n\n🛒 *TOTAL: R$ ${total}*\n\nPodem me confirmar o frete e as formas de pagamento? 😊`;

        const encodedMessage = encodeURIComponent(message);

        // Disparo de Evento Analytics (Será capturado se o Vercel Analytics estiver injetado)
        type AnalyticsWindow = Window & {
            va?: (type: string, eventName: string, payload?: Record<string, number | string>) => void;
        };
        const analytics = (window as AnalyticsWindow).va;
        if (typeof analytics === "function") {
            analytics("event", "Purchase_Intent_WhatsApp", { total_value: total, total_items: getTotalItems() });
        }

        window.open(`https://wa.me/5561982865191?text=${encodedMessage}`, "_blank");
    };

    return (
        <>
            {/* Botão Flutuante / Header */}
            <button
                onClick={openCart}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-[#3a1c15] hover:bg-slate-100 dark:hover:bg-[#5a3329] transition-colors shadow-sm text-slate-900 dark:text-slate-100 mr-2"
            >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#2a120d] animate-in zoom-in">
                        {getTotalItems()}
                    </span>
                )}
            </button>

            {/* Renderizar Overlay e Drawer via Portal para escapar de restrições de z-index dos Headers */}
            {typeof document !== "undefined" && createPortal(
                <div className="cart-drawer-portal">
                    {/* Overlay */}
                    {isOpen && (
                        <div
                            className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={closeCart}
                        />
                    )}

                    {/* Drawer */}
                    <div className={`fixed top-0 right-0 z-[9991] h-[100dvh] w-full max-w-md bg-white dark:bg-[#2a120d] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-[#5a3329] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Seu Carrinho</h3>
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{getTotalItems()} itens</span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="p-6 bg-[#f6ede5] dark:bg-[#341810] rounded-full">
                                        <ShoppingCart className="w-12 h-12 text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-bold text-lg">Seu carrinho está vazio</p>
                                        <p className="text-slate-500 text-sm">Que tal dar uma olhadinha nas nossas joias?</p>
                                    </div>
                                    <button
                                        onClick={closeCart}
                                        className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:brightness-105 transition-all shadow-sm"
                                    >
                                        Ver Catálogo
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image_url || "https://images.unsplash.com/photo-1611652022419-a9419f74343d"}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                                                    <p className="text-primary font-black text-sm">R$ {item.price.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        removeItem(item.id);
                                                        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                                                            window.navigator.vibrate(40);
                                                        }
                                                    }}
                                                    className="p-3 text-slate-300 hover:text-red-500 transition-colors active:scale-90"
                                                    aria-label="Remover item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            updateQuantity(item.id, item.quantity - 1);
                                                            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                                                                window.navigator.vibrate(20);
                                                            }
                                                        }}
                                                        className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:bg-slate-300"
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => {
                                                            updateQuantity(item.id, item.quantity + 1);
                                                            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                                                                window.navigator.vibrate(20);
                                                            }
                                                        }}
                                                        className="p-3 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:bg-slate-300"
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                        <div className="p-6 border-t border-slate-100 dark:border-[#5a3329] bg-slate-50/50 dark:bg-[#2a120d]/50 space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-tight">
                                        Ao finalizar, você será redirecionada para o WhatsApp da Colares Dias para combinar o pagamento e a entrega.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-[#25D366] text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:brightness-105 transition-all shadow-lg hover:shadow-[#25D366]/20"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    FINALIZAR NO WHATSAPP
                                </button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
