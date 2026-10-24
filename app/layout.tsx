import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { connection } from "next/server";
import { Suspense } from "react";
import { db } from "@/lib/db";
import type { SiteList } from "@/lib/types";
import "./globals.css";

import { NavLink } from "@/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wikia Tracker",
};

async function SiteNav() {
  await connection();

  const sites: SiteList[] = await db<SiteList>("site").select("id", "name");

  if (!sites || sites.length === 0) {
    return null;
  }

  return (
    <nav className="flex flex-col gap-2">
      {sites.map((site) => (
        <NavLink
          key={site.id}
          href={`/site/${site.id}`}
        >
          {site.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <div className="w-50 bg-lime-300">
          <Suspense fallback={null}>
            <SiteNav />
          </Suspense>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
