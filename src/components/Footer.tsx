"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Shield } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const emergencyContacts = [
    { icon: Phone, label: "Emergency Hotline", value: "911" },
    { icon: Phone, label: "Disaster Response", value: "1-800-DISASTER" },
    { icon: Mail, label: "Email", value: "help@dms.gov" },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-red-500" />
              <span className="font-bold text-xl">Disaster Management</span>
            </div>
            <p className="text-gray-400 text-sm">
              Providing real-time disaster monitoring, emergency alerts, and
              comprehensive resources to keep communities safe.
            </p>
          </motion.div>

          {/* Emergency Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold text-lg mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-start gap-3">
                  <contact.icon className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">{contact.label}</p>
                    <p className="font-semibold">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resources"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Emergency Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/alerts"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Alert System
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Disaster Management System. All rights reserved.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-400">
              Serving communities worldwide
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}