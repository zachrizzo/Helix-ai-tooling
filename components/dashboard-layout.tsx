"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Database, FlaskConical, Home, Layers, Menu, Moon, Settings, Sun, Tag, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Annotation", href: "/annotation", icon: Tag },
    { name: "Datasets", href: "/datasets", icon: Database },
    { name: "Experiments", href: "/experiments", icon: FlaskConical },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Models", href: "/models", icon: Layers },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full">
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", isSidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleSidebar} />
        <div className="fixed inset-y-0 left-0 w-64 bg-background border-r">
          <div className="flex h-16 items-center px-6 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-md p-1">
                <FlaskConical className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Helix Hub</span>
            </Link>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
                onClick={toggleSidebar}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <FlaskConical className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Helix Hub</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-auto"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden lg:flex"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              FE
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

