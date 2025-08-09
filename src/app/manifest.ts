import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const m: any = {
    id: "/",
    scope: "/",
    name: "Quick GCal",
    short_name: "QuickGCal",
    description: "Quickly add events to Google Calendar",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0ea5e9",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ],
    screenshots: [
      {
        src: "/screenshots/narrow.png",
        sizes: "720x1280",
        type: "image/png",
        form_factor: "narrow",
        label: "Main view (mobile)",
      },
      {
        src: "/screenshots/wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Main view (wide)",
      },
    ],
  };
  return m as MetadataRoute.Manifest;
}
