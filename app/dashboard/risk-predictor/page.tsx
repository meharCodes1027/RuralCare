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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, HelpCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from "@/components/i18n/language-provider"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z
    .string()
    .refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0 && Number.parseInt(val) < 120, {
      message: "Age must be a valid number between 1 and 120.",
    }),
  gender: z.string().min(1, { message: "Please select a gender." }),
  bloodPressureSystolic: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
    message: "Please enter a valid systolic blood pressure.",
  }),
  bloodPressureDiastolic: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
    message: "Please enter a valid diastolic blood pressure.",
  }),
  heartRate: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
    message: "Please enter a valid heart rate.",
  }),
  temperature: z
    .string()
    .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 30 && Number.parseFloat(val) < 45, {
      message: "Please enter a valid temperature between 30°C and 45°C.",
    }),
  symptoms: z.array(z.string()).optional(),
  comorbidities: z.array(z.string()).optional(),
})

const symptoms = [
  { id: "fever", label: "Fever" },
  { id: "cough", label: "Cough" },
  { id: "shortness-of-breath", label: "Shortness of Breath" },
  { id: "fatigue", label: "Fatigue" },
  { id: "headache", label: "Headache" },
  { id: "chest-pain", label: "Chest Pain" },
  { id: "dizziness", label: "Dizziness" },
  { id: "nausea", label: "Nausea" },
]

const comorbidities = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "heart-disease", label: "Heart Disease" },
  { id: "lung-disease", label: "Lung Disease" },
  { id: "kidney-disease", label: "Kidney Disease" },
  { id: "liver-disease", label: "Liver Disease" },
  { id: "cancer", label: "Cancer" },
  { id: "immunocompromised", label: "Immunocompromised" },
]

export default function RiskPredictorPage() {
  const { t } = useTranslation()
  const [result, setResult] = useState<null | {
    riskLevel: "Low" | "Moderate" | "High"
    score: number
    recommendation: string
    details: string[]
  }>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      bloodPressureSystolic: "",
      bloodPressureDiastolic: "",
      heartRate: "",
      temperature: "",
      symptoms: [],
      comorbidities: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simple risk calculation algorithm for demo purposes
    const age = Number.parseInt(values.age)
    const systolic = Number.parseInt(values.bloodPressureSystolic)
    const diastolic = Number.parseInt(values.bloodPressureDiastolic)
    const heartRate = Number.parseInt(values.heartRate)
    const temperature = Number.parseFloat(values.temperature)

    let riskScore = 0

    // Age risk
    if (age > 65) riskScore += 2
    else if (age > 50) riskScore += 1

    // Blood pressure risk
    if (systolic > 160 || diastolic > 100) riskScore += 3
    else if (systolic > 140 || diastolic > 90) riskScore += 2

    // Heart rate risk
    if (heartRate > 100) riskScore += 1

    // Temperature risk
    if (temperature > 38.5) riskScore += 2
    else if (temperature > 37.5) riskScore += 1

    // Symptoms risk
    if (values.symptoms) {
      if (values.symptoms.includes("chest-pain")) riskScore += 3
      if (values.symptoms.includes("shortness-of-breath")) riskScore += 2
      riskScore += values.symptoms.length * 0.5
    }

    // Comorbidities risk
    if (values.comorbidities) {
      if (values.comorbidities.includes("heart-disease")) riskScore += 3
      if (values.comorbidities.includes("diabetes")) riskScore += 2
      if (values.comorbidities.includes("hypertension")) riskScore += 2
      riskScore += values.comorbidities.length * 0.5
    }

    // Determine risk level
    let riskLevel: "Low" | "Moderate" | "High" = "Low"
    let recommendation = ""
    let details: string[] = []

    if (riskScore >= 8) {
      riskLevel = "High"
      recommendation = "Refer to district hospital immediately"
      details = [
        "Patient has multiple high-risk factors",
        "Requires immediate medical attention",
        "Consider emergency transport if available",
        "Prepare patient file for transfer",
      ]
    } else if (riskScore >= 4) {
      riskLevel = "Moderate"
      recommendation = "Monitor closely and consider referral if symptoms worsen"
      details = [
        "Regular monitoring required",
        "Check vitals every 4 hours",
        "Re-evaluate in 24 hours",
        "Prepare for possible referral",
      ]
    } else {
      riskLevel = "Low"
      recommendation = "Treat locally with standard protocols"
      details = [
        "Follow standard treatment guidelines",
        "Schedule follow-up in 3-5 days",
        "Educate patient on warning signs",
        "Document in local health records",
      ]
    }

    setResult({
      riskLevel,
      score: Math.min(Math.round(riskScore * 10) / 10, 10),
      recommendation,
      details,
    })
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "destructive"
      case "moderate":
        return "warning"
      case "low":
        return "success"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">{t("risk.title")}</h2>
        <p className="text-muted-foreground">{t("risk.description")}</p>
      </div>

      <Tabs defaultValue="input" className="space-y-4">
        <TabsList>
          <TabsTrigger value="input">Patient Input</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Enter the patient's details to calculate their risk level.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter patient name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 grid-cols-2">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input placeholder="Years" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Vital Signs</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="grid gap-4 grid-cols-2">
                        <FormField
                          control={form.control}
                          name="bloodPressureSystolic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                Systolic BP
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>The top number in blood pressure reading (mmHg)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="mmHg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bloodPressureDiastolic"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-1">
                                Diastolic BP
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>The bottom number in blood pressure reading (mmHg)</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="mmHg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 grid-cols-2">
                        <FormField
                          control={form.control}
                          name="heartRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Heart Rate</FormLabel>
                              <FormControl>
                                <Input placeholder="BPM" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="temperature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Temperature</FormLabel>
                              <FormControl>
                                <Input placeholder="°C" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="symptoms"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Symptoms</FormLabel>
                            <FormDescription>Select all symptoms that apply.</FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {symptoms.map((symptom) => (
                              <FormField
                                key={symptom.id}
                                control={form.control}
                                name="symptoms"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={symptom.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(symptom.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), symptom.id])
                                              : field.onChange(field.value?.filter((value) => value !== symptom.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{symptom.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comorbidities"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Comorbidities</FormLabel>
                            <FormDescription>Select all pre-existing conditions.</FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {comorbidities.map((condition) => (
                              <FormField
                                key={condition.id}
                                control={form.control}
                                name="comorbidities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={condition.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(condition.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), condition.id])
                                              : field.onChange(field.value?.filter((value) => value !== condition.id))
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">{condition.label}</FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Calculate Risk
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
                    <span>Risk Assessment</span>
                    <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="ml-2">
                      {result.riskLevel} Risk
                    </Badge>
                  </CardTitle>
                  <CardDescription>Based on the provided patient information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risk Score:</span>
                    <span className="text-sm">{result.score}/10</span>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        result.riskLevel === "High"
                          ? "bg-destructive"
                          : result.riskLevel === "Moderate"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${result.score * 10}%` }}
                    ></div>
                  </div>

                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-2">Recommendation:</h4>
                    <p className="text-sm">{result.recommendation}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Action Plan</CardTitle>
                  <CardDescription>Suggested next steps for this patient</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Assessment</Button>
                  <Button>Print Report</Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
