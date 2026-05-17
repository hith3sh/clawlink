import type { IntegrationTool } from "../../../worker/integrations/base";
import { activecampaignComposioTools } from "./activecampaign.generated";
import { affinityComposioTools } from "./affinity.generated";
import { agencyzoomComposioTools } from "./agencyzoom.generated";
import { agentMailComposioTools } from "./agent-mail.generated";
import { ahrefsComposioTools } from "./ahrefs.generated";
import { airtableComposioTools } from "./airtable.generated";
import { amplitudeComposioTools } from "./amplitude.generated";
import { apolloComposioTools } from "./apollo.generated";
import { asanaComposioTools } from "./asana.generated";
import { bamboohrComposioTools } from "./bamboohr.generated";
import { bitbucketComposioTools } from "./bitbucket.generated";
import { boxComposioTools } from "./box.generated";
import { brevoComposioTools } from "./brevo.generated";
import { calComposioTools } from "./cal.generated";
import { calendlyComposioTools } from "./calendly.generated";
import { canvaComposioTools } from "./canva.generated";
import { clickupComposioTools } from "./clickup.generated";
import { cloudflareComposioTools } from "./cloudflare.generated";
import { databricksComposioTools } from "./databricks.generated";
import { datadogComposioTools } from "./datadog.generated";
import { dataforseoComposioTools } from "./dataforseo.generated";
import { discordComposioTools } from "./discord.generated";
import { docusignComposioTools } from "./docusign.generated";
import { dropboxComposioTools } from "./dropbox.generated";
import { dynamics365ComposioTools } from "./dynamics-365.generated";
import { elevenlabsComposioTools } from "./elevenlabs.generated";
import { eventbriteComposioTools } from "./eventbrite.generated";
import { facebookComposioTools } from "./facebook.generated";
import { figmaComposioTools } from "./figma.generated";
import { firecrawlComposioTools } from "./firecrawl.generated";
import { freeagentComposioTools } from "./freeagent.generated";
import { freshbooksComposioTools } from "./freshbooks.generated";
import { freshdeskComposioTools } from "./freshdesk.generated";
import { freshserviceComposioTools } from "./freshservice.generated";
import { githubComposioTools } from "./github.generated";
import { gitlabComposioTools } from "./gitlab.generated";
import { gmailComposioTools } from "./gmail.generated";
import { googleAdminComposioTools } from "./google-admin.generated";
import { googleAdsComposioTools } from "./google-ads.generated";
import { googleAnalyticsComposioTools } from "./google-analytics.generated";
import { googleBigqueryComposioTools } from "./google-bigquery.generated";
import { googleCalendarComposioTools } from "./google-calendar.generated";
import { googleChatComposioTools } from "./google-chat.generated";
import { googleClassroomComposioTools } from "./google-classroom.generated";
import { googleContactsComposioTools } from "./google-contacts.generated";
import { googleDocsComposioTools } from "./google-docs.generated";
import { googleDriveComposioTools } from "./google-drive.generated";
import { googleFormsComposioTools } from "./google-forms.generated";
import { googleMapsComposioTools } from "./google-maps.generated";
import { googleMeetComposioTools } from "./google-meet.generated";
import { googleSearchConsoleComposioTools } from "./google-search-console.generated";
import { googleSheetsComposioTools } from "./google-sheets.generated";
import { googleSlidesComposioTools } from "./google-slides.generated";
import { googleTasksComposioTools } from "./google-tasks.generated";
import { googlephotosComposioTools } from "./googlephotos.generated";
import { grafanaComposioTools } from "./grafana.generated";
import { gumroadComposioTools } from "./gumroad.generated";
import { heygenComposioTools } from "./heygen.generated";
import { highlevelComposioTools } from "./highlevel.generated";
import { hubspotComposioTools } from "./hubspot.generated";
import { humanloopComposioTools } from "./humanloop.generated";
import { instagramComposioTools } from "./instagram.generated";
import { instantlyComposioTools } from "./instantly.generated";
import { intercomComposioTools } from "./intercom.generated";
import { jotformComposioTools } from "./jotform.generated";
import { kibanaComposioTools } from "./kibana.generated";
import { kitComposioTools } from "./kit.generated";
import { klaviyoComposioTools } from "./klaviyo.generated";
import { lemlistComposioTools } from "./lemlist.generated";
import { linearComposioTools } from "./linear.generated";
import { linkedinComposioTools } from "./linkedin.generated";
import { lmntComposioTools } from "./lmnt.generated";
import { mailchimpComposioTools } from "./mailchimp.generated";
import { mailerliteComposioTools } from "./mailerlite.generated";
import { mem0ComposioTools } from "./mem0.generated";
import { metaAdsComposioTools } from "./meta-ads.generated";
import { microsoftExcelComposioTools } from "./microsoft-excel.generated";
import { miroComposioTools } from "./miro.generated";
import { mixpanelComposioTools } from "./mixpanel.generated";
import { mondayComposioTools } from "./monday.generated";
import { motionComposioTools } from "./motion.generated";
import { newRelicComposioTools } from "./new-relic.generated";
import { notionComposioTools } from "./notion.generated";
import { omnisendComposioTools } from "./omnisend.generated";
import { onedriveComposioTools } from "./onedrive.generated";
import { onenoteComposioTools } from "./onenote.generated";
import { openaiComposioTools } from "./openai.generated";
import { outlookComposioTools } from "./outlook.generated";
import { pagerdutyComposioTools } from "./pagerduty.generated";
import { pandadocComposioTools } from "./pandadoc.generated";
import { paystackComposioTools } from "./paystack.generated";
import { perplexityAiComposioTools } from "./perplexity-ai.generated";
import { phantombusterComposioTools } from "./phantombuster.generated";
import { plausibleAnalyticsComposioTools } from "./plausible-analytics.generated";
import { postizComposioTools } from "./postiz.generated";
import { postmarkComposioTools } from "./postmark.generated";
import { quickbooksComposioTools } from "./quickbooks.generated";
import { razorpayComposioTools } from "./razorpay.generated";
import { recallaiComposioTools } from "./recallai.generated";
import { redditAdsComposioTools } from "./reddit-ads.generated";
import { redditComposioTools } from "./reddit.generated";
import { replicateComposioTools } from "./replicate.generated";
import { resendComposioTools } from "./resend.generated";
import { retellaiComposioTools } from "./retellai.generated";
import { salesforceComposioTools } from "./salesforce.generated";
import { segmentComposioTools } from "./segment.generated";
import { semrushComposioTools } from "./semrush.generated";
import { sendgridComposioTools } from "./sendgrid.generated";
import { serpapiComposioTools } from "./serpapi.generated";
import { servicenowComposioTools } from "./servicenow.generated";
import { sharepointComposioTools } from "./sharepoint.generated";
import { shopifyComposioTools } from "./shopify.generated";
import { slackComposioTools } from "./slack.generated";
import { snapchatComposioTools } from "./snapchat.generated";
import { snowflakeComposioTools } from "./snowflake.generated";
import { spotifyComposioTools } from "./spotify.generated";
import { stripeComposioTools } from "./stripe.generated";
import { tallyComposioTools } from "./tally.generated";
import { tavilyComposioTools } from "./tavily.generated";
import { telegramComposioTools } from "./telegram.generated";
import { tiktokComposioTools } from "./tiktok.generated";
import { tinypngComposioTools } from "./tinypng.generated";
import { trelloComposioTools } from "./trello.generated";
import { twilioComposioTools } from "./twilio.generated";
import { twitterComposioTools } from "./twitter.generated";
import { webflowComposioTools } from "./webflow.generated";
import { whatsappComposioTools } from "./whatsapp.generated";
import { xeroComposioTools } from "./xero.generated";
import { yandexComposioTools } from "./yandex.generated";
import { youtubeComposioTools } from "./youtube.generated";
import { zendeskComposioTools } from "./zendesk.generated";
import { zohoBooksComposioTools } from "./zoho-books.generated";
import { zoomComposioTools } from "./zoom.generated";

