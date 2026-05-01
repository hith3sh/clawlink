import type { IntegrationTool } from "../../../worker/integrations/base";
import { apolloComposioTools } from "./apollo.generated";
import { gmailComposioTools } from "./gmail.generated";
import { googleAdsComposioTools } from "./google-ads.generated";
import { googleAnalyticsComposioTools } from "./google-analytics.generated";
import { googleCalendarComposioTools } from "./google-calendar.generated";
import { googleDocsComposioTools } from "./google-docs.generated";
import { googleSearchConsoleComposioTools } from "./google-search-console.generated";
import { hubspotComposioTools } from "./hubspot.generated";
import { instantlyComposioTools } from "./instantly.generated";
import { klaviyoComposioTools } from "./klaviyo.generated";
import { onedriveComposioTools } from "./onedrive.generated";
import { outlookComposioTools } from "./outlook.generated";
import { postizComposioTools } from "./postiz.generated";

export const composioToolManifests: IntegrationTool[] = [
  ...apolloComposioTools,
  ...gmailComposioTools,
  ...googleAdsComposioTools,
  ...googleAnalyticsComposioTools,
  ...googleCalendarComposioTools,
  ...googleDocsComposioTools,
  ...googleSearchConsoleComposioTools,
  ...hubspotComposioTools,
  ...instantlyComposioTools,
  ...klaviyoComposioTools,
  ...onedriveComposioTools,
  ...outlookComposioTools,
  ...postizComposioTools,
];
