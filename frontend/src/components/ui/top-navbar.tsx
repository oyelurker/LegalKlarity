"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Home, User, FileText, Mail, Menu } from "lucide-react"
import { cn } from "../../lib/utils"

type LucideIcon = typeof Home

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface TopNavBarProps {
  items: NavItem[]
  className?: string
}

export function TopNavBar({ items, className }: TopNavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-border z-50",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LegalKlarity
            </span>
          </div>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="hidden md:flex md:items-center md:space-x-4">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.name

                return (
                  <Link
                    key={item.name}
                    to={item.url}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      "relative flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-colors",
                      "text-slate-700 dark:text-slate-300 hover:text-primary",
                      isActive && "text-primary",
                    )}
                  >
                    <Icon size={18} className="mr-2" />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          )}
          
          {/* Mobile menu button */}
          {isMobile && (
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 dark:text-slate-300 hover:text-primary focus:outline-none"
              >
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>
        
        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <div className="md:hidden py-2">
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.name

              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => {
                    setActiveTab(item.name)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center text-base font-medium px-4 py-3 rounded-lg transition-colors",
                    "text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800",
                    isActive && "text-primary bg-slate-100 dark:bg-slate-800",
                  )}
                >
                  <Icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}