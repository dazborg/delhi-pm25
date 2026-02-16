import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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
    default: "Delhi Air Quality Analysis — PM2.5 Sources & Health Impact",
    template: "%s | Delhi Air Quality",
  },
  description:
    "Evidence-based analysis of PM2.5 air pollution in Delhi. Interactive source apportionment, health impact modelling, and systematic reviews for policymakers.",
  keywords: [
    "Delhi", "air pollution", "PM2.5", "source apportionment",
    "health impact", "air quality", "policy", "India",
  ],
  authors: [{ name: "Delhi Air Quality Analysis Project" }],
  openGraph: {
    title: "Delhi Air Quality Analysis",
    description:
      "Delhi breathes air 21× the WHO safety limit. Explore the sources, model interventions, and understand the health burden.",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
