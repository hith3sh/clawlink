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
import { mailchimpComposioTools } from "./mailchimp.generated";
import { notionComposioTools } from "./notion.generated";
import { onedriveComposioTools } from "./onedrive.generated";
import { outlookComposioTools } from "./outlook.generated";
import { postizComposioTools } from "./postiz.generated";
import { salesforceComposioTools } from "./salesforce.generated";
import { twilioComposioTools } from "./twilio.generated";
import { xeroComposioTools } from "./xero.generated";
import { airtableComposioTools } from "./airtable.generated";
import { calendlyComposioTools } from "./calendly.generated";
import { clickupComposioTools } from "./clickup.generated";

export const composioToolManifests: IntegrationTool[] = [
  ...airtableComposioTools,
  ...apolloComposioTools,
  ...calendlyComposioTools,
  ...clickupComposioTools,
  ...gmailComposioTools,
  ...googleAdsComposioTools,
  ...googleAnalyticsComposioTools,
  ...googleCalendarComposioTools,
  ...googleDocsComposioTools,
  ...googleSearchConsoleComposioTools,
  ...hubspotComposioTools,
  ...instantlyComposioTools,
  ...klaviyoComposioTools,
  ...mailchimpComposioTools,
  ...notionComposioTools,
  ...onedriveComposioTools,
  ...outlookComposioTools,
  ...postizComposioTools,
  ...salesforceComposioTools,
  ...twilioComposioTools,
  ...xeroComposioTools,
];
