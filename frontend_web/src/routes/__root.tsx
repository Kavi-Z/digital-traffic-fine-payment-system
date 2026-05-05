import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { LanguageProvider } from "@/contexts/LanguageContext"; // <-- ADD THIS IMPORT
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-noise">
      <div className="ornate-card p-12 text-center max-w-md">
        <h1 className="text-7xl font-display gold-gradient-text">404</h1>
        <p className="mt-4 text-cream">This page is not on file.</p>
        <Link to="/" className="metallic-btn inline-block mt-6">Return Home</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sri Lanka Police — Traffic Fine Management System" },
      { name: "description", content: "Official traffic fine payment & monitoring portal of the Sri Lanka Police Department." },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  // <-- WRAP THE OUTLET IN THE PROVIDER HERE
  component: () => (
    <LanguageProvider>
      <Outlet />
    </LanguageProvider>
  ),
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}