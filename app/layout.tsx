import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sahyadri Guardian - Trekking Safety Map",
  description: "Real-time safety map for trekkers in the Western Ghats around Pune",
  manifest: "/manifest.json",
  generator: 'v0.dev'
  // themeColor and viewport moved to generateViewport below
}

// Funky, attractive theme color and viewport settings
export function generateViewport() {
  return {
    themeColor: "#ff00cc", // Neon pink for a funky look
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`}
        />
        <link rel="manifest" href="/manifest.json" />
        {/* Removed <meta name="theme-color" ...> as it's now handled by generateViewport */}
      </head>
      <body className={inter.className} style={{ background: "linear-gradient(135deg, #ff00cc 0%, #333399 100%)" }}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
