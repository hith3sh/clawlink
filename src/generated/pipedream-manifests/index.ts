import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";
import { AirtablePipedreamToolManifests } from "./airtable.generated";
import { ApolloPipedreamToolManifests } from "./apollo.generated";
import { ClickupPipedreamToolManifests } from "./clickup.generated";
import { FacebookPipedreamToolManifests } from "./facebook.generated";
import { GmailPipedreamToolManifests } from "./gmail.generated";
import { GoogleAnalyticsPipedreamToolManifests } from "./google-analytics.generated";
import { GoogleCalendarPipedreamToolManifests } from "./google-calendar.generated";
import { GoogleDocsPipedreamToolManifests } from "./google-docs.generated";
import { GoogleDrivePipedreamToolManifests } from "./google-drive.generated";
import { GoogleSearchConsolePipedreamToolManifests } from "./google-search-console.generated";
import { HubspotPipedreamToolManifests } from "./hubspot.generated";
import { LinkedinPipedreamToolManifests } from "./linkedin.generated";
import { MailchimpPipedreamToolManifests } from "./mailchimp.generated";
import { NotionPipedreamToolManifests } from "./notion.generated";
import { OutlookPipedreamToolManifests } from "./outlook.generated";
import { PostizPipedreamToolManifests } from "./postiz.generated";
import { SalesforcePipedreamToolManifests } from "./salesforce.generated";
import { XeroPipedreamToolManifests } from "./xero.generated";
import { YoutubePipedreamToolManifests } from "./youtube.generated";

export const pipedreamToolManifests: PipedreamActionToolManifest[] = [
  ...AirtablePipedreamToolManifests,
  ...ApolloPipedreamToolManifests,
  ...ClickupPipedreamToolManifests,
  ...FacebookPipedreamToolManifests,
  ...GmailPipedreamToolManifests,
  ...GoogleAnalyticsPipedreamToolManifests,
  ...GoogleCalendarPipedreamToolManifests,
  ...GoogleDocsPipedreamToolManifests,
  ...GoogleDrivePipedreamToolManifests,
  ...GoogleSearchConsolePipedreamToolManifests,
  ...HubspotPipedreamToolManifests,
  ...LinkedinPipedreamToolManifests,
  ...MailchimpPipedreamToolManifests,
  ...NotionPipedreamToolManifests,
  ...OutlookPipedreamToolManifests,
  ...PostizPipedreamToolManifests,
  ...SalesforcePipedreamToolManifests,
  ...XeroPipedreamToolManifests,
  ...YoutubePipedreamToolManifests,
];
