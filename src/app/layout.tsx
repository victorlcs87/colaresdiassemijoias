import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { getStoreDescription, getStoreName } from "@/lib/storeSettings";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

import { getStoreSettings } from "@/actions/settings";

export const viewport = {
  themeColor: '#6b2b17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const storeName = getStoreName(settings);
  const storeDescription = getStoreDescription(settings);

  return {
    title: {
      default: storeName,
      template: `%s | ${storeName}`
    },
    description: storeDescription,
    manifest: '/manifest.json?v=6',
    appleWebApp: {
      capable: true,
      title: storeName,
      statusBarStyle: 'default',
    },
    icons: {
      icon: [
        { url: '/favicon.ico?v=6', type: 'image/x-icon' },
        { url: '/icon-512-v2.png?v=6', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/apple-touch-icon.png?v=6', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon-precomposed.png?v=6',
        },
      ],
    },
    keywords: ["semijoias", "acessórios", "colares", "brincos", "pulseiras", "catálogo virtual"],
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
        suppressHydrationWarning
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
