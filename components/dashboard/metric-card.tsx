import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"

interface DashboardMetricCardProps {
  title: string
  value: string
  description: string
  icon?: React.ReactNode
  trend?: "up" | "down"
}

export function DashboardMetricCard({ title, value, description, icon, trend }: DashboardMetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center mt-1">
          {trend && (
            <>
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-4 w-4 text-destructive" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-green-500" />
              )}
            </>
          )}
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
