"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Bell, Cloud, Wind, Thermometer, Droplets, MapPin, Clock, TrendingUp, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NavigationBar from "@/components/Navigation"
import Footer from "@/components/Footer"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Alert {
  id: number
  type: string
  severity: string
  location: string
  description: string
  timestamp: string
}

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  conditions: string
}

export default function AlertsPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [alertsRes, weatherRes] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/weather/current')
      ])

      if (!alertsRes.ok || !weatherRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const alertsData = await alertsRes.json()
      const weatherData = await weatherRes.json()

      setAlerts(alertsData.data?.alerts || [])
      setWeather(weatherData.data?.current || null)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load alert data')
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

  const getAlertIcon = (type: string) => {
    if (type.toLowerCase().includes('wind') || type.toLowerCase().includes('hurricane')) return Wind
    if (type.toLowerCase().includes('flood') || type.toLowerCase().includes('rain')) return Droplets
    if (type.toLowerCase().includes('heat') || type.toLowerCase().includes('temperature')) return Thermometer
    return AlertTriangle
  }

  const notifications = [
    {
      id: 1,
      title: "New Alert Issued",
      message: alerts[0]?.type || "Check active alerts",
      time: alerts[0] ? getTimeAgo(alerts[0].timestamp) : "N/A",
      read: false,
    },
    {
      id: 2,
      title: "Weather Update",
      message: weather ? `${weather.conditions}, ${weather.temperature}°C` : "Loading...",
      time: "Live",
      read: false,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <NavigationBar />
        <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <Bell className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl font-bold mb-4">Alert System</h1>
              <p className="text-xl text-red-100 mb-6">
                Real-time disaster alerts and weather monitoring for your safety
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading alerts...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Bell className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Alert System</h1>
            <p className="text-xl text-red-100 mb-6">
              Real-time disaster alerts and weather monitoring for your safety
            </p>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Active Alerts */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold mb-2">Active Alerts</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Critical warnings and advisories in your region
                </p>
              </motion.div>

              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert, index) => {
                    const AlertIcon = getAlertIcon(alert.type)
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Card
                          className={`p-6 border-l-4 ${
                            alert.severity === "critical"
                              ? "border-l-red-600 bg-red-50 dark:bg-red-950/20"
                              : alert.severity === "warning"
                              ? "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20"
                              : "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`p-3 rounded-lg ${
                                alert.severity === "critical"
                                  ? "bg-red-100 dark:bg-red-900/30"
                                  : alert.severity === "warning"
                                  ? "bg-orange-100 dark:bg-orange-900/30"
                                  : "bg-yellow-100 dark:bg-yellow-900/30"
                              }`}
                            >
                              <AlertIcon
                                className={`w-8 h-8 ${
                                  alert.severity === "critical"
                                    ? "text-red-600"
                                    : alert.severity === "warning"
                                    ? "text-orange-600"
                                    : "text-yellow-600"
                                }`}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold">{alert.type}</h3>
                                <Badge
                                  variant={
                                    alert.severity === "critical" || alert.severity === "warning"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {alert.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {getTimeAgo(alert.timestamp)}
                                </span>
                              </div>

                              <p className="text-gray-700 dark:text-gray-300 mb-3">
                                {alert.description}
                              </p>

                              <div className="flex items-center justify-between">
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No active alerts at this time</p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        whileHover={{ x: 5 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          !notif.read
                            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-semibold text-sm">{notif.title}</p>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500">{notif.time}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Current Weather */}
              {weather && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Current Weather
                    </h3>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold mb-2">
                        {weather.temperature}°C
                      </div>
                      <p className="text-blue-100">{weather.conditions}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-100 mb-1">Humidity</p>
                        <p className="font-bold">{weather.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-blue-100 mb-1">Wind</p>
                        <p className="font-bold">{weather.windSpeed} km/h</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">Live Data</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}