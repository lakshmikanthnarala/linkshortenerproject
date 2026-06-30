import {
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, Link2, ShieldCheck, Zap } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Link2,
    title: "Instant short links",
    description:
      "Turn long URLs into clean, memorable links in seconds for every campaign and share.",
  },
  {
    icon: ShieldCheck,
    title: "Protected by Clerk",
    description:
      "Keep your workspace secure with polished sign-in and sign-up flows built in.",
  },
  {
    icon: Zap,
    title: "Fast, focused workflow",
    description:
      "Create, manage, and launch your links from a clean dashboard without any clutter.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_45%),linear-gradient(135deg,_#fafafa_0%,_#f4f4f5_100%)] font-sans text-zinc-950 dark:bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.24),_transparent_40%),linear-gradient(135deg,_#09090b_0%,_#18181b_100%)] dark:text-zinc-50">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div>
          <p className="text-lg font-semibold">LinkShortener</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Short links, simplified.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userId ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Get started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8 lg:py-16">
        <div className="w-full max-w-7xl rounded-[2rem] border border-zinc-200/80 bg-white/80 p-8 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.4)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
                New • Smarter link sharing for modern teams
              </div>
              <h1 className="mt-6 text-4xl font-semibold sm:text-5xl lg:text-6xl">
                Turn long URLs into polished links your audience will love.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                LinkShortener helps you create concise, shareable links with a clean experience that feels fast from the first click.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <SignUpButton mode="modal">
                  <Button size="lg" className="gap-2">
                    Create your account
                    <ArrowRight className="size-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" size="lg">
                    Sign in
                  </Button>
                </SignInButton>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
                  Secure auth
                </span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
                  Modern dashboard
                </span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-900">
                  Built for sharing
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/70">
              <p className="text-sm font-medium uppercase text-zinc-500 dark:text-zinc-400">
                Why teams use it
              </p>
              <div className="mt-6 space-y-4">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-violet-100 p-2 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <h2 className="font-semibold">{feature.title}</h2>
                          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
