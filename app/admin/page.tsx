"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, CheckCircle, XCircle, Users, MapPin, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const hazardReports = [
    {
      id: 1,
      type: "landslide",
      location: "Sinhagad Fort Trail",
      coordinates: { lat: 18.369, lng: 73.759 },
      severity: "high",
      status: "pending",
      reportedBy: "John Doe",
      reportedAt: new Date("2024-01-15T10:30:00"),
      description: "Large landslide blocking main trail path",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      type: "fallen_tree",
      location: "Rajgad Fort Trail",
      coordinates: { lat: 18.247, lng: 73.68 },
      severity: "moderate",
      status: "verified",
      reportedBy: "Jane Smith",
      reportedAt: new Date("2024-01-15T08:15:00"),
      description: "Large tree fallen across trail after storm",
      photo: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      type: "slippery_rock",
      location: "Torna Fort Trail",
      coordinates: { lat: 18.252, lng: 73.688 },
      severity: "low",
      status: "resolved",
      reportedBy: "Mike Johnson",
      reportedAt: new Date("2024-01-14T16:45:00"),
      description: "Wet rocks near waterfall area",
      photo: "/placeholder.svg?height=100&width=100",
    },
  ]

  const stats = {
    totalReports: 156,
    pendingReports: 23,
    verifiedReports: 89,
    resolvedReports: 44,
    activeUsers: 1247,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "verified":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      case "extreme":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = (reportId: number, newStatus: string) => {
    // In a real app, this would update the database
    console.log(`Updating report ${reportId} to status: ${newStatus}`)
  }

  const filteredReports = hazardReports.filter((report) => {
    const matchesSearch =
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || report.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage hazard reports and monitor trail safety</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.totalReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold">{stats.verifiedReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold">{stats.resolvedReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Hazard Reports Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "verified" ? "default" : "outline"}
                  onClick={() => setStatusFilter("verified")}
                  size="sm"
                >
                  Verified
                </Button>
                <Button
                  variant={statusFilter === "resolved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("resolved")}
                  size="sm"
                >
                  Resolved
                </Button>
              </div>
            </div>

            {/* Reports Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={report.photo || "/placeholder.svg"}
                            alt="Hazard"
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium capitalize">{report.type.replace("_", " ")}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{report.description}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{report.location}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={getSeverityColor(report.severity)}>{report.severity}</Badge>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </TableCell>

                      <TableCell>{report.reportedBy}</TableCell>

                      <TableCell>{report.reportedAt.toLocaleDateString()}</TableCell>

                      <TableCell>
                        <div className="flex space-x-1">
                          {report.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(report.id, "verified")}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(report.id, "rejected")}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {report.status === "verified" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(report.id, "resolved")}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
