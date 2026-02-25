import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboardContent from "./AdminDashboardContent";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin");
    }

    // Buscar o perfil do admin para exibir o nome de usuário
    const { data: profile } = await supabase
        .from("admin_profiles")
        .select("username")
        .eq("email", user.email)
        .single();

    // Buscar dados dos produtos para estatísticas
    const { data: products } = await supabase.from("products").select("is_available, price");

    let totalProducts = 0;
    let activeProducts = 0;
    let avgPrice = 0;

    if (products) {
        totalProducts = products.length;
        activeProducts = products.filter(p => p.is_available).length;
        const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
        avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    }

    return (
        <AdminDashboardContent
            username={profile?.username || "Admin"}
            stats={{ totalProducts, activeProducts, avgPrice }}
        />
    );
}
