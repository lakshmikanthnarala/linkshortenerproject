'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createLink } from "./actions";

export function CreateLinkDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (loading) return;
    setIsOpen(false);
    setError(null);
    setUrl("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createLink({ url: url.trim() });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Unable to create link.");
      return;
    }

    handleClose();
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create link</Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div
            className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
            role="dialog"
            aria-modal="true"
            aria-label="Create short link"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                  Create a short link
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Paste the URL you want to shorten and save it to your dashboard.
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                ✕
              </Button>
            </div>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                URL
                <input
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com/some-long-url"
                  required
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 py-1 sm:flex-row sm:justify-end">
                <Button variant="outline" type="button" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Create link"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
