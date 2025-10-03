"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Home, Users, Building2, Truck, Heart, Wrench, Map, Navigation2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NavigationBar from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Shelter {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  capacity: number
  available: number
  amenities: string[]
  contact: string
  status: string
  distance: string | null
}

interface EvacuationRoute {
  id: number
  name: string
  routeFrom: string
  routeTo: string
  status: string
  traffic: string
  distance: string
  description: string | null
}

interface EmergencyContact {
  id: number
  category: string
  name: string
  number: string
  iconName: string
}

export default function ResourcesPage() {
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [sheltersRes, routesRes, contactsRes] = await Promise.all([
        fetch('/api/resources/shelters'),
        fetch('/api/resources/evacuation-routes'),
        fetch('/api/emergency-contacts')
      ])

      if (!sheltersRes.ok || !routesRes.ok || !contactsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const sheltersData = await sheltersRes.json()
      const routesData = await routesRes.json()
      const contactsData = await contactsRes.json()

      setShelters(sheltersData.data?.shelters || [])
      setEvacuationRoutes(routesData.data?.routes || [])
      setEmergencyContacts(contactsData || [])
    } catch (err) {
      setError('Failed to load resources. Please try again.')
      toast.error('Failed to load resources')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      phone: Phone,
      shield: Users,
      medical: Heart,
      building: Building2,
      heart: Heart,
      'alert-triangle': AlertCircle,
      cloud: AlertCircle,
      'user-heart': Heart,
      headphones: Phone,
      pet: Heart,
      truck: Truck,
    }
    return icons[iconName] || Phone
  }

  const groupedContacts = emergencyContacts.reduce((acc, contact) => {
    if (!acc[contact.category]) {
      acc[contact.category] = []
    }
    acc[contact.category].push(contact)
    return acc
  }, {} as Record<string, EmergencyContact[]>)

  const contactCategories = Object.entries(groupedContacts).map(([category, contacts]) => ({
    category,
    contacts: contacts.map(c => ({
      name: c.name,
      number: c.number,
      icon: getIconComponent(c.iconName)
    }))
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <NavigationBar />
        <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <Home className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl font-bold mb-4">Emergency Resources</h1>
              <p className="text-xl text-blue-100">
                Find shelters, evacuation routes, and emergency contacts in your area
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading resources...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <NavigationBar />
        <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <Home className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-5xl font-bold mb-4">Emergency Resources</h1>
              <p className="text-xl text-blue-100">
                Find shelters, evacuation routes, and emergency contacts in your area
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={fetchAllData}>Retry</Button>
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
      <section className="pt-32 pb-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Home className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Emergency Resources</h1>
            <p className="text-xl text-blue-100">
              Find shelters, evacuation routes, and emergency contacts in your area
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue="shelters" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="shelters">Shelters</TabsTrigger>
              <TabsTrigger value="routes">Evacuation Routes</TabsTrigger>
              <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            </TabsList>

            {/* Shelters Tab */}
            <TabsContent value="shelters">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold mb-2">Available Shelters</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Find the nearest emergency shelter with real-time capacity updates
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shelters.map((shelter, index) => (
                  <motion.div
                    key={shelter.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="p-6 h-full hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <Building2 className="w-10 h-10 text-blue-500" />
                        {shelter.distance && (
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {shelter.distance}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-2">{shelter.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-start">
                        <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        {shelter.address}
                      </p>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                          <span className="font-semibold">
                            {shelter.available} / {shelter.capacity}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(shelter.available / shelter.capacity) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-green-500 h-2 rounded-full"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {shelter.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full" variant="outline">
                        <Navigation2 className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Evacuation Routes Tab */}
            <TabsContent value="routes">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold mb-2">Evacuation Routes</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time traffic updates and route status for safe evacuation
                </p>
              </motion.div>

              <div className="space-y-6">
                {evacuationRoutes.map((route, index) => (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Map className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-2">{route.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <p>
                                <span className="font-semibold">From:</span> {route.routeFrom}
                              </p>
                              <p>
                                <span className="font-semibold">To:</span> {route.routeTo}
                              </p>
                              <p>
                                <span className="font-semibold">Distance:</span> {route.distance}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 lg:items-end">
                          <Badge
                            variant={
                              route.status === "open"
                                ? "default"
                                : route.status === "congested"
                                ? "destructive"
                                : "secondary"
                            }
                            className="w-fit"
                          >
                            {route.status.toUpperCase()}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`w-fit ${
                              route.traffic === "light"
                                ? "border-green-500 text-green-700 dark:text-green-400"
                                : route.traffic === "moderate"
                                ? "border-yellow-500 text-yellow-700 dark:text-yellow-400"
                                : "border-red-500 text-red-700 dark:text-red-400"
                            }`}
                          >
                            Traffic: {route.traffic}
                          </Badge>
                          <Button size="sm" className="mt-2">
                            <Navigation2 className="w-4 h-4 mr-2" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Emergency Contacts Tab */}
            <TabsContent value="contacts">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold mb-2">Emergency Contacts</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Important phone numbers for emergency situations
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {contactCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={categoryIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <Card className="p-6">
                      <h3 className="text-xl font-bold mb-6">{category.category}</h3>
                      <div className="space-y-4">
                        {category.contacts.map((contact, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                              <contact.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{contact.name}</p>
                              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                {contact.number}
                              </p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  )
}