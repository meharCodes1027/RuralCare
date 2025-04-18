"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, TrendingDown, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const patientTrendsRef = useRef<HTMLCanvasElement>(null)
  const vaccineUsageRef = useRef<HTMLCanvasElement>(null)
  const referralStatsRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (patientTrendsRef.current) {
      const ctx = patientTrendsRef.current.getContext("2d")
      if (ctx) {
        drawPatientTrendsChart(ctx)
      }
    }

    if (vaccineUsageRef.current) {
      const ctx = vaccineUsageRef.current.getContext("2d")
      if (ctx) {
        drawVaccineUsageChart(ctx)
      }
    }

    if (referralStatsRef.current) {
      const ctx = referralStatsRef.current.getContext("2d")
      if (ctx) {
        drawReferralStatsChart(ctx)
      }
    }
  }, [])

  const drawPatientTrendsChart = (ctx: CanvasRenderingContext2D) => {
    // Set canvas dimensions with device pixel ratio for sharp rendering
    const canvas = ctx.canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Chart data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const highRiskData = [12, 15, 18, 22, 19, 32]
    const moderateRiskData = [28, 32, 35, 30, 28, 23]
    const lowRiskData = [45, 50, 48, 52, 55, 65]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const padding = 40
    const graphWidth = chartWidth - padding * 2
    const graphHeight = chartHeight - padding * 2

    // Draw axes
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight - padding)
    ctx.lineTo(chartWidth - padding, chartHeight - padding)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, chartHeight - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + i * (graphHeight / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(chartWidth - padding, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = "#64748b"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(`${100 - i * 20}`, padding - 10, y)
    }

    // Draw data lines
    const drawLine = (data: number[], color: string) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((value, index) => {
        const x = padding + index * (graphWidth / (months.length - 1))
        const y = chartHeight - padding - (value / 100) * graphHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      data.forEach((value, index) => {
        const x = padding + index * (graphWidth / (months.length - 1))
        const y = chartHeight - padding - (value / 100) * graphHeight

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw X-axis labels
    months.forEach((month, index) => {
      const x = padding + index * (graphWidth / (months.length - 1))

      ctx.fillStyle = "#64748b"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(month, x, chartHeight - padding + 10)
    })

    // Draw data lines
    drawLine(highRiskData, "#ef4444")
    drawLine(moderateRiskData, "#f59e0b")
    drawLine(lowRiskData, "#22c55e")

    // Draw legend
    const legendX = padding
    const legendY = padding - 15

    // High risk
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.arc(legendX, legendY, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#334155"
    ctx.font = "10px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("High Risk", legendX + 10, legendY)

    // Moderate risk
    ctx.fillStyle = "#f59e0b"
    ctx.beginPath()
    ctx.arc(legendX + 80, legendY, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#334155"
    ctx.fillText("Moderate Risk", legendX + 90, legendY)

    // Low risk
    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.arc(legendX + 180, legendY, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#334155"
    ctx.fillText("Low Risk", legendX + 190, legendY)
  }

  const drawVaccineUsageChart = (ctx: CanvasRenderingContext2D) => {
    // Set canvas dimensions with device pixel ratio for sharp rendering
    const canvas = ctx.canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Chart data
    const vaccines = ["COVID-19", "Polio", "Measles", "Tetanus", "Hep B"]
    const usageData = [85, 65, 45, 70, 55]
    const wastageData = [12, 8, 15, 10, 18]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const padding = 60
    const barPadding = 30
    const graphWidth = chartWidth - padding * 2
    const graphHeight = chartHeight - padding * 2
    const barWidth = graphWidth / vaccines.length - barPadding

    // Draw axes
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, chartHeight - padding)
    ctx.lineTo(chartWidth - padding, chartHeight - padding)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, chartHeight - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + i * (graphHeight / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(chartWidth - padding, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = "#64748b"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(`${100 - i * 20}%`, padding - 10, y)
    }

    // Draw bars
    vaccines.forEach((vaccine, index) => {
      const x = padding + index * (graphWidth / vaccines.length) + barPadding / 2

      // Usage bar
      const usageHeight = (usageData[index] / 100) * graphHeight
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.roundRect(x, chartHeight - padding - usageHeight, barWidth, usageHeight, 4)
      ctx.fill()

      // Wastage bar
      const wastageHeight = (wastageData[index] / 100) * graphHeight
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.roundRect(x + barWidth + 2, chartHeight - padding - wastageHeight, barWidth / 2, wastageHeight, 4)
      ctx.fill()

      // X-axis labels
      ctx.fillStyle = "#64748b"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "top"
      ctx.fillText(vaccine, x + barWidth / 2, chartHeight - padding + 10)
    })

    // Draw legend
    const legendX = padding
    const legendY = padding - 15

    // Usage
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.roundRect(legendX, legendY - 4, 12, 8, 2)
    ctx.fill()

    ctx.fillStyle = "#334155"
    ctx.font = "10px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Usage", legendX + 18, legendY)

    // Wastage
    ctx.fillStyle = "#ef4444"
    ctx.beginPath()
    ctx.roundRect(legendX + 80, legendY - 4, 12, 8, 2)
    ctx.fill()

    ctx.fillStyle = "#334155"
    ctx.fillText("Wastage", legendX + 98, legendY)
  }

  const drawReferralStatsChart = (ctx: CanvasRenderingContext2D) => {
    // Set canvas dimensions with device pixel ratio for sharp rendering
    const canvas = ctx.canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Chart data
    const data = [
      { label: "Treated Locally", value: 65, color: "#22c55e" },
      { label: "Referred to District", value: 25, color: "#f59e0b" },
      { label: "Emergency Transfer", value: 10, color: "#ef4444" },
    ]

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const centerX = chartWidth / 2
    const centerY = chartHeight / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw pie chart
    let startAngle = 0

    data.forEach((slice) => {
      const sliceAngle = (slice.value / 100) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      ctx.fillStyle = slice.color
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fill()

      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 1.2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      // Draw line
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
      ctx.lineTo(labelX, labelY)
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "#334155"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = midAngle < Math.PI ? "left" : "right"
      ctx.textBaseline = "middle"
      ctx.fillText(`${slice.label} (${slice.value}%)`, labelX + (midAngle < Math.PI ? 5 : -5), labelY)

      startAngle = endAngle
    })

    // Draw center circle (donut style)
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fill()

    // Draw center text
    ctx.fillStyle = "#334155"
    ctx.font = "bold 14px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Referral", centerX, centerY - 10)
    ctx.fillText("Statistics", centerX, centerY + 10)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Key metrics and trends for patient risk, vaccine usage, and referrals.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Patients</CardTitle>
            <TrendingUp className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+14% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vaccine Wastage</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">-3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patient Trends</TabsTrigger>
          <TabsTrigger value="vaccines">Vaccine Usage</TabsTrigger>
          <TabsTrigger value="referrals">Referral Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Risk Trends</CardTitle>
              <CardDescription>Number of patients by risk category over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <canvas ref={patientTrendsRef} className="w-full h-full"></canvas>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vaccines">
          <Card>
            <CardHeader>
              <CardTitle>Vaccine Usage & Wastage</CardTitle>
              <CardDescription>Comparison of vaccine utilization vs. wastage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <canvas ref={vaccineUsageRef} className="w-full h-full"></canvas>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle>Referral Statistics</CardTitle>
              <CardDescription>Distribution of patient treatment locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <canvas ref={referralStatsRef} className="w-full h-full"></canvas>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
