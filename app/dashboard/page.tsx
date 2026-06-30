import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getUserLinks } from "@/data/links";
import { CreateLinkDialog } from "./CreateLinkDialog";
import EditLinkDialog from "./EditLinkDialog";
import DeleteLinkDialog from "./DeleteLinkDialog";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const links = await getUserLinks(userId);
  const orderedLinks = [...links].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Workspace overview
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Welcome to your dashboard
              </h1>
              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                Manage the links you have created and keep an eye on the URLs you share most often.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CreateLinkDialog />
              <Button asChild>
                <Link href="/">Back home</Link>
              </Button>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                Your links
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {links.length === 0
                  ? "You have not created any short links yet."
                  : `${links.length} ${links.length === 1 ? "link" : "links"} in your workspace.`}
              </p>
            </div>
          </div>

          {orderedLinks.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Start by creating a short link from the homepage once you are ready to share a URL.
            </div>
          ) : (
            <ul className="mt-8 space-y-4">
              {orderedLinks.map((link) => (
                <li
                  key={link.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
                        /{link.shortCode}
                      </p>
                      <p className="mt-2 break-all text-sm text-zinc-700 dark:text-zinc-300">
                        {link.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(link.createdAt).toLocaleDateString("en", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <EditLinkDialog id={Number(link.id)} url={link.url} shortCode={link.shortCode} />
                        <DeleteLinkDialog id={Number(link.id)} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
