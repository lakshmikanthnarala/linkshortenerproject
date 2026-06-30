import { NextResponse } from "next/server";

import { getLinkByShortCode } from "@/data/links";
import {
  enforceRateLimit,
  getClientIpFromHeaders,
  isValidHttpUrl,
} from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const clientIp = getClientIpFromHeaders(request.headers);
  enforceRateLimit(`redirect:${clientIp}`, 100, 60_000);

  const { shortcode } = await params;
  const link = await getLinkByShortCode(shortcode);

  if (!link?.url) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  if (!isValidHttpUrl(link.url)) {
    return NextResponse.json(
      { error: "Saved URL is invalid or unsafe" },
      { status: 400 }
    );
  }

  return NextResponse.redirect(link.url);
}
