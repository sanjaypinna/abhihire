import { NextResponse } from "next/server";
import FormData from "form-data";

export async function POST(request: Request) {
  try {
    const jsonData = await request.json();
    const { topic, title, content, type } = jsonData;

    const formData = new FormData();
    formData.append("topic", topic);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("type", type);

    const apiEndpoint = "https://powerapps.sbs/AbhiHire/Notification/Send_GeneralNotification.php";

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: formData.getHeaders(), // 🔥 This sets multipart/form-data with boundary
      body: formData as unknown as BodyInit,
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("Backend responded with error:", response.status, responseText);
      return NextResponse.json({ error: "Notification send failed", detail: responseText }, { status: 500 });
    }

    try {
      const json = JSON.parse(responseText);
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({ message: "Notification sent", raw: responseText });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 });
  }
}
