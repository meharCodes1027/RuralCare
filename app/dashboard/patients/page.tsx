"use client"

import { useState, useEffect } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/i18n/language-provider"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Search, RefreshCw } from "lucide-react"
import { 
  MotionDiv, 
  MotionCard, 
  MotionButton, 
  MotionList, 
  MotionListItem,
  MotionText
} from "@/components/ui/motion"
import { motion } from "framer-motion"

// Generate mock patient data
const mockPatients = [
  {
    id: "P1001",
    name: "Aarav Patel",
    age: 45,
    gender: "Male",
    village: "Rajpur",
    condition: "Diabetes",
    riskLevel: "Medium",
    lastVisit: "2023-10-15",
    profileImage: "",
  },
  {
    id: "P1002",
    name: "Meera Singh",
    age: 32,
    gender: "Female",
    village: "Ganeshpur",
    condition: "Pregnancy",
    riskLevel: "Low",
    lastVisit: "2023-11-02",
    profileImage: "",
  },
  {
    id: "P1003",
    name: "Rajesh Kumar",
    age: 61,
    gender: "Male",
    village: "Lakshmipur",
    condition: "Hypertension",
    riskLevel: "High",
    lastVisit: "2023-10-28",
    profileImage: "",
  },
  {
    id: "P1004",
    name: "Priya Sharma",
    age: 27,
    gender: "Female",
    village: "Chandpur",
    condition: "Anemia",
    riskLevel: "Medium",
    lastVisit: "2023-11-05",
    profileImage: "",
  },
  {
    id: "P1005",
    name: "Vikram Reddy",
    age: 51,
    gender: "Male",
    village: "Narmada",
    condition: "COPD",
    riskLevel: "High",
    lastVisit: "2023-10-20",
    profileImage: "",
  },
  {
    id: "P1006",
    name: "Ananya Das",
    age: 35,
    gender: "Female",
    village: "Rajpur",
    condition: "Thyroid",
    riskLevel: "Low",
    lastVisit: "2023-11-01",
    profileImage: "",
  },
  {
    id: "P1007",
    name: "Mohan Verma",
    age: 48,
    gender: "Male",
    village: "Ganeshpur",
    condition: "Tuberculosis",
    riskLevel: "High",
    lastVisit: "2023-10-18",
    profileImage: "",
  },
  {
    id: "P1008",
    name: "Lakshmi Iyer",
    age: 29,
    gender: "Female",
    village: "Lakshmipur",
    condition: "Malnutrition",
    riskLevel: "Medium",
    lastVisit: "2023-11-04",
    profileImage: "",
  },
]

export default function PatientsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const [mounted, setMounted] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Filter patients based on search query
  const handleSearch = () => {
    setIsSearching(true)
    setTimeout(() => {
      const filtered = mockPatients.filter((patient) =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredPatients(filtered)
      setIsSearching(false)
    }, 400) // Slight delay for search animation
  }

  // Reset search
  const handleReset = () => {
    setIsSearching(true)
    setSearchQuery("")
    setTimeout(() => {
      setFilteredPatients(mockPatients)
      setIsSearching(false)
    }, 300)
  }

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value === "") {
      setFilteredPatients(mockPatients)
    }
  }

  // Get badge color based on risk level
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "destructive" as const
      case "medium":
        return "secondary" as const
      case "low":
        return "outline" as const
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
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CardTitle>Patient Registry</CardTitle>
            <CardDescription>View and manage patient records from rural health centers</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-wrap gap-2 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-1 relative">
              <Input
                placeholder="Search patients by name, ID, village, or condition..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full transition-all duration-200 pl-10 focus:ring-2 focus:ring-primary/30"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <MotionButton
              onClick={handleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </MotionButton>
            <MotionButton
              variant="outline"
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Reset
            </MotionButton>
          </motion.div>

          <motion.div 
            className="rounded-md border overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Last Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSearching ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <RefreshCw className="h-6 w-6 mx-auto animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground animate-pulse">Searching patients...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length > 0 ? (
                  <MotionList staggerDelay={0.05}>
                    {filteredPatients.map((patient, index) => (
                      <MotionListItem key={patient.id}>
                        <TableRow className="group hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 500 }}>
                                <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary transition-all">
                                  <AvatarImage src={patient.profileImage} />
                                  <AvatarFallback className="bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                    {patient.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div>
                                <div className="font-medium group-hover:text-primary transition-colors">
                                  {patient.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {patient.id}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{patient.age} / {patient.gender}</TableCell>
                          <TableCell>{patient.village}</TableCell>
                          <TableCell>{patient.condition}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={getRiskBadgeVariant(patient.riskLevel)}
                              className="transition-all duration-300 group-hover:scale-110"
                            >
                              {patient.riskLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="group-hover:font-medium transition-all">
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      </MotionListItem>
                    ))}
                  </MotionList>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <MotionText
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        No patients found. Try a different search.
                      </MotionText>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </motion.div>
        </CardContent>
      </MotionCard>
    </MotionDiv>
  )
} 