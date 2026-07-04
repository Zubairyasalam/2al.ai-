import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { promises as fs } from "fs";
import path from "path";
import AnnaChatWidget from "@/components/AnnaChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2all.ai | AI Website Accessibility Platform",
  description: "Modern AI Accessibility SaaS Platform to scan, monitor, and auto-fix website accessibility issues.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let customCss = "";
  let customJs = "";
  let trackingScripts = "";

  try {
    const configPath = path.join(process.cwd(), "src/data/site-config.json");
    const data = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(data);
    customCss = config.customCss || "";
    customJs = config.customJs || "";
    trackingScripts = config.trackingScripts || "";
  } catch (err) {
    console.error("Failed to load injected custom scripts in RootLayout:", err);
  }

  return (
    <html lang="en" className="dark">
      <head>
        {/* Inject Custom CSS */}
        {customCss && <style dangerouslySetInnerHTML={{ __html: customCss }} />}
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Inject Tracking Scripts */}
        {trackingScripts && <div dangerouslySetInnerHTML={{ __html: trackingScripts }} style={{ display: "none" }} />}
        
        {children}

        {/* Anna chat widget — visible on every page */}
        <AnnaChatWidget />

        {/* Inject Custom JS before body end */}
        {customJs && <script dangerouslySetInnerHTML={{ __html: customJs }} />}
      </body>
    </html>
  );
}
