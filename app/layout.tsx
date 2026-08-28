import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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

const description =
  "Muhammad Haashid is an engineering student, technical builder, hackathon winner, and community leader working across AI, blockchain, IoT, cybersecurity, and full-stack systems.";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "Muhammad Haashid - AI, Blockchain & IoT Engineer",
  description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Muhammad Haashid - AI, Blockchain & IoT Engineer",
    description,
    url: "/",
    siteName: "Muhammad Haashid Portfolio",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Muhammad Haashid portfolio social preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Haashid - AI, Blockchain & IoT Engineer",
    description,
    images: ["/og-image.svg"]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
