import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_SCRIPT_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const params = new URLSearchParams({
      name: data.name || "",
      answer: data.answer || "",
      guestCount: String(data.guestCount ?? 1),
      timestamp:
        data.timestamp ||
        new Date().toLocaleString("ru-KZ", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Almaty",
        }),
    });

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      redirect: "follow",
    });

    const text = await res.text();

    return NextResponse.json({ status: "ok", response: text });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: String(err) },
      { status: 500 }
    );
  }
}
