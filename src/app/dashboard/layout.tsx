import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar";
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar";
import { DashboardConnectionsProvider } from "@/components/dashboard/DashboardConnectionsProvider";
import { DashboardThemeProvider } from "@/components/dashboard/ThemeProvider";

/**
 * Inline script that runs before React hydrates to apply the stored theme
 * class immediately, preventing a flash of the wrong theme.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem("clawlink-theme");if(t!=="light")document.getElementById("dashboard-theme-root").classList.add("dark")}catch(e){}})()`;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="dashboard-theme-root" className="min-h-svh bg-background text-foreground">
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <DashboardThemeProvider>
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
      </DashboardThemeProvider>
    </div>
  );
}
