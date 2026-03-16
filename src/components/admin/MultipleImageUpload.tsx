"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MultipleImageUploadProps {
    defaultValue?: string[];
    onUploadSuccess: (urls: string[]) => void;
}

export function MultipleImageUpload({ defaultValue = [], onUploadSuccess }: MultipleImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>(defaultValue);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const newUrls: string[] = [];

            for (let i = 0; i < event.target.files.length; i++) {
                const file = event.target.files[i];
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

                newUrls.push(publicUrl);
            }

            const updatedPreviews = [...previews, ...newUrls];
            setPreviews(updatedPreviews);
            onUploadSuccess(updatedPreviews);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Erro ao fazer upload");
            console.error(err);
        } finally {
            setUploading(false);
            // Reset input so the same files can be selected again if needed
            event.target.value = "";
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
        setPreviews(updatedPreviews);
        onUploadSuccess(updatedPreviews);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 w-full">
                {previews.map((preview, idx) => (
                    <div key={idx} className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-200 dark:border-[#5a3329] rounded-xl cursor-pointer bg-[#f6ede5] dark:bg-[#341810] hover:bg-slate-50 dark:hover:bg-[#341810]/80 transition-all group">
                    <div className="flex flex-col items-center justify-center text-center p-2">
                        {uploading ? (
                            <Loader2 className="w-6 h-6 text-primary animate-spin mb-1" />
                        ) : (
                            <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors mb-1" />
                        )}
                        <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                            {uploading ? "Enviando..." : "Múltiplas Fotos"}
                        </p>
                    </div>
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
