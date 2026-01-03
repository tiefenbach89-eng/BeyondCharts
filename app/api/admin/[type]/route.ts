import { NextResponse } from "next/server";
import { listContent, upsertContent, deleteContent } from "@/lib/content.server";
import { getSettings } from "@/lib/settings.server";
import { processImageUrl } from "@/lib/imageStorage";

export const runtime = "nodejs";

type ContentType = "news" | "analyses";

/* ===================== REVALIDATION ===================== */

async function triggerRevalidation(
  type: ContentType,
  slug?: string,
  action?: string
) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug, action }),
    });

    if (response.ok) {
      console.log(`✅ Revalidation triggered for ${type}${slug ? `/${slug}` : ""}`);
    } else {
      console.warn(`⚠️ Revalidation returned status ${response.status}`);
    }
  } catch (err) {
    console.error("⚠️ Revalidation failed (non-critical):", err);
  }
}

/* ===================== GET ===================== */

export async function GET(
  request: Request,
  context: { params: { type: string } }
) {
  const type = context.params.type as ContentType;

  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get("includeDrafts") === "1";

  const items = await listContent(type, { includeDrafts });

  return NextResponse.json(items);
}

/* ===================== POST ===================== */

export async function POST(
  request: Request,
  context: { params: { type: string } }
) {
  const type = context.params.type as ContentType;
  const body = await request.json();
  const settings = await getSettings();

  const error = validatePayload(type, body, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (body.imageUrl) {
    body.imageUrl = await processImageUrl(body.imageUrl);
  }

  if (type === "analyses" && body.snapshot) {
    body.analysis = {
      overview: body.snapshot.thesis || "",
      businessModel: body.snapshot.profitability || "",
      risks: body.snapshot.risk || "",
      scenarios: body.snapshot.substance || "",
    };
    delete body.snapshot;
  }

  const item = await upsertContent(type, body);

  if (item.status === "published") {
    await triggerRevalidation(type, item.slug, "create");
  }

  return NextResponse.json(item);
}

/* ===================== PUT ===================== */

export async function PUT(
  request: Request,
  context: { params: { type: string } }
) {
  const type = context.params.type as ContentType;
  const body = await request.json();

  const settings = await getSettings();
  const error = validatePayload(type, body, settings);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (body.imageUrl) {
    try {
      body.imageUrl = await processImageUrl(body.imageUrl);
    } catch (err) {
      console.error("❌ Image processing failed:", err);
    }
  }

  if (type === "analyses" && body.snapshot) {
    body.analysis = {
      overview: body.snapshot.thesis || "",
      businessModel: body.snapshot.profitability || "",
      risks: body.snapshot.risk || "",
      scenarios: body.snapshot.substance || "",
    };
    delete body.snapshot;
  }

  const item = await upsertContent(type, body);

  if (item.status === "published") {
    await triggerRevalidation(type, item.slug, "update");
  }

  return NextResponse.json(item);
}

/* ===================== DELETE ===================== */

export async function DELETE(
  request: Request,
  context: { params: { type: string } }
) {
  const type = context.params.type as ContentType;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteContent(type, id);
  await triggerRevalidation(type, undefined, "delete");

  return NextResponse.json({ ok: true });
}

/* ===================== VALIDATION ===================== */

function validatePayload(
  type: ContentType,
  payload: any,
  settings: any
): string | null {
  if (payload.status === "published") {
    if (payload.auditStatus !== "approved") {
      return "Beitrag muss vor Veröffentlichung freigegeben werden.";
    }
  }

  if (type === "news") {
    const requireSource =
      settings?.legal?.requireSourceForExternalNews !== false;

    if (requireSource && payload.sourceType === "external") {
      if (!payload.source || !payload.source.trim()) {
        return "Quelle ist erforderlich (externe News).";
      }
      if (!payload.sourceUrl || !isValidHttpUrl(payload.sourceUrl)) {
        return "Gültiger Quellen-Link ist erforderlich (externe News).";
      }
    }
  }

  return null;
}

function isValidHttpUrl(maybeUrl: string) {
  try {
    const u = new URL(maybeUrl);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
