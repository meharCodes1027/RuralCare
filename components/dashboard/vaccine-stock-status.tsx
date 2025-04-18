"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useFirebase } from "@/components/firebase/firebase-provider"
import { collection, getDocs, query, limit, Firestore } from "firebase/firestore"
import { db } from "@/components/firebase/firebase-provider"
import Link from "next/link"

// Mock data for vaccine stocks (fallback)
const mockVaccineStocks = [
  {
    name: "COVID-19 Vaccine",
    currentStock: 85,
    totalCapacity: 100,
    daysRemaining: 42,
    status: "Sufficient",
  },
  {
    name: "Polio Vaccine",
    currentStock: 32,
    totalCapacity: 100,
    daysRemaining: 16,
    status: "Warning",
  },
  {
    name: "Measles Vaccine",
    currentStock: 12,
    totalCapacity: 100,
    daysRemaining: 6,
    status: "Critical",
  },
  {
    name: "Tetanus Vaccine",
    currentStock: 68,
    totalCapacity: 100,
    daysRemaining: 34,
    status: "Sufficient",
  },
]

interface VaccineStock {
  name: string
  currentStock: number
  totalCapacity: number
  daysRemaining: number
  status: string
}

interface VaccineStockStatusProps {
  showDetails?: boolean
}

export function VaccineStockStatus({ showDetails = false }: VaccineStockStatusProps) {
  const { userData } = useFirebase()
  const [vaccineStocks, setVaccineStocks] = useState<VaccineStock[]>(mockVaccineStocks)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Only try to fetch from Firestore if we have a valid database connection
    if (db) {
      fetchVaccineStocks()
    }
  }, [])

  const fetchVaccineStocks = async () => {
    setIsLoading(true)
    try {
      // Try to get data from Firestore
      if (db) {
        const vaccinesCollection = collection(db as Firestore, 'vaccines')
        const vaccinesQuery = query(vaccinesCollection, limit(10))
        const querySnapshot = await getDocs(vaccinesQuery)
        
        if (!querySnapshot.empty) {
          const vaccines = querySnapshot.docs.map(doc => {
            const data = doc.data() as VaccineStock
            return {
              name: data.name,
              currentStock: data.currentStock,
              totalCapacity: data.totalCapacity,
              daysRemaining: data.daysRemaining,
              status: data.status
            }
          })
          setVaccineStocks(vaccines)
        }
      }
    } catch (error) {
      console.error("Error fetching vaccine stocks:", error)
      // Fallback to mock data (already loaded by default)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sufficient":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "sufficient":
        return "default"
      case "warning":
        return "secondary"
      case "critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  // Find the most critical vaccine
  const criticalVaccine = vaccineStocks.find((v) => v.status === "Critical")

  return (
    <div className="space-y-4">
      {criticalVaccine && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Stock Alert</AlertTitle>
          <AlertDescription>
            {criticalVaccine.name} is running low. Only {criticalVaccine.daysRemaining} days remaining.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading vaccine stocks...</span>
          </div>
        ) : (
          vaccineStocks.map((vaccine) => (
            <div key={vaccine.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(vaccine.status)}`} />
                  <span className="font-medium">{vaccine.name}</span>
                </div>
                <Badge variant={getStatusBadge(vaccine.status)}>{vaccine.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={vaccine.currentStock} className="h-2" />
                <span className="text-xs text-muted-foreground w-12">{vaccine.currentStock}%</span>
              </div>
              {showDetails && (
                <div className="text-xs text-muted-foreground">
                  {vaccine.daysRemaining} days remaining at current usage rate
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showDetails && userData.role !== "health_worker" && (
        <div className="flex justify-end mt-4">
          <Button size="sm" asChild>
            <Link href="/dashboard/vaccines">Order Supplies</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
