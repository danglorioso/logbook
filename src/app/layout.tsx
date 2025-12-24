import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { FlightDialogProvider } from "@/contexts/FlightDialogContext";
import { FlightDialogWrapper } from "@/components/FlightDialogWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logbook - Flight Simulator Logging",
  description: "Track and share your flight simulator adventures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <FlightDialogProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <FlightDialogWrapper />
            <Analytics />
          </body>
        </html>
      </FlightDialogProvider>
    </ClerkProvider>
  );
}
