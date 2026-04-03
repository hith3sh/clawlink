import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      <SidebarProvider className="bg-[#04060a]">
        <AppSidebar />
        <SidebarInset className="border border-white/6 bg-transparent shadow-none">
          <div className="dashboard-shell">
            <DashboardTopbar />
            <div className="dashboard-content mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
