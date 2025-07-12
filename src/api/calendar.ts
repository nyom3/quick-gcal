import axios from 'axios';

interface CreateEventParams {
  title: string;
  start: string; // YYYY-MM-DDTHH:MM 形式
  end: string;   // YYYY-MM-DDTHH:MM 形式
  location?: string;
}

export async function createCalendarEvent(params: CreateEventParams) {
  const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL;

  if (!makeWebhookUrl) {
    throw new Error("NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL is not defined");
  }

  const response = await axios.post(makeWebhookUrl, {
    title: params.title,
    start: params.start,
    end: params.end,
    location: params.location,
  });

  return response.data;
}
