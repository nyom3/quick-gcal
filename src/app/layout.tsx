import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { PWARegister } from "@/components/PWARegister";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PWAInstallGuide } from "@/components/PWAInstallGuide";
import { PWAInstallButton } from "@/components/PWAInstallButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quick GCal",
  description: "Quickly add events to Google Calendar",
  themeColor: "#0ea5e9",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quick GCal",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <PWARegister />
        <InstallPrompt />
        <PWAInstallButton />
        <PWAInstallGuide />
      </body>
    </html>
  );
}
