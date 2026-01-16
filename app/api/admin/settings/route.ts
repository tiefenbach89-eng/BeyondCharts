import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings.server";
import { requireAdmin } from "@/lib/auth.middleware";

export const runtime = "nodejs";


export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  return NextResponse.json(await getSettings());
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }

  const data = await request.json();
  await saveSettings(data);
  return NextResponse.json({ ok: true });
}
