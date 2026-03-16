import { NextResponse } from "next/server";
import { getStoreSettings } from "@/actions/settings";
import { getStoreContactEmail, getStoreDescription, getStoreInstagram, getStoreName, getStoreWhatsapp } from "@/lib/storeSettings";

export async function GET() {
    const settings = await getStoreSettings();

    return NextResponse.json(
        {
            storeName: getStoreName(settings),
            storeDescription: getStoreDescription(settings),
            whatsappNumber: getStoreWhatsapp(settings),
            instagramUser: getStoreInstagram(settings),
            contactEmail: getStoreContactEmail(settings),
        },
        {
            status: 200,
            headers: {
                "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
            },
        }
    );
}
