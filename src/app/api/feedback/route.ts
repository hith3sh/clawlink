import { NextResponse } from "next/server";
import { resolveRequestActor } from "@/lib/server/request-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const actor = await resolveRequestActor(request.headers);

    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, message, image } = body as {
      email?: string;
      message?: string;
      image?: string; // base64 data URL
    };

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("[api/feedback] Telegram credentials not configured");
      return NextResponse.json(
        { error: "Feedback service not configured" },
        { status: 500 }
      );
    }

    const userEmail = email?.trim() || actor.user.email || "Unknown";
    const userId = actor.user.id;

    const caption = [
      `📩 New Feedback from ClawLink`,
      ``,
      `📧 Email: ${userEmail}`,
      `🆔 User ID: ${userId}`,
      ``,
      `📝 Message:`,
      message.trim(),
    ].join("\n");

    let telegramResponse: Response;

    if (image && image.startsWith("data:")) {
      // Extract base64 data from data URL
      const base64Data = image.split(",")[1];
      const mimeMatch = image.match(/data:([^;]+);base64/);
      const mimeType = mimeMatch?.[1] || "image/png";

      // Convert base64 to binary for FormData
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });

      const formData = new FormData();
      formData.append("chat_id", chatId);
      formData.append("caption", caption);
      formData.append("photo", blob, `feedback-${Date.now()}.png`);

      telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendPhoto`,
        {
          method: "POST",
          body: formData,
        }
      );
    } else {
      telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: caption,
          }),
        }
      );
    }

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error("[api/feedback] Telegram API error:", errorText);
      return NextResponse.json(
        { error: "Failed to send feedback. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/feedback] error:", error);
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}
