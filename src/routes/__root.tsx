import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import { AccountContext } from '@/lib/auth-context';
import type { User } from '@supabase/supabase-js';
import appCss from "../styles.css?url";
import { PRODUCTION_SITE_URL } from "../lib/site-url";

const searchVerification = import.meta.env["VITE_GOOGLE_SITE_VERIFICATION"]?.trim();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Carbon Credit | Agricultural Carbon & MRV" },
      { name: "description", content: "Making agricultural climate impact measurable, verifiable and valuable. Field evidence and MRV for agricultural carbon projects in Punjab, India." },
      { property: "og:title", content: "The Carbon Credit | Agricultural Carbon & MRV" },
      { property: "og:description", content: "Making agricultural climate impact measurable, verifiable and valuable." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "The Carbon Credit" },
      { property: "og:url", content: `${PRODUCTION_SITE_URL}/` },
      { property: "og:image", content: `${PRODUCTION_SITE_URL}/social-card.jpg` },
      { property: "og:image:alt", content: "The Carbon Credit — agricultural evidence and MRV" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Carbon Credit | Agricultural Carbon & MRV" },
      { name: "twitter:description", content: "Making agricultural climate impact measurable, verifiable and valuable." },
      { name: "twitter:image", content: `${PRODUCTION_SITE_URL}/social-card.jpg` },
      ...(searchVerification ? [{ name: "google-site-verification", content: searchVerification }] : []),
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Punjabi:wght@400;600&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/brand/tcc-favicon.png", type: "image/png", sizes: "64x64" },
      { rel: "apple-touch-icon", href: "/brand/tcc-favicon.png", sizes: "64x64" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const account: User | null = null;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <AccountContext.Provider value={account}><Outlet /></AccountContext.Provider>
    </QueryClientProvider>
  );
}
