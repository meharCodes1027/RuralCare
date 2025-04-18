"use client"

import { BarChart, Calendar, LineChart, Users } from "lucide-react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/components/i18n/language-provider"
import { useFirebase } from "@/components/firebase/firebase-provider"
import { useState, useEffect } from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MotionCard, MotionDiv, MotionList, MotionListItem, MotionText } from "@/components/ui/motion"
import { VaccineStockStatus } from "@/components/dashboard/vaccine-stock-status"

// Mock data for dashboard
const patientVisitsData = [
  { name: "Jan", visits: 30 },
  { name: "Feb", visits: 42 },
  { name: "Mar", visits: 38 },
  { name: "Apr", visits: 45 },
  { name: "May", visits: 52 },
  { name: "Jun", visits: 48 },
  { name: "Jul", visits: 60 },
  { name: "Aug", visits: 68 },
  { name: "Sep", visits: 72 },
  { name: "Oct", visits: 65 },
  { name: "Nov", visits: 58 },
  { name: "Dec", visits: 52 },
]

const vaccineData = [
  { name: "Jan", forecasted: 120, actual: 118 },
  { name: "Feb", forecasted: 130, actual: 132 },
  { name: "Mar", forecasted: 125, actual: 120 },
  { name: "Apr", forecasted: 140, actual: 135 },
  { name: "May", forecasted: 155, actual: 152 },
  { name: "Jun", forecasted: 165, actual: 168 },
  { name: "Jul", forecasted: 180, actual: 175 },
  { name: "Aug", forecasted: 185, actual: 188 },
  { name: "Sep", forecasted: 175, actual: 172 },
  { name: "Oct", forecasted: 165, actual: 162 },
  { name: "Nov", forecasted: 155, actual: 158 },
  { name: "Dec", forecasted: 150, actual: 147 },
]

const patientRiskData = [
  { name: "High Risk", value: 28, color: "#ef4444" },
  { name: "Medium Risk", value: 45, color: "#f59e0b" },
  { name: "Low Risk", value: 120, color: "#22c55e" },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const { userData } = useFirebase()
  const [mounted, setMounted] = useState(false)
  const [chartData, setChartData] = useState<{
    patientVisits: typeof patientVisitsData;
    vaccine: typeof vaccineData;
    risk: typeof patientRiskData;
  }>({
    patientVisits: [],
    vaccine: [],
    risk: []
  })

  // Animate the data loading
  useEffect(() => {
    setMounted(true)
    
    // Animate chart data
    const timer1 = setTimeout(() => {
      setChartData(prev => ({ ...prev, patientVisits: patientVisitsData }))
    }, 300)
    
    const timer2 = setTimeout(() => {
      setChartData(prev => ({ ...prev, risk: patientRiskData }))
    }, 600)
    
    const timer3 = setTimeout(() => {
      setChartData(prev => ({ ...prev, vaccine: vaccineData }))
    }, 900)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const totalPatients = 193
  const appointmentsToday = 14
  const patientReferrals = 7
  const vaccineStock = 86

  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!mounted) return
      
      let startTime: number
      let requestId: number
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        
        if (progress < 1) {
          requestId = requestAnimationFrame(step)
        }
      }
      
      requestId = requestAnimationFrame(step)
      return () => cancelAnimationFrame(requestId)
    }, [end, duration, mounted])
    
    return count
  }
  
  const animatedTotalPatients = useCounter(totalPatients)
  const animatedAppointments = useCounter(appointmentsToday)
  const animatedReferrals = useCounter(patientReferrals)
  const animatedVaccineStock = useCounter(vaccineStock)

  if (!mounted) {
    return null
  }

  return (
    <MotionDiv variant="fadeIn" className="space-y-6">
      <div>
        <MotionText 
          className="text-2xl font-bold tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome back, {userData.user?.displayName || "Doctor"}
        </MotionText>
        <MotionText 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Here's an overview of RuralCare AI analytics and resources for {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </MotionText>
      </div>

      <MotionList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
        <MotionListItem>
          <MotionCard 
            className="group hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <MotionDiv
                whileHover={{ rotate: 15, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-muted-foreground group-hover:text-primary transition-colors duration-300"
              >
                <Users className="h-4 w-4" />
              </MotionDiv>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animatedTotalPatients}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </MotionCard>
        </MotionListItem>
        
        <MotionListItem>
          <MotionCard 
            className="group hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
              <MotionDiv
                whileHover={{ rotate: 15, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-muted-foreground group-hover:text-primary transition-colors duration-300"
              >
                <Calendar className="h-4 w-4" />
              </MotionDiv>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animatedAppointments}</div>
              <p className="text-xs text-muted-foreground">3 high priority cases</p>
            </CardContent>
          </MotionCard>
        </MotionListItem>
        
        <MotionListItem>
          <MotionCard 
            className="group hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Referred</CardTitle>
              <MotionDiv
                whileHover={{ rotate: 15, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-muted-foreground group-hover:text-primary transition-colors duration-300"
              >
                <BarChart className="h-4 w-4" />
              </MotionDiv>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animatedReferrals}</div>
              <p className="text-xs text-muted-foreground">5 urgent referrals this week</p>
            </CardContent>
          </MotionCard>
        </MotionListItem>
        
        <MotionListItem>
          <MotionCard 
            className="group hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vaccine Stock</CardTitle>
              <MotionDiv
                whileHover={{ rotate: 15, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-muted-foreground group-hover:text-primary transition-colors duration-300"
              >
                <LineChart className="h-4 w-4" />
              </MotionDiv>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animatedVaccineStock}%</div>
              <p className="text-xs text-muted-foreground">Reorder recommended in 2 weeks</p>
            </CardContent>
          </MotionCard>
        </MotionListItem>
      </MotionList>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MotionDiv 
          className="md:col-span-2 lg:col-span-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MotionCard 
            className="h-full transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <CardHeader>
              <CardTitle>Monthly Patient Visits</CardTitle>
              <CardDescription>Total patient visits across all rural health centers.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData.patientVisits}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="visits" 
                    fill="#8884d8" 
                    animationDuration={1500}
                    animationBegin={300}
                    animationEasing="ease-out"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </MotionDiv>
        
        <MotionDiv 
          className="md:col-span-2 lg:col-span-3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MotionCard 
            className="h-full transition-all duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <CardHeader>
              <CardTitle>Patient Risk Distribution</CardTitle>
              <CardDescription>Risk level assessment based on patient data.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Pie
                    data={chartData.risk}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => entry.name}
                    animationDuration={1000}
                    animationBegin={300}
                  >
                    {patientRiskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </MotionCard>
        </MotionDiv>
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <MotionCard 
          className="transition-all duration-300"
          whileHover={{ scale: 1.01 }}
        >
          <CardHeader>
            <CardTitle>Vaccine Stock Forecast vs Actual Usage</CardTitle>
            <CardDescription>Comparing predicted vaccine needs with actual administration.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart 
                data={chartData.vaccine} 
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="forecasted" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                  animationDuration={1500}
                  animationBegin={500}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#82ca9d" 
                  animationDuration={1500}
                  animationBegin={800}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </MotionCard>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <MotionCard 
          className="transition-all duration-300"
          whileHover={{ scale: 1.01 }}
        >
          <CardHeader>
            <CardTitle>Vaccine Stock Status</CardTitle>
            <CardDescription>Current inventory levels and alerts for critical vaccines.</CardDescription>
          </CardHeader>
          <CardContent>
            <VaccineStockStatus showDetails={true} />
          </CardContent>
        </MotionCard>
      </MotionDiv>
    </MotionDiv>
  )
}
