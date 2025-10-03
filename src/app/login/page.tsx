"use client"

import { motion } from "framer-motion"
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Login functionality will be connected to Django/FastAPI backend")
    }, 1500)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Registration functionality will be connected to Django/FastAPI backend")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-12 h-12 text-red-600" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Disaster Management System
            </span>
          </Link>
        </motion.div>

        <Card className="p-8 shadow-2xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Sign in to access emergency resources and alerts
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Signing in..."
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Don't have an account?{" "}
                    <span className="text-red-600 font-medium cursor-pointer">
                      Register now
                    </span>
                  </p>
                </div>
              </motion.div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Register to receive personalized alerts and resources
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded mt-0.5"
                      required
                    />
                    <span className="text-gray-600 dark:text-gray-400">
                      I agree to the{" "}
                      <a href="#" className="text-red-600 font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-red-600 font-medium">
                        Privacy Policy
                      </a>
                    </span>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Creating account..."
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Already have an account?{" "}
                    <span className="text-red-600 font-medium cursor-pointer">
                      Sign in
                    </span>
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
        >
          By continuing, you acknowledge our commitment to your safety and privacy
        </motion.p>
      </motion.div>
    </div>
  )
}