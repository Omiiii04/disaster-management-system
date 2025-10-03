"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { AlertTriangle, Menu, X, Shield } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/alerts", label: "Alert System" },
    { href: "/login", label: "Login" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-8 h-8 text-red-600" />
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              DMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergency
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}