import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSans = Google_Sans({
  variable: "--google-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "SakayDavao",
  description: "Davao City Iternim Bus Route Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${googleSans.className} ${geistMono.variable}  ${geistSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
