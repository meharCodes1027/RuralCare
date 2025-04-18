"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFirebase } from "@/components/firebase/firebase-provider"

// Mock data for recent patients
const recentPatients = [
  {
    id: "P-1001",
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    riskLevel: "High",
    symptoms: "Chest pain, Shortness of breath",
    date: "2023-04-15",
  },
  {
    id: "P-1002",
    name: "Anita Sharma",
    age: 32,
    gender: "Female",
    riskLevel: "Low",
    symptoms: "Fever, Headache",
    date: "2023-04-15",
  },
  {
    id: "P-1003",
    name: "Vikram Singh",
    age: 58,
    gender: "Male",
    riskLevel: "Moderate",
    symptoms: "Joint pain, Fatigue",
    date: "2023-04-14",
  },
  {
    id: "P-1004",
    name: "Priya Patel",
    age: 28,
    gender: "Female",
    riskLevel: "Low",
    symptoms: "Sore throat, Cough",
    date: "2023-04-14",
  },
  {
    id: "P-1005",
    name: "Mohan Desai",
    age: 62,
    gender: "Male",
    riskLevel: "High",
    symptoms: "Dizziness, High blood pressure",
    date: "2023-04-13",
  },
]

export function RecentPatients() {
  const { userData } = useFirebase()

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead className="hidden md:table-cell">Symptoms</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10">{getInitials(patient.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{patient.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {patient.age} yrs, {patient.gender}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRiskBadgeVariant(patient.riskLevel)}>{patient.riskLevel}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-[200px] truncate">{patient.symptoms}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(patient.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center">
        <Button variant="outline">View All Patients</Button>
      </div>
    </div>
  )
}
