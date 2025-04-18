"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslation } from "@/components/i18n/language-provider"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Use Mapbox token from environment variable or fallback to a placeholder
// In production, you should always use an environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 
  "pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2xnMTIzNDV6N2RlbSJ9.XdCZFI1S3s99FHB76wG5AA";

// Mock data for PHC locations
const phcLocations = [
  {
    id: "phc1",
    name: "Rajpur PHC",
    lat: 22.3,
    lng: 78.5,
    riskLevel: "High",
    vaccineStock: 25,
    coverage: 68,
    coordinates: [78.5, 22.3], // [lng, lat] format for Mapbox
  },
  {
    id: "phc2",
    name: "Ganeshpur PHC",
    lat: 22.5,
    lng: 78.7,
    riskLevel: "Low",
    vaccineStock: 78,
    coverage: 92,
    coordinates: [78.7, 22.5],
  },
  {
    id: "phc3",
    name: "Lakshmipur PHC",
    lat: 22.2,
    lng: 78.3,
    riskLevel: "Moderate",
    vaccineStock: 45,
    coverage: 76,
    coordinates: [78.3, 22.2],
  },
  {
    id: "phc4",
    name: "Chandpur PHC",
    lat: 22.4,
    lng: 78.2,
    riskLevel: "Low",
    vaccineStock: 82,
    coverage: 88,
    coordinates: [78.2, 22.4],
  },
  {
    id: "phc5",
    name: "Narmada PHC",
    lat: 22.6,
    lng: 78.4,
    riskLevel: "High",
    vaccineStock: 15,
    coverage: 62,
    coordinates: [78.4, 22.6],
  },
]

export default function MapPage() {
  const { t } = useTranslation()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapView, setMapView] = useState<"risk" | "vaccine" | "coverage">("risk")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current) return

    try {
      // Initialize map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [78.4, 22.4], // Center of India
        zoom: 8
      })

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Save map instance to ref
      mapRef.current = map

      map.on('load', () => {
        setMapLoaded(true)
      })

      // Clean up on unmount
      return () => {
        map.remove()
      }
    } catch (error) {
      console.error("Failed to initialize Mapbox map:", error)
    }
  }, [])

  // Update markers when map view changes or map loads
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapLoaded) return
    
    // Remove existing markers
    const markers = document.querySelectorAll('.mapboxgl-marker')
    markers.forEach(marker => marker.remove())

    // Add PHC markers
    phcLocations.forEach(phc => {
      // Determine marker color based on view type
      let color = "#3b82f6" // Default blue
      
      if (mapView === "risk") {
        color = phc.riskLevel === "High" ? "#ef4444" : phc.riskLevel === "Moderate" ? "#f59e0b" : "#22c55e"
      } else if (mapView === "vaccine") {
        color = phc.vaccineStock < 30 ? "#ef4444" : phc.vaccineStock < 50 ? "#f59e0b" : "#22c55e"
      } else if (mapView === "coverage") {
        color = phc.coverage < 70 ? "#ef4444" : phc.coverage < 85 ? "#f59e0b" : "#22c55e"
      }

      // Create marker element
      const el = document.createElement('div')
      el.className = 'phc-marker'
      el.style.backgroundColor = color
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.border = '2px solid white'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)'

      // Create a popup with PHC information
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 10px;">
          <h3 style="margin: 0 0 10px 0; font-weight: 600;">${phc.name}</h3>
          <p style="margin: 0; font-size: 0.875rem;">Risk Level: <span style="font-weight: 500;">${phc.riskLevel}</span></p>
          <p style="margin: 5px 0; font-size: 0.875rem;">Vaccine Stock: <span style="font-weight: 500;">${phc.vaccineStock} units</span></p>
          <p style="margin: 5px 0; font-size: 0.875rem;">Population Coverage: <span style="font-weight: 500;">${phc.coverage}%</span></p>
        </div>
      `)

      // Add marker to map with popup
      new mapboxgl.Marker(el)
        .setLngLat(phc.coordinates as [number, number])
        .setPopup(popup)
        .addTo(map)
    })
  }, [mapLoaded, mapView])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("map.title")}</CardTitle>
          <CardDescription>{t("map.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={mapView === "risk" ? "default" : "outline"} 
              onClick={() => setMapView("risk")}
            >
              Risk Zones
            </Button>
            <Button 
              variant={mapView === "vaccine" ? "default" : "outline"} 
              onClick={() => setMapView("vaccine")}
            >
              Vaccine Stock
            </Button>
            <Button 
              variant={mapView === "coverage" ? "default" : "outline"} 
              onClick={() => setMapView("coverage")}
            >
              Coverage
            </Button>
          </div>
          
          <div 
            ref={mapContainerRef} 
            className="w-full h-[500px] rounded-md border overflow-hidden"
          >
            {!mapLoaded && (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <p>Loading map...</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>{mapView === "risk" ? "Low Risk" : mapView === "vaccine" ? "Good Stock" : "High Coverage"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>{mapView === "risk" ? "Moderate Risk" : mapView === "vaccine" ? "Medium Stock" : "Medium Coverage"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>{mapView === "risk" ? "High Risk" : mapView === "vaccine" ? "Low Stock" : "Low Coverage"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
