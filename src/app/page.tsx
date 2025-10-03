"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Cloud, Wind, Droplets, Thermometer, MapPin, Activity, Users, Shield, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Alert {
  id: number
  type: string
  location: string
  severity: string
  timestamp: string
  description: string
}

interface Stats {
  activeIncidents: number
  peopleAssisted: number
  sheltersActive: number
  coverageAreas: number
}

interface WeatherData {
  temperature: number
  windSpeed: number
  humidity: number
  conditions: string
}

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [alertsRes, statsRes, weatherRes] = await Promise.all([
        fetch('/api/alerts?limit=3'),
        fetch('/api/stats'),
        fetch('/api/weather/current')
      ])

      if (!alertsRes.ok || !statsRes.ok || !weatherRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const alertsData = await alertsRes.json()
      const statsData = await statsRes.json()
      const weatherData = await weatherRes.json()

      setAlerts(alertsData.data?.alerts || [])
      setStats(statsData)
      setWeather(weatherData.data?.current || null)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins} mins ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`
  }

  const weatherMetrics = weather ? [
    { icon: Thermometer, label: "Temperature", value: `${weather.temperature}°C`, trend: "Current" },
    { icon: Wind, label: "Wind Speed", value: `${weather.windSpeed} km/h`, trend: weather.windSpeed > 30 ? "High" : "Normal" },
    { icon: Droplets, label: "Humidity", value: `${weather.humidity}%`, trend: weather.humidity > 70 ? "High" : "Normal" },
    { icon: Cloud, label: "Conditions", value: weather.conditions, trend: "Now" },
  ] : []

  const statsDisplay = stats ? [
    { icon: Activity, label: "Active Incidents", value: stats.activeIncidents.toString(), color: "text-red-500" },
    { icon: Users, label: "People Assisted", value: stats.peopleAssisted.toLocaleString(), color: "text-green-500" },
    { icon: Shield, label: "Shelters Active", value: stats.sheltersActive.toString(), color: "text-blue-500" },
    { icon: MapPin, label: "Coverage Areas", value: stats.coverageAreas.toString(), color: "text-purple-500" },
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <Navigation />
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-4 py-2 text-sm font-medium">
                <Activity className="w-4 h-4 mr-2 inline" />
                Real-Time Monitoring Active
              </Badge>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Disaster Management System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Real-time alerts, weather monitoring, and emergency resources to keep your community safe during critical situations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/alerts">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    View Active Alerts
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/resources">
                  <Button size="lg" variant="outline" className="px-8">
                    Emergency Resources
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-3xl font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`w-12 h-12 ${stat.color} opacity-20`} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Alerts Dashboard */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold mb-2">Active Emergency Alerts</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time disaster alerts and warnings for your region
            </p>
          </motion.div>

          {alerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    className={`p-6 border-l-4 ${
                      alert.severity === "critical"
                        ? "border-l-red-500 bg-red-50 dark:bg-red-950/20"
                        : alert.severity === "warning"
                        ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20"
                        : "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <AlertTriangle
                        className={`w-8 h-8 ${
                          alert.severity === "critical"
                            ? "text-red-500"
                            : alert.severity === "warning"
                            ? "text-orange-500"
                            : "text-yellow-500"
                        }`}
                      />
                      <Badge
                        variant={alert.severity === "critical" || alert.severity === "warning" ? "destructive" : "secondary"}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{alert.type}</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {alert.location}
                    </div>
                    <p className="text-xs text-gray-500">{getTimeAgo(alert.timestamp)}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No active alerts at this time</p>
            </Card>
          )}
        </div>
      </section>

      {/* Weather Monitoring */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold mb-2">Weather Monitoring</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Live weather data and environmental conditions
            </p>
          </motion.div>

          {weather ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {weatherMetrics.map((data, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="p-6 bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow">
                    <data.icon className="w-10 h-10 text-blue-500 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {data.label}
                    </p>
                    <p className="text-3xl font-bold mb-2">{data.value}</p>
                    <Badge variant="outline" className="text-xs">
                      {data.trend}
                    </Badge>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Weather data unavailable</p>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}