import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";
import { FacebookPipedreamToolManifests } from "./facebook.generated";
import { GmailPipedreamToolManifests } from "./gmail.generated";
import { LinkedinPipedreamToolManifests } from "./linkedin.generated";
import { MailchimpPipedreamToolManifests } from "./mailchimp.generated";
import { NotionPipedreamToolManifests } from "./notion.generated";
import { OutlookPipedreamToolManifests } from "./outlook.generated";
import { XeroPipedreamToolManifests } from "./xero.generated";

export const pipedreamToolManifests: PipedreamActionToolManifest[] = [
  ...FacebookPipedreamToolManifests,
  ...GmailPipedreamToolManifests,
  ...LinkedinPipedreamToolManifests,
  ...MailchimpPipedreamToolManifests,
  ...NotionPipedreamToolManifests,
  ...OutlookPipedreamToolManifests,
  ...XeroPipedreamToolManifests,
];
