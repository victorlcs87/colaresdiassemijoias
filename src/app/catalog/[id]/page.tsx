import { Header } from "@/components/Header";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetailClient from "./ProductDetailClient";
import { Product } from "@/lib/types";
import { getStoreSettings } from "@/actions/settings";
import type { Metadata } from "next";
import { getStoreName, getStoreWhatsapp } from "@/lib/storeSettings";
import { Testimonials } from "@/components/Testimonials";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: productData } = await supabase
    .from("products")
    .select("name, description, image_url, image_gallery")
    .eq("id", resolvedParams.id)
    .single();

  const settings = await getStoreSettings();
  const storeName = getStoreName(settings);

  if (!productData) {
    return {
      title: "Produto não encontrado",
    };
  }

  const product = productData as Product;
  const title = `${product.name} | ${storeName}`;
  const description = product.description || `Confira ${product.name} na ${storeName}`;
  const imageUrl = product.image_url || (product.image_gallery && product.image_gallery[0]) || "/placeholder.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: productData, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !productData) {
    notFound();
  }

  const product = productData as Product;

  let relatedProducts: Product[] = [];

  if (product.name) {
    const { data: related } = await supabase
      .from("products")
      .select("*")
      .eq("name", product.name)
      .eq("is_available", true)
      .neq("id", product.id)
      .limit(10);

    if (related) relatedProducts = related as Product[];
  }

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const settings = await getStoreSettings();
  const whatsappRaw = getStoreWhatsapp(settings);
  const phoneNumber = whatsappRaw.replace(/\D/g, "");
  const wpMessage = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name} - ${formattedPrice}`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${wpMessage}`;

  return (
    <div className="bg-[#f6ede5] dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100 antialiased pb-24 md:pb-0">
      <Header />
      <ProductDetailClient
        product={product}
        whatsappUrl={whatsappUrl}
        formattedPrice={formattedPrice}
        relatedProducts={relatedProducts}
      />
      <div className="w-full max-w-[1460px] mx-auto px-4 md:px-6 lg:px-8 pb-8 md:pb-12">
        <Testimonials withForm={false} />
      </div>
    </div>
  );
}
