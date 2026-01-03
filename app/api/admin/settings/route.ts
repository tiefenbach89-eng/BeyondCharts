import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings.server";

export const runtime = "nodejs";


export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function POST(req: Request) {
  const data = await req.json();
  await saveSettings(data);
  return NextResponse.json({ ok: true });
}