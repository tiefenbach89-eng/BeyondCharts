import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings.server";

<<<<<<< HEAD
export const runtime = "nodejs";


=======
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function POST(req: Request) {
  const data = await req.json();
  await saveSettings(data);
  return NextResponse.json({ ok: true });
<<<<<<< HEAD
}
=======
}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
