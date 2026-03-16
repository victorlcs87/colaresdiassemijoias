"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
    defaultValue?: string;
    onUploadSuccess: (url: string) => void;
}

export function ImageUpload({ defaultValue, onUploadSuccess }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(defaultValue || null);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onUploadSuccess(publicUrl);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro ao fazer upload");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onUploadSuccess("");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                {preview ? (
                    <div className="relative w-full aspect-square max-w-[200px] rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm group">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            sizes="200px"
                            className="object-cover"
                            unoptimized
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 dark:border-[#5a3329] rounded-xl cursor-pointer bg-[#f6ede5] dark:bg-[#341810] hover:bg-slate-50 dark:hover:bg-[#341810]/80 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                            ) : (
                                <Upload className="w-10 h-10 text-slate-400 group-hover:text-primary transition-colors mb-3" />
                            )}
                            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
                                {uploading ? "Enviando..." : "Clique para enviar imagem"}
                            </p>
                            <p className="text-xs text-slate-400">PNG, JPG ou WEBP (Máx. 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                )}
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
