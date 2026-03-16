import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboardContent from "./AdminDashboardContent";
import { adminProfileRepository } from "@/lib/repositories/admin-profile.repository";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.email) {
        redirect("/admin");
    }

    // Buscar o perfil do admin para exibir o nome de usuário
    const profile = await adminProfileRepository.findByEmail(supabase, user.email);

    if (!profile) {
        redirect("/admin?error=forbidden");
    }

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
