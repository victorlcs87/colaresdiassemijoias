"use client";

import { useState, useEffect } from "react";
import {
    Store,
    MessageCircle,
    Instagram,
    Share2,
    Palette,
    ShieldCheck,
    Save,
    Globe,
    Mail,
    Smartphone,
    Loader2
} from "lucide-react";
import { getStoreSettings, updateStoreSettings } from "@/actions/settings";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [activeSection, setActiveSection] = useState("general");
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    useEffect(() => {
        async function loadSettings() {
            const settings = await getStoreSettings();
            setFormData(settings);
            setFetching(false);
        }
        loadSettings();
    }, []);

    const sections = [
        { id: "general", label: "Geral", icon: Store },
        { id: "social", label: "Redes Sociais", icon: Share2 },
        { id: "appearance", label: "Aparência", icon: Palette },
        { id: "security", label: "Segurança", icon: ShieldCheck },
    ];

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);

        const result = await updateStoreSettings(formData);

        if (result.success) {
            setMessage({ type: "success", text: "Configurações salvas no banco de dados!" });
        } else {
            setMessage({ type: "error", text: "Erro ao salvar: " + result.error });
        }

        setLoading(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (fetching) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Configurações</h2>
                    <p className="text-slate-500 mt-1">Gerencie as informações da sua loja em tempo real</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>{loading ? "Salvando..." : "Salvar Alterações"}</span>
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                {/* Navigation Menu */}
                <div className="space-y-1">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeSection === section.id
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-slate-500 hover:bg-[#f0ddcf] dark:hover:bg-[#341810] hover:text-primary"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{section.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="space-y-6">
                    {activeSection === "general" && (
                        <div className="bg-white dark:bg-[#2a120d] border border-[#d9b7a6] dark:border-[#5a3329] rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Globe className="text-primary w-5 h-5" />
                                Informações da Loja
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nome da Loja</label>
                                        <div className="relative">
                                            <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.store_name || ""}
                                                onChange={(e) => handleInputChange("store_name", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail de Contato</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={formData.contact_email || ""}
                                                onChange={(e) => handleInputChange("contact_email", e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">WhatsApp Comercial</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.whatsapp_number || ""}
                                            onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descrição da Loja</label>
                                    <textarea
                                        value={formData.store_description || ""}
                                        onChange={(e) => handleInputChange("store_description", e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                        placeholder="Ex: Catálogo virtual de acessórios e semijoias com curadoria exclusiva."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "social" && (
                        <div className="bg-white dark:bg-[#2a120d] border border-[#d9b7a6] dark:border-[#5a3329] rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Share2 className="text-primary w-5 h-5" />
                                Canais Sociais
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Instagram</label>
                                    <div className="relative">
                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.instagram_user || ""}
                                            onChange={(e) => handleInputChange("instagram_user", e.target.value)}
                                            placeholder="@seuusuario"
                                            className="w-full pl-10 pr-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">TikTok</label>
                                    <div className="relative">
                                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.tiktok_user || ""}
                                            onChange={(e) => handleInputChange("tiktok_user", e.target.value)}
                                            placeholder="@seuusuario"
                                            className="w-full pl-10 pr-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "appearance" && (
                        <div className="bg-white dark:bg-[#2a120d] border border-[#d9b7a6] dark:border-[#5a3329] rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Palette className="text-primary w-5 h-5" />
                                Personalização
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tema do Sistema</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleInputChange("theme_mode", "light")}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${formData.theme_mode === "light"
                                                ? "border-primary bg-primary/5"
                                                : "border-transparent bg-[#f6ede5] hover:border-slate-200"
                                                }`}
                                        >
                                            <div className="w-full aspect-video bg-white rounded border border-slate-100 shadow-sm" />
                                            <span className="text-sm font-bold">Modo Claro</span>
                                        </button>
                                        <button
                                            onClick={() => handleInputChange("theme_mode", "dark")}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${formData.theme_mode === "dark"
                                                ? "border-primary bg-primary/5"
                                                : "border-transparent bg-[#f6ede5] dark:bg-[#341810] hover:border-slate-800"
                                                }`}
                                        >
                                            <div className="w-full aspect-video bg-slate-900 rounded border border-slate-800 shadow-sm" />
                                            <span className="text-sm font-bold">Modo Escuro</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="bg-white dark:bg-[#2a120d] border border-[#d9b7a6] dark:border-[#5a3329] rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                                <ShieldCheck className="text-primary w-5 h-5" />
                                Segurança da Conta
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nova Senha</label>
                                    <input
                                        type="password"
                                        value={formData.new_password || ""}
                                        onChange={(e) => handleInputChange("new_password", e.target.value)}
                                        className="w-full px-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                        placeholder="Digite a nova senha"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        value={formData.confirm_password || ""}
                                        onChange={(e) => handleInputChange("confirm_password", e.target.value)}
                                        className="w-full px-4 py-2 bg-[#f6ede5] dark:bg-[#341810] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
                                        placeholder="Confirme a nova senha"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const pw = formData.new_password || "";
                                        const cpw = formData.confirm_password || "";
                                        if (!pw || pw.length < 6) {
                                            setMessage({ type: "error", text: "A senha deve ter no mínimo 6 caracteres." });
                                            setTimeout(() => setMessage(null), 3000);
                                            return;
                                        }
                                        if (pw !== cpw) {
                                            setMessage({ type: "error", text: "As senhas não coincidem." });
                                            setTimeout(() => setMessage(null), 3000);
                                            return;
                                        }
                                        setLoading(true);
                                        try {
                                            const { createClient } = await import("@/lib/supabase/client");
                                            const supabase = createClient();
                                            const { error } = await supabase.auth.updateUser({ password: pw });
                                            if (error) {
                                                setMessage({ type: "error", text: "Erro ao alterar senha: " + error.message });
                                            } else {
                                                setMessage({ type: "success", text: "Senha alterada com sucesso!" });
                                                handleInputChange("new_password", "");
                                                handleInputChange("confirm_password", "");
                                            }
                                        } catch (error) {
                                            const message = error instanceof Error ? error.message : "Falha desconhecida";
                                            setMessage({ type: "error", text: "Erro inesperado: " + message });
                                        }
                                        setLoading(false);
                                        setTimeout(() => setMessage(null), 3000);
                                    }}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    {loading ? "Alterando..." : "Alterar Senha"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
