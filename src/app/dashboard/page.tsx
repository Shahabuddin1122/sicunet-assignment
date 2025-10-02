'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-background shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-foreground-muted">Welcome, {user?.username}</span>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="text-primary">Welcome to Your Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground-muted">
                You have successfully logged in to the system. This is your protected dashboard area.
              </p>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,234</div>
              <p className="text-sm text-foreground-muted">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">$45,678</div>
              <p className="text-sm text-foreground-muted">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">567</div>
              <p className="text-sm text-foreground-muted">+23% from last month</p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-background-secondary rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">User login successful</p>
                    <p className="text-xs text-foreground-muted">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-background-secondary rounded-lg">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">System updated</p>
                    <p className="text-xs text-foreground-muted">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-background-secondary rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Maintenance scheduled</p>
                    <p className="text-xs text-foreground-muted">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
