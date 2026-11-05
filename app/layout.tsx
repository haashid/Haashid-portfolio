import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getActiveTheme, getSiteSettings } from "@/lib/public-data";
import { getThemeMarkup } from "@/lib/theme-tokens";
import "./globals.css";

// Public metadata and the active theme are read from Prisma at request time.
// Avoid baking CMS state into the build output.
export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap"
});

const defaultDescription =
  "Muhammad Haashid is an engineering student, technical builder, hackathon winner, and community leader working across AI, blockchain, IoT, cybersecurity, and full-stack systems.";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings();
    const title = settings?.siteTitle || "Muhammad Haashid - AI, Blockchain & IoT Engineer";
    const description = settings?.metaDescription || defaultDescription;
    const ogTitle = settings?.ogTitle || title;
    const ogDescription = settings?.ogDescription || description;
    const ogImage = settings?.ogImageUrl || "/haashid-avatar.png";

    return {
      metadataBase: new URL(settings?.canonicalUrl || "https://haashid.vercel.app"),
      title,
      description,
      alternates: {
        canonical: "/"
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: "/",
        siteName: title,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${title} social preview`
          }
        ],
        locale: "en_US",
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description: ogDescription,
        images: [ogImage]
      },
      icons: {
        icon: settings?.faviconUrl || "/favicon.svg"
      }
    };
  } catch {
    return {
      title: "Muhammad Haashid - AI, Blockchain & IoT Engineer",
      description: defaultDescription,
    };
  }
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  let themeMarkup = getThemeMarkup(null);
  try {
    themeMarkup = getThemeMarkup(await getActiveTheme());
  } catch {
    // Keep default theme
  }

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} data-theme={themeMarkup.colorScheme} data-animations={themeMarkup.animations ? "true" : "false"}>
      <head><style dangerouslySetInnerHTML={{ __html: themeMarkup.css }} /></head>
      <body>{children}</body>
    </html>
  );
}
