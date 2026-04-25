import type { Metadata } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const unbounded = Unbounded({
  variable: "--font-wrapped",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tax Wrapped India",
  description:
    "A privacy-first wrapped experience for understanding where your Indian income tax is allocated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-black text-[#0a0a0a]">
        {children}
      </body>
    </html>
  );
}
