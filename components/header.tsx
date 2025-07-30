"use client"

import { Menu, Bell, User, Shield, MapPin, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

interface HeaderProps {
  onMenuClick: () => void
  user: any
  hazards: any[]
}

export function Header({ onMenuClick, user, hazards }: HeaderProps) {
  const { signOut } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Sahyadri Guardian</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifOpen((v) => !v)}>
              <Bell className="h-5 w-5" />
              {hazards.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {hazards.length}
                </Badge>
              )}
            </Button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b font-semibold text-gray-800">Hazard Notifications</div>
                <div className="max-h-72 overflow-y-auto">
                  {hazards.length === 0 ? (
                    <div className="p-4 text-gray-500 text-sm">No hazards reported.</div>
                  ) : (
                    hazards.map((hazard) => (
                      <div key={hazard.id} className="p-3 border-b last:border-b-0 flex items-start space-x-2">
                        <div className="mt-1">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="font-medium text-sm capitalize">{hazard.type.replace(/_/g, " ")}</div>
                          <div className="text-xs text-gray-600 mb-1">Severity: <span className={
                            hazard.severity === "high" ? "text-red-600" : hazard.severity === "moderate" ? "text-yellow-600" : "text-green-600"
                          }>{hazard.severity}</span></div>
                          <div className="text-xs text-gray-700 mb-1">{hazard.description}</div>
                          <div className="text-xs text-gray-400">{hazard.reportedAt ? new Date(hazard.reportedAt).toLocaleString() : ""}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || "/placeholder-user.jpg"} alt={user.displayName} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="mr-2 h-4 w-4" />
                  My Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
