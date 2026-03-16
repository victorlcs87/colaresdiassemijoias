"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    variant?: "default" | "danger";
    onConfirm: () => void;
    onClose: () => void;
};

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    loading = false,
    variant = "default",
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    useEffect(() => {
        if (!open) return;

        const previousFocus = document.activeElement as HTMLElement | null;
        cancelButtonRef.current?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.preventDefault();
                if (!loading) onClose();
                return;
            }

            if (event.key !== "Tab" || !dialogRef.current) return;

            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previousFocus?.focus();
        };
    }, [loading, onClose, open]);

    if (!open) return null;

    const confirmClassName = variant === "danger"
        ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-300"
        : "bg-primary hover:brightness-110 focus-visible:ring-primary/40";

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="w-full max-w-md rounded-2xl border border-[#d9b7a6] dark:border-[#5a3329] bg-white dark:bg-[#2a120d] p-6 shadow-2xl"
            >
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        <AlertTriangle className="h-4 w-4" />
                    </span>
                    <div>
                        <h2 id={titleId} className="text-lg font-bold text-slate-900 dark:text-white">
                            {title}
                        </h2>
                        <p id={descriptionId} className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#5a3329] dark:text-slate-200 dark:hover:bg-[#341810]"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmClassName}`}
                    >
                        {loading ? "Processando..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
