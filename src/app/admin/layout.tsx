import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/auth/admin-guard";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const isAdmin = session ? await isCurrentUserAdmin() : false;

    if (!session || !isAdmin) {
        return (
            <div className="flex flex-1 w-full bg-[#f6ede5] dark:bg-[#24100b]">
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                    {children}
                </main>
            </div>
        );
    }
    return (
        <div className="flex flex-1 w-full bg-[#f6ede5] dark:bg-[#24100b]">
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
