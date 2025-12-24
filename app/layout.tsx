import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Novus Invoice Platform",
    default: "Novus Invoice Platform",
  },
  description:
    "A premium invoice management platform for freelancers and small businesses. Create, manage, and track invoices with ease.",
  keywords: [
    "invoice",
    "billing",
    "management",
    "saas",
    "freelancer",
    "business",
    "accounting",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://novus-invoice.com",
    siteName: "Novus Invoice Platform",
    title: "Novus Invoice Platform",
    description:
      "A premium invoice management platform for freelancers and small businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Novus Invoice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Novus Invoice Platform",
    description:
      "A premium invoice management platform for freelancers and small businesses.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
