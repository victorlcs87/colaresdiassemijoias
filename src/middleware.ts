import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { user, supabaseResponse } = await updateSession(request);
    const { pathname } = request.nextUrl;

    // Rotas protegidas: tudo que começa com /admin EXCETO /admin (login)
    const isProtectedRoute = pathname.startsWith("/admin/");
    const isLoginPage = pathname === "/admin";

    // Se a rota é protegida e não tem sessão → redireciona para login
    if (isProtectedRoute && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    // Se está na página de login e já tem sessão → redireciona para dashboard
    if (isLoginPage && user) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Intercepta todas as requests EXCETO:
         * - _next/static (assets estáticos)
         * - _next/image (otimização de imagens)
         * - favicon.ico (ícone)
         * - Imagens públicas (svg, png, jpg, etc)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
