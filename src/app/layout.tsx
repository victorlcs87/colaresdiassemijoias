import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

import { getStoreSettings } from "@/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const storeName = settings.storeName || "Lojinha da Lari";
  const storeDescription = settings.storeDescription || "Catálogo virtual de produtos exclusivos selecionados a dedo pela Lari.";

  return {
    title: {
      default: storeName,
      template: `%s | ${storeName}`
    },
    description: storeDescription,
    keywords: ["loja online", "roupas", "moda feminina", "acessórios", "catálogo virtual"],
    openGraph: {
      title: storeName,
      description: storeDescription,
      siteName: storeName,
      locale: "pt_BR",
      type: "website",
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased min-h-screen flex flex-col pb-20 md:pb-0`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <MobileHeader />
          <div className="flex-1 flex flex-col w-full">
            {children}
          </div>
          <Footer />
          <MobileNav />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
