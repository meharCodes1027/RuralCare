// "use client" directive to enable client-side rendering in Next.js 13+ components
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { useFirebase } from "@/components/firebase/firebase-provider"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const { userData } = useFirebase()

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
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
