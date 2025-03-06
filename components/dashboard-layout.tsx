"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Database,
  FlaskConical,
  Home,
  Layers,
  Menu,
  Moon,
  Settings,
  Sun,
  Tag,
  X,
  Bell,
  Search,
  User
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="rounded-full shadow-md border">
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", isSidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleSidebar} />
        <div className="fixed inset-y-0 left-0 w-72 bg-background border-r shadow-lg backdrop-blur-xl transition-transform duration-300">
          <div className="flex h-16 items-center px-6 border-b">
            <Link href="/" className="flex items-center gap-2" onClick={toggleSidebar}>
              <div className="bg-primary rounded-md p-1">
                <FlaskConical className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Helix Hub</span>
            </Link>
          </div>

          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
                onClick={toggleSidebar}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <Avatar>
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>FE</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Felix Edwards</p>
                <p className="text-xs text-muted-foreground">felix@example.com</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:shadow-sm">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <FlaskConical className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Helix Hub</span>
          </Link>
        </div>

        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar>
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>FE</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">Felix Edwards</p>
              <p className="text-xs text-muted-foreground">felix@example.com</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b shadow-sm bg-background/95 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
          <h1 className="text-xl font-bold lg:text-2xl">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full hidden md:flex relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-background"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>FE</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <button
                    className="flex items-center w-full"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  )
}

