"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useFirebase } from "@/components/firebase/firebase-provider"
import { useTranslation } from "@/components/i18n/language-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { userData } = useFirebase()
  const { t } = useTranslation()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!userData.isLoading && !userData.user) {
      router.push("/login")
    }
  }, [userData, router])

  // Show nothing while checking authentication
  if (userData.isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!userData.user) {
    return null
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <SidebarInset className="p-0 flex flex-col w-full">
        <header className="border-b h-14 flex items-center px-4 sticky top-0 bg-background z-10">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-lg font-medium">
            {t("app.title")} {t("dashboard.home")}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">{children}</main>
      </SidebarInset>
    </div>
  )
}
