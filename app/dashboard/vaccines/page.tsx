"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Plus, RefreshCw } from "lucide-react"
import {
  MotionDiv, 
  MotionCard, 
  MotionButton, 
  MotionList, 
  MotionListItem,
  MotionText
} from "@/components/ui/motion"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

// Mock data for vaccines
const mockVaccines = [
  {
    id: "VAX001",
    name: "BCG",
    stock: 42,
    expiryDate: "2024-12-15",
    batchNumber: "BCG-2023-143",
    manufacturer: "Serum Institute",
    temperature: "2-8°C",
    status: "In Stock",
  },
  {
    id: "VAX002",
    name: "Polio (OPV)",
    stock: 95,
    expiryDate: "2024-10-30",
    batchNumber: "OPV-2023-217",
    manufacturer: "Bharat Biotech",
    temperature: "2-8°C",
    status: "In Stock",
  },
  {
    id: "VAX003",
    name: "MMR",
    stock: 8,
    expiryDate: "2024-08-25",
    batchNumber: "MMR-2023-078",
    manufacturer: "Sanofi",
    temperature: "2-8°C",
    status: "Low Stock",
  },
  {
    id: "VAX004",
    name: "Hepatitis B",
    stock: 63,
    expiryDate: "2025-01-10",
    batchNumber: "HB-2023-311",
    manufacturer: "GSK",
    temperature: "2-8°C",
    status: "In Stock",
  },
  {
    id: "VAX005",
    name: "COVID-19",
    stock: 120,
    expiryDate: "2024-09-20",
    batchNumber: "COV-2023-542",
    manufacturer: "Pfizer",
    temperature: "-70°C",
    status: "In Stock",
  },
  {
    id: "VAX006",
    name: "Rotavirus",
    stock: 3,
    expiryDate: "2024-07-05",
    batchNumber: "RV-2023-093",
    manufacturer: "Bharat Biotech",
    temperature: "2-8°C",
    status: "Critical",
  },
]

export default function VaccinesPage() {
  const [vaccines, setVaccines] = useState(mockVaccines)
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVaccine, setSelectedVaccine] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOrderVaccine = (vaccineId: string) => {
    setSelectedVaccine(vaccineId)
    
    // Simulate ordering API call
    setTimeout(() => {
      // Update the vaccine stock
      setVaccines(prev => prev.map(v => {
        if (v.id === vaccineId) {
          const newStock = v.stock + 25
          const newStatus = newStock < 10 ? "Critical" : newStock < 20 ? "Low Stock" : "In Stock"
          
          toast({
            title: "Order Placed",
            description: `25 doses of ${v.name} have been ordered. New stock: ${newStock}`,
            variant: "default",
          })
          
          return {
            ...v,
            stock: newStock,
            status: newStatus
          }
        }
        return v
      }))
      
      setSelectedVaccine(null)
    }, 1500)
  }

  const refreshVaccineData = () => {
    setIsLoading(true)
    
    // Simulate API refresh
    setTimeout(() => {
      toast({
        title: "Data Refreshed",
        description: "Vaccine inventory has been updated with latest data",
        variant: "default",
      })
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical":
        return "destructive" as const
      case "low stock":
        return "warning" as const
      case "in stock":
        return "success" as const
      default:
        return "secondary" as const
    }
  }

  if (!mounted) return null

  return (
    <MotionDiv 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <MotionCard 
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardTitle>Vaccine Inventory</CardTitle>
            <CardDescription>Manage vaccine stock for rural health centers</CardDescription>
          </motion.div>
          <MotionButton
            onClick={refreshVaccineData}
            variant="outline"
            size="sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh Data
          </MotionButton>
        </CardHeader>
        <CardContent>
          <motion.div
            className="rounded-md border overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccine</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Batch #</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <RefreshCw className="h-6 w-6 mx-auto animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground animate-pulse">Refreshing vaccine data...</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <MotionList staggerDelay={0.05}>
                    {vaccines.map((vaccine) => (
                      <MotionListItem key={vaccine.id}>
                        <TableRow className="group hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-medium group-hover:text-primary transition-colors">
                                {vaccine.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {vaccine.manufacturer}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <motion.span
                              className={`font-mono ${vaccine.stock < 10 ? 'text-destructive font-bold' : vaccine.stock < 20 ? 'text-amber-500' : 'text-green-600'}`}
                              animate={{ 
                                scale: selectedVaccine === vaccine.id ? [1, 1.2, 1] : 1
                              }}
                              transition={{ 
                                duration: 0.5,
                                repeat: selectedVaccine === vaccine.id ? 1 : 0
                              }}
                            >
                              {vaccine.stock} doses
                            </motion.span>
                          </TableCell>
                          <TableCell>
                            <code className="bg-muted px-1 py-0.5 rounded text-xs group-hover:bg-primary/10 transition-colors">
                              {vaccine.batchNumber}
                            </code>
                          </TableCell>
                          <TableCell>
                            {new Date(vaccine.expiryDate) < new Date() ? (
                              <div className="flex items-center gap-1 text-destructive">
                                <AlertCircle className="h-3 w-3" />
                                <span>Expired</span>
                              </div>
                            ) : (
                              new Date(vaccine.expiryDate).toLocaleDateString()
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm bg-primary/5 px-2 py-1 rounded-full">
                              {vaccine.temperature}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusColor(vaccine.status)}
                              className="transition-all duration-300 group-hover:scale-110"
                            >
                              {vaccine.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <MotionButton
                              size="sm"
                              onClick={() => handleOrderVaccine(vaccine.id)}
                              disabled={selectedVaccine === vaccine.id}
                              variant={vaccine.stock < 20 ? "default" : "outline"}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {selectedVaccine === vaccine.id ? (
                                <>
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  Ordering...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Order
                                </>
                              )}
                            </MotionButton>
                          </TableCell>
                        </TableRow>
                      </MotionListItem>
                    ))}
                  </MotionList>
                )}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            <p>Note: Keep all vaccines within their recommended temperature range.</p>
          </motion.div>
        </CardFooter>
      </MotionCard>
    </MotionDiv>
  )
} 