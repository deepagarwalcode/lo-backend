import { App } from "@slack/bolt";
import { NextResponse } from "next/server";

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const sendMessage = async (message: string) => {
  try {
    await app.client.chat.postMessage({
      channel: process.env.SLACK_CHANNEL || "sample", 
      token: process.env.SLACK_BOT_TOKEN,
      text: message,
    });
  } catch (error) {
    console.error("Error sending Slack message:", error);
    throw error; // Re-throw to be handled by outer try-catch
  }
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;
    console.log(message)
    await sendMessage(message);
    return NextResponse.json(
      { message: "Slack notification sent" },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error("Error in slack-notifications API:", error);
    return NextResponse.json(
      { error: "Failed to send Slack notification" },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}
