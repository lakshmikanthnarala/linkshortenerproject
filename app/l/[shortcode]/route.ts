import { NextResponse } from "next/server";

import { getLinkByShortCode } from "@/data/links";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;
  const link = await getLinkByShortCode(shortcode);

  if (!link?.url) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  return NextResponse.redirect(link.url);
}
