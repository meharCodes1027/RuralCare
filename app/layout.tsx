import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { FirebaseProvider } from "@/components/firebase/firebase-provider"
import { LanguageProvider } from "@/components/i18n/language-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RuralCare AI - Smart Risk & Resource Optimizer",
  description: "Healthcare dashboard for rural and Tier 2/3 city hospitals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <FirebaseProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </LanguageProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}


import './globals.css'