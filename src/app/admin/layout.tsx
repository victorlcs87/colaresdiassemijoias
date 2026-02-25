import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div className="flex flex-1 w-full bg-[#f8fcfa] dark:bg-[#11231a]">
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {children}
                </main>
            </div>
        );
    }
    return (
        <div className="flex flex-1 w-full bg-[#f8fcfa] dark:bg-[#11231a]">
            {/* Sidebar Fixa */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <AdminHeader />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
