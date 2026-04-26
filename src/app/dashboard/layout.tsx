import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardConnectionsProvider } from "@/components/dashboard/DashboardConnectionsProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <DashboardConnectionsProvider>
        <SidebarProvider style={{ "--sidebar-width": "17.5rem" } as React.CSSProperties}>
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </DashboardConnectionsProvider>
    </div>
  );
}
