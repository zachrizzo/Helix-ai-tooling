"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bell,
  Check,
  Cloud,
  Code,
  Database,
  Globe,
  HardDrive,
  Key,
  Laptop,
  Mail,
  Moon,
  Save,
  Server,
  Settings,
  Shield,
  Sun,
  User,
  Zap,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"

export function SettingsPanel() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<"account" | "appearance" | "notifications" | "integrations" | "system">(
    "account",
  )

  // Mock user data
  const user = {
    name: "Frontend Engineer",
    email: "engineer@figure.ai",
    role: "AI Researcher",
    avatar: "FE",
    team: "Helix Team",
    joined: "2023-09-15",
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully",
    })
  }

  const handleGenerateApiKey = () => {
    toast({
      title: "API key generated",
      description: "Your new API key has been generated",
    })
  }

  const handleResetSettings = () => {
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-64 shrink-0">
          <CardContent className="p-6">
            <div className="space-y-1 mb-6">
              <h3 className="font-medium">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account and system preferences</p>
            </div>
            <nav className="space-y-1">
              <Button
                variant={activeTab === "account" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("account")}
              >
                <User className="mr-2 h-4 w-4" />
                Account
              </Button>
              <Button
                variant={activeTab === "appearance" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("appearance")}
              >
                <Sun className="mr-2 h-4 w-4" />
                Appearance
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "integrations" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("integrations")}
              >
                <Code className="mr-2 h-4 w-4" />
                Integrations
              </Button>
              <Button
                variant={activeTab === "system" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("system")}
              >
                <Settings className="mr-2 h-4 w-4" />
                System
              </Button>
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-6">
          {activeTab === "account" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-medium">
                      {user.avatar}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.role} • {user.team}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(user.joined).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="sm:ml-auto">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        defaultValue={user.name}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="role"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        defaultValue={user.role}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>AI Researcher</option>
                        <option>Data Scientist</option>
                        <option>Robotics Engineer</option>
                        <option>Software Engineer</option>
                        <option>Team Lead</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="team"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Team
                      </label>
                      <select
                        id="team"
                        defaultValue={user.team}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>Helix Team</option>
                        <option>Perception Team</option>
                        <option>Control Systems</option>
                        <option>AI Research</option>
                        <option>Hardware Integration</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="current-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Current Password
                      </label>
                      <input
                        id="current-password"
                        type="password"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="new-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        New Password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="two-factor"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="two-factor"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable two-factor authentication
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">API Keys</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Personal API Key</p>
                        <p className="text-xs text-muted-foreground">Last used: 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleGenerateApiKey}>
                        <Key className="mr-2 h-4 w-4" />
                        Generate New Key
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveSettings}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Theme</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${theme === "light" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Sun className="h-5 w-5" />
                        {theme === "light" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="text-sm font-medium">Light</div>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${theme === "dark" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Moon className="h-5 w-5" />
                        {theme === "dark" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="text-sm font-medium">Dark</div>
                    </div>
                    <div
                      className={`border rounded-md p-4 cursor-pointer ${theme === "system" ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Laptop className="h-5 w-5" />
                        {theme === "system" && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="text-sm font-medium">System</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Density</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-md p-4 cursor-pointer ring-2 ring-primary">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-5 w-5 flex flex-col justify-between">
                          <div className="h-1 w-full bg-current"></div>
                          <div className="h-1 w-full bg-current"></div>
                          <div className="h-1 w-full bg-current"></div>
                        </div>
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-sm font-medium">Comfortable</div>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-5 w-5 flex flex-col justify-between">
                          <div className="h-0.5 w-full bg-current"></div>
                          <div className="h-0.5 w-full bg-current"></div>
                          <div className="h-0.5 w-full bg-current"></div>
                          <div className="h-0.5 w-full bg-current"></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">Compact</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Font Size</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="text-xs font-medium">Small</div>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer ring-2 ring-primary">
                      <div className="text-sm font-medium">Medium</div>
                      <Check className="h-4 w-4 text-primary mt-1" />
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="text-base font-medium">Large</div>
                    </div>
                    <div className="border rounded-md p-4 cursor-pointer">
                      <div className="text-lg font-medium">X-Large</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleResetSettings}>
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Email Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-experiments"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="email-experiments"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Experiment status changes
                        </label>
                      </div>
                      <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-models"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="email-models"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Model training completed
                        </label>
                      </div>
                      <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-annotations"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="email-annotations"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Annotation tasks assigned
                        </label>
                      </div>
                      <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-system"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="email-system"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          System alerts and updates
                        </label>
                      </div>
                      <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">In-App Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="app-experiments"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="app-experiments"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Experiment status changes
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="app-models"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="app-models"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Model training completed
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="app-annotations"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="app-annotations"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Annotation tasks assigned
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="app-system"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="app-system"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          System alerts and updates
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleResetSettings}>
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with external services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Database</h4>
                        <p className="text-xs text-muted-foreground">PostgreSQL connection</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Connected
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">GitHub</h4>
                        <p className="text-xs text-muted-foreground">Version control integration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Connected
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                        <Cloud className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cloud Storage</h4>
                        <p className="text-xs text-muted-foreground">AWS S3 integration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email Service</h4>
                        <p className="text-xs text-muted-foreground">SMTP configuration</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Connected
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">API Integrations</h4>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="api-url"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        API URL
                      </label>
                      <input
                        id="api-url"
                        defaultValue="https://api.example.com/v1"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="api-key"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        API Key
                      </label>
                      <input
                        id="api-key"
                        type="password"
                        defaultValue="••••••••••••••••"
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "system" && (
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Data Storage</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Local Storage</span>
                      </div>
                      <span className="text-sm">245.8 GB / 500 GB</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: "49%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cloud className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Cloud Storage</span>
                      </div>
                      <span className="text-sm">1.2 TB / 5 TB</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="cache-size" className="text-sm">
                        Cache Size
                      </label>
                      <span className="text-sm">2 GB</span>
                    </div>
                    <input
                      id="cache-size"
                      type="range"
                      min="0.5"
                      max="8"
                      step="0.5"
                      defaultValue="2"
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5 GB</span>
                      <span>8 GB</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="thread-count" className="text-sm">
                        Worker Threads
                      </label>
                      <span className="text-sm">4</span>
                    </div>
                    <input
                      id="thread-count"
                      type="range"
                      min="1"
                      max="16"
                      step="1"
                      defaultValue="4"
                      className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>16</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Security</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="auto-logout"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                          htmlFor="auto-logout"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Auto logout after inactivity
                        </label>
                      </div>
                      <select className="h-8 rounded-md border border-input bg-background px-2 text-xs">
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="secure-connection"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="secure-connection"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Require secure connection (HTTPS)
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="data-encryption"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="data-encryption"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable data encryption
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">System Maintenance</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Run Security Scan
                    </Button>
                    <Button variant="outline">
                      <Zap className="mr-2 h-4 w-4" />
                      Clear Cache
                    </Button>
                    <Button variant="outline">
                      <Server className="mr-2 h-4 w-4" />
                      System Diagnostics
                    </Button>
                    <Button variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      Check for Updates
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleResetSettings}>
                    Reset to Default
                  </Button>
                  <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

