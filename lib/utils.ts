import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const rateLimitStore = new Map<
  string,
  { count: number; expiresAt: number }
>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function normalizeHttpUrl(value: string) {
  const normalized = value.trim()
  const url = new URL(normalized)

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http(s) URLs are allowed")
  }

  return url.toString()
}

type HeadersLike = {
  get(name: string): string | null | undefined;
};

export function getClientIpFromHeaders(headers: HeadersLike | undefined) {
  if (!headers) {
    return "unknown"
  }

  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    headers.get("fastly-client-ip") ??
    "unknown"
  )
}

export function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + windowMs })
    return
  }

  if (entry.count >= limit) {
    throw new Error("Rate limit exceeded. Please try again later.")
  }

  rateLimitStore.set(key, { count: entry.count + 1, expiresAt: entry.expiresAt })
}
