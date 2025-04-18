"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, BarChart3, Home, Map, Settings, Syringe, User, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useFirebase } from "@/components/firebase/firebase-provider"
import { useTranslation } from "@/components/i18n/language-provider"
import { LanguageSelector } from "@/components/language-selector"

export function AppSidebar() {
  const pathname = usePathname()
  const { userData, signOut } = useFirebase()
  const { t } = useTranslation()
  const [userName, setUserName] = useState<string>("Dr. Meera Patel")

  useEffect(() => {
    // In a real app, you would fetch user profile from Firestore
    if (userData.user) {
      const displayName = userData.user.displayName || userData.user.email?.split("@")[0] || "User"
      setUserName(displayName)
    }
  }, [userData.user])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">{t("app.title")}</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{t("app.subtitle")}</p>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <Home />
                <span>{t("dashboard.home")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/patients")}>
              <Link href="/dashboard/patients">
                <Users />
                <span>{t("dashboard.patients")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/risk-predictor")}>
              <Link href="/dashboard/risk-predictor">
                <Activity />
                <span>{t("dashboard.risk")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/vaccine")}>
              <Link href="/dashboard/vaccine">
                <Syringe />
                <span>{t("dashboard.vaccine")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/map")}>
              <Link href="/dashboard/map">
                <Map />
                <span>{t("dashboard.map")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/analytics")}>
              <Link href="/dashboard/analytics">
                <BarChart3 />
                <span>{t("dashboard.analytics")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {userData.role === "doctor" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                <Link href="/dashboard/settings">
                  <Settings />
                  <span>{t("dashboard.settings")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userData.role?.replace("_", " ") || "User"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ModeToggle />
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={signOut}>
          {t("dashboard.logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
