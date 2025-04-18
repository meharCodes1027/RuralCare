"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowRight, Calendar, CheckCircle, TrendingDown } from "lucide-react"
import { useTranslation } from "@/components/i18n/language-provider"

const formSchema = z.object({
  vaccineType: z.string().min(1, { message: "Please select a vaccine type." }),
  currentStock: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) >= 0, {
    message: "Please enter a valid current stock amount.",
  }),
  capacity: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
    message: "Please enter a valid capacity.",
  }),
  dailyUsage: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) >= 0, {
    message: "Please enter a valid daily usage amount.",
  }),
  leadTime: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) >= 0, {
    message: "Please enter a valid lead time in days.",
  }),
})

// Mock vaccine types
const vaccineTypes = [
  { id: "covid", label: "COVID-19 Vaccine" },
  { id: "polio", label: "Polio Vaccine" },
  { id: "measles", label: "Measles Vaccine" },
  { id: "tetanus", label: "Tetanus Vaccine" },
  { id: "hepb", label: "Hepatitis B Vaccine" },
  { id: "bcg", label: "BCG Vaccine" },
]

export default function VaccineForecastPage() {
  const { t } = useTranslation()
  const [result, setResult] = useState<null | {
    daysRemaining: number
    status: "Critical" | "Warning" | "Sufficient"
    reorderDate: string
    wastageRate: number
    recommendations: string[]
  }>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vaccineType: "",
      currentStock: "",
      capacity: "",
      dailyUsage: "",
      leadTime: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const currentStock = Number.parseInt(values.currentStock)
    const dailyUsage = Number.parseInt(values.dailyUsage)
    const leadTime = Number.parseInt(values.leadTime)

    // Calculate days remaining
    const daysRemaining = Math.floor(currentStock / dailyUsage)

    // Determine status
    let status: "Critical" | "Warning" | "Sufficient"
    if (daysRemaining <= leadTime) {
      status = "Critical"
    } else if (daysRemaining <= leadTime * 2) {
      status = "Warning"
    } else {
      status = "Sufficient"
    }

    // Calculate reorder date
    const reorderDate = new Date()
    reorderDate.setDate(reorderDate.getDate() + Math.max(0, daysRemaining - leadTime))

    // Mock wastage rate (random between 5-15%)
    const wastageRate = Math.round((Math.random() * 10 + 5) * 10) / 10

    // Generate recommendations
    const recommendations = []

    if (status === "Critical") {
      recommendations.push("Place order immediately to avoid stockout")
      recommendations.push("Consider borrowing from nearby facilities if possible")
      recommendations.push("Prioritize high-risk patients until new stock arrives")
    } else if (status === "Warning") {
      recommendations.push(`Place order by ${reorderDate.toLocaleDateString()}`)
      recommendations.push("Review usage patterns to optimize stock levels")
      recommendations.push("Check nearby facilities for potential sharing")
    } else {
      recommendations.push(`Schedule reorder for ${reorderDate.toLocaleDateString()}`)
      recommendations.push("Current stock levels are optimal")
      recommendations.push("Monitor for any unusual increase in demand")
    }

    // Add wastage recommendation
    if (wastageRate > 10) {
      recommendations.push("Implement wastage reduction measures")
    }

    setResult({
      daysRemaining,
      status,
      reorderDate: reorderDate.toLocaleDateString(),
      wastageRate,
      recommendations,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "destructive"
      case "Warning":
        return "warning"
      case "Sufficient":
        return "success"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{t("vaccine.title")}</h2>
        <p className="text-muted-foreground">{t("vaccine.description")}</p>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList>
          <TabsTrigger value="input">Stock Input</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>
            Forecast Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Vaccine Stock Information</CardTitle>
              <CardDescription>Enter current stock levels and usage patterns to forecast depletion.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="vaccineType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vaccine Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vaccine type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vaccineTypes.map((vaccine) => (
                                <SelectItem key={vaccine.id} value={vaccine.id}>
                                  {vaccine.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock (doses)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 500" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Capacity (doses)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dailyUsage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Daily Usage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 20" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="leadTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Lead Time (days)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 14" {...field} />
                          </FormControl>
                          <FormDescription>Days needed for new stock to arrive</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Generate Forecast
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {result && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Stock Forecast</span>
                    <Badge variant={getStatusColor(result.status)}>{result.status}</Badge>
                  </CardTitle>
                  <CardDescription>Based on current stock and usage patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Days Remaining:</span>
                    <span className="text-sm font-bold">{result.daysRemaining} days</span>
                  </div>

                  <Progress
                    value={Math.min(result.daysRemaining * 2, 100)}
                    className={`h-2 ${
                      result.status === "Critical"
                        ? "bg-red-100"
                        : result.status === "Warning"
                          ? "bg-yellow-100"
                          : "bg-green-100"
                    }`}
                  />

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Recommended Reorder Date:</span>
                      </div>
                      <span className="text-sm font-medium">{result.reorderDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Estimated Wastage Rate:</span>
                      </div>
                      <span className="text-sm font-medium">{result.wastageRate}%</span>
                    </div>
                  </div>

                  {result.status === "Critical" && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Critical Stock Level</AlertTitle>
                      <AlertDescription>
                        Stock will be depleted before new supplies can arrive. Immediate action required.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Suggested actions based on forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Forecast</Button>
                  <Button>Place Order</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