export const composioToolManifests: IntegrationTool[] = [
  ...activecampaignComposioTools,
  ...affinityComposioTools,
  ...agencyzoomComposioTools,
  ...agentMailComposioTools,
  ...ahrefsComposioTools,
  ...airtableComposioTools,
  ...amplitudeComposioTools,
  ...apolloComposioTools,
  ...asanaComposioTools,
  ...bamboohrComposioTools,
  ...bitbucketComposioTools,
  ...boxComposioTools,
  ...brevoComposioTools,
  ...calComposioTools,
  ...calendlyComposioTools,
  ...canvaComposioTools,
  ...clickupComposioTools,
  ...cloudflareComposioTools,
  ...databricksComposioTools,
  ...datadogComposioTools,
  ...dataforseoComposioTools,
  ...discordComposioTools,
  ...docusignComposioTools,
  ...dropboxComposioTools,
  ...dynamics365ComposioTools,
  ...elevenlabsComposioTools,
  ...eventbriteComposioTools,
  ...facebookComposioTools,
  ...figmaComposioTools,
  ...firecrawlComposioTools,
  ...freeagentComposioTools,
  ...freshbooksComposioTools,
  ...freshdeskComposioTools,
  ...freshserviceComposioTools,
  ...githubComposioTools,
  ...gitlabComposioTools,
  ...gmailComposioTools,
  ...googleAdminComposioTools,
  ...googleAdsComposioTools,
  ...googleAnalyticsComposioTools,
  ...googleBigqueryComposioTools,
  ...googleCalendarComposioTools,
  ...googleChatComposioTools,
  ...googleClassroomComposioTools,
  ...googleContactsComposioTools,
  ...googleDocsComposioTools,
  ...googleDriveComposioTools,
  ...googleFormsComposioTools,
  ...googleMapsComposioTools,
  ...googleMeetComposioTools,
  ...googleSearchConsoleComposioTools,
  ...googleSheetsComposioTools,
  ...googleSlidesComposioTools,
  ...googleTasksComposioTools,
  ...googlephotosComposioTools,
  ...grafanaComposioTools,
  ...gumroadComposioTools,
  ...heygenComposioTools,
  ...highlevelComposioTools,
  ...hubspotComposioTools,
  ...humanloopComposioTools,
  ...instagramComposioTools,
  ...instantlyComposioTools,
  ...intercomComposioTools,
  ...jotformComposioTools,
  ...kibanaComposioTools,
  ...kitComposioTools,
  ...klaviyoComposioTools,
  ...lemlistComposioTools,
  ...linearComposioTools,
  ...linkedinComposioTools,
  ...lmntComposioTools,
  ...mailchimpComposioTools,
  ...mailerliteComposioTools,
  ...mem0ComposioTools,
  ...metaAdsComposioTools,
  ...microsoftExcelComposioTools,
  ...miroComposioTools,
  ...mixpanelComposioTools,
  ...mondayComposioTools,
  ...motionComposioTools,
  ...newRelicComposioTools,
  ...notionComposioTools,
  ...omnisendComposioTools,
  ...onedriveComposioTools,
  ...onenoteComposioTools,
  ...openaiComposioTools,
  ...outlookComposioTools,
  ...pagerdutyComposioTools,
  ...pandadocComposioTools,
  ...paystackComposioTools,
  ...perplexityAiComposioTools,
  ...phantombusterComposioTools,
  ...plausibleAnalyticsComposioTools,
  ...postizComposioTools,
  ...postmarkComposioTools,
  ...quickbooksComposioTools,
  ...razorpayComposioTools,
  ...recallaiComposioTools,
  ...redditAdsComposioTools,
  ...redditComposioTools,
  ...replicateComposioTools,
  ...resendComposioTools,
  ...retellaiComposioTools,
  ...salesforceComposioTools,
  ...segmentComposioTools,
  ...semrushComposioTools,
  ...sendgridComposioTools,
  ...serpapiComposioTools,
  ...servicenowComposioTools,
  ...sharepointComposioTools,
  ...shopifyComposioTools,
  ...slackComposioTools,
  ...snapchatComposioTools,
  ...snowflakeComposioTools,
  ...spotifyComposioTools,
  ...stripeComposioTools,
  ...tallyComposioTools,
  ...tavilyComposioTools,
  ...telegramComposioTools,
  ...tiktokComposioTools,
  ...tinypngComposioTools,
  ...trelloComposioTools,
  ...twilioComposioTools,
  ...twitterComposioTools,
  ...webflowComposioTools,
  ...whatsappComposioTools,
  ...xeroComposioTools,
  ...yandexComposioTools,
  ...youtubeComposioTools,
  ...zendeskComposioTools,
  ...zohoBooksComposioTools,
  ...zoomComposioTools,
];
