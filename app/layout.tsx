import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, Unbounded } from "next/font/google";
import { launchConfig } from "@/config/launch";
import "./globals.css";

// خط العناوين الحماسي المختار: Cairo Black 900
const displayFont = Cairo({
  variable: "--font-display",
  subsets: ["arabic"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const bodyFont = IBM_Plex_Sans_Arabic({
  variable: "--font-body",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const digitsFont = Unbounded({
  variable: "--font-digits",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#023A22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: launchConfig.meta.title,
  description: launchConfig.meta.description,
  metadataBase: new URL(launchConfig.meta.url),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/famex-logo.png",
  },
  openGraph: {
    title: launchConfig.meta.title,
    description: launchConfig.meta.description,
    url: launchConfig.meta.url,
    siteName: launchConfig.appName,
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
        alt: launchConfig.appName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: launchConfig.meta.title,
    description: launchConfig.meta.description,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${displayFont.variable} ${bodyFont.variable} ${digitsFont.variable}`}
    >
      <body className="bg-[#023A22] text-[#ABC8A3] antialiased selection:bg-[#F0E295] selection:text-[#023A22]">
        {children}
      </body>
    </html>
  );
}
