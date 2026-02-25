import type { MetadataRoute } from 'next'
import { getStoreSettings } from '@/actions/settings'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const settings = await getStoreSettings()
    const storeName = settings.storeName || "Lojinha da Lari"
    const storeDescription = settings.storeDescription || "Catálogo virtual de produtos médicos, scrubs e garrafas Owala."

    return {
        name: storeName,
        short_name: storeName,
        description: storeDescription,
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#12b886',
        icons: [
            {
                src: '/icon-192x192.png?v=2',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-192x192.png?v=2',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/icon-512x512.png?v=2',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512x512.png?v=2',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}
