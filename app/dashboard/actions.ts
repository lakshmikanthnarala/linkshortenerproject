'use server';

import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";

import { createLinkForUser } from "@/data/links";

const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export interface CreateLinkResult {
  success: boolean;
  error?: string;
  shortCode?: string;
}

export async function createLink(
  input: CreateLinkInput
): Promise<CreateLinkResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid URL",
    };
  }

  try {
    const link = await createLinkForUser(user.id, parsed.data);

    return {
      success: true,
      shortCode: link.shortCode,
    };
  } catch (error) {
    console.error("createLink action error", error);
    return {
      success: false,
      error: "Unable to create link. Please try again.",
    };
  }
}

const updateLinkSchema = z.object({
  id: z.number(),
  url: z.string().url("Please enter a valid URL"),
});

export interface UpdateLinkResult {
  success: boolean;
  error?: string;
}

export async function updateLink(
  input: z.infer<typeof updateLinkSchema>
): Promise<UpdateLinkResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const updated = await import("@/data/links").then((m) =>
      m.updateLinkForUser(user.id, parsed.data.id, { url: parsed.data.url })
    );

    if (!updated) {
      return { success: false, error: "Link not found or not owned by user" };
    }

    return { success: true };
  } catch (error) {
    console.error("updateLink action error", error);
    return { success: false, error: "Unable to update link. Please try again." };
  }
}

const deleteLinkSchema = z.object({
  id: z.number(),
});

export async function deleteLink(
  input: z.infer<typeof deleteLinkSchema>
): Promise<UpdateLinkResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = deleteLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const deleted = await import("@/data/links").then((m) =>
      m.deleteLinkForUser(user.id, parsed.data.id)
    );

    if (!deleted) {
      return { success: false, error: "Link not found or not owned by user" };
    }

    return { success: true };
  } catch (error) {
    console.error("deleteLink action error", error);
    return { success: false, error: "Unable to delete link. Please try again." };
  }
}
