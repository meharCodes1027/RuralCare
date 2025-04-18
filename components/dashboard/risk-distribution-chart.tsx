"use client"

import { useEffect, useRef } from "react"

export function RiskDistributionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Chart data
    const data = {
      labels: ["Low Risk", "Moderate Risk", "High Risk"],
      values: [65, 23, 12],
      colors: ["#22c55e", "#f59e0b", "#ef4444"],
    }

    // Chart dimensions
    const chartWidth = rect.width
    const chartHeight = rect.height
    const barWidth = chartWidth / 4
    const spacing = barWidth / 2
    const startX = chartWidth / 8

    // Draw bars
    data.values.forEach((value, index) => {
      const barHeight = (value / 100) * (chartHeight - 60)
      const x = startX + index * (barWidth + spacing)
      const y = chartHeight - barHeight - 30

      // Draw bar
      ctx.fillStyle = data.colors[index]
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, 4)
      ctx.fill()

      // Draw value on top of bar
      ctx.fillStyle = "#64748b"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${value}%`, x + barWidth / 2, y - 10)

      // Draw label below bar
      ctx.fillStyle = "#64748b"
      ctx.font = "12px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(data.labels[index], x + barWidth / 2, chartHeight - 10)
    })

    // Draw title
    ctx.fillStyle = "#334155"
    ctx.font = "14px Inter, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Patient Risk Distribution", 10, 20)
  }, [])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
