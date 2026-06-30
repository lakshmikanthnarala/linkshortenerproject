import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { links } from "@/db/schema";
import { isValidHttpUrl, normalizeHttpUrl } from "@/lib/utils";

function generateShortCode(length = 6) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function getUserLinks(clerkUserId: string) {
  return db
    .select({
      id: links.id,
      shortCode: links.shortCode,
      url: links.url,
      createdAt: links.createdAt,
    })
    .from(links)
    .where(eq(links.clerkUserId, clerkUserId))
    .orderBy(desc(links.createdAt));
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select({
      url: links.url,
    })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link ?? null;
}

export async function createLinkForUser(
  clerkUserId: string,
  input: { url: string }
) {
  if (!isValidHttpUrl(input.url)) {
    throw new Error("Only http(s) URLs are allowed");
  }

  const safeUrl = normalizeHttpUrl(input.url);
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const shortCode = generateShortCode();

    try {
      const [link] = await db
        .insert(links)
        .values({
          clerkUserId,
          url: safeUrl,
          shortCode,
        })
        .returning({
          shortCode: links.shortCode,
        });

      return { shortCode: link.shortCode };
    } catch {
      if (attempt === maxAttempts - 1) {
        throw new Error("Unable to generate a unique short code");
      }
    }
  }

  throw new Error("Unable to create link");
}

export async function updateLinkForUser(
  clerkUserId: string,
  id: number,
  input: { url: string }
) {
  if (!isValidHttpUrl(input.url)) {
    throw new Error("Only http(s) URLs are allowed");
  }

  const safeUrl = normalizeHttpUrl(input.url);
  const result = await db
    .update(links)
    .set({ url: safeUrl, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.clerkUserId, clerkUserId)))
    .returning({ id: links.id, url: links.url, updatedAt: links.updatedAt });

  return result[0] ?? null;
}

export async function deleteLinkForUser(clerkUserId: string, id: number) {
  const result = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.clerkUserId, clerkUserId)))
    .returning({ id: links.id });

  return result.length > 0;
}
