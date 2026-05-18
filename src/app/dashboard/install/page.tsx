import AudienceTabs from "@/components/AudienceTabs";
import { MarketingThemeProvider } from "@/components/MarketingThemeProvider";

export default function InstallPage() {
  return (
    <div>
      <MarketingThemeProvider>
        <AudienceTabs />
      </MarketingThemeProvider>
    </div>
  );
}
