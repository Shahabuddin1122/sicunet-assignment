'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import userService from '@/services/userService'
import { User } from '@/types/user'

export default function UserDetailPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [userDetail, setUserDetail] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string

  const handleLogout = () => {
    logout()
  }

  const fetchUserDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const user = await userService.getUserById(parseInt(userId))
      setUserDetail(user)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserDetail()
    }
  }, [userId])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-background shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-end sm:justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground hidden sm:block">User Details</h1>
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
        {/* Back Button */}
        <div className="mb-6">
          <Button onClick={handleBack} variant="outline" className="mb-4">
            ← Back to Dashboard
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-foreground-muted">Loading user details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchUserDetail} variant="outline">
              Try Again
            </Button>
          </div>
        ) : userDetail ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-primary">Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <img
                  src={userDetail.image}
                  alt={`${userDetail.firstName} ${userDetail.lastName}`}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {userDetail.firstName} {userDetail.lastName}
                </h2>
                <p className="text-foreground-muted mb-4">@{userDetail.username}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Age:</span>
                    <span className="font-medium">{userDetail.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Gender:</span>
                    <span className="font-medium">{userDetail.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Blood Group:</span>
                    <span className="font-medium">{userDetail.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Height:</span>
                    <span className="font-medium">{userDetail.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Weight:</span>
                    <span className="font-medium">{userDetail.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Eye Color:</span>
                    <span className="font-medium">{userDetail.eyeColor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Email</h4>
                      <p className="text-foreground-muted">{userDetail.email}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Phone</h4>
                      <p className="text-foreground-muted">{userDetail.phone}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Birth Date</h4>
                      <p className="text-foreground-muted">{new Date(userDetail.birthDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Address</h4>
                      <p className="text-foreground-muted">
                        {userDetail.address.address}<br />
                        {userDetail.address.city}, {userDetail.address.state} {userDetail.address.postalCode}<br />
                        {userDetail.address.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">University</h4>
                      <p className="text-foreground-muted">{userDetail.university}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Characteristics */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-primary">Physical Characteristics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Hair</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-muted">Color: {userDetail.hair.color}</p>
                      <p className="text-sm text-foreground-muted">Type: {userDetail.hair.type}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Body Measurements</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-muted">Height: {userDetail.height} cm</p>
                      <p className="text-sm text-foreground-muted">Weight: {userDetail.weight} kg</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-primary">Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Company</h4>
                      <p className="text-foreground-muted">{userDetail.company.name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Department</h4>
                      <p className="text-foreground-muted">{userDetail.company.department}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Title</h4>
                      <p className="text-foreground-muted">{userDetail.company.title}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Company Address</h4>
                      <p className="text-foreground-muted">
                        {userDetail.company.address.address}<br />
                        {userDetail.company.address.city}, {userDetail.company.address.state}<br />
                        {userDetail.company.address.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Role</h4>
                      <p className="text-foreground-muted">{userDetail.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-primary">Financial Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Bank Details</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-muted">Card Type: {userDetail.bank.cardType}</p>
                      <p className="text-sm text-foreground-muted">Currency: {userDetail.bank.currency}</p>
                      <p className="text-sm text-foreground-muted">Expires: {userDetail.bank.cardExpire}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Crypto Wallet</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-muted">Coin: {userDetail.crypto.coin}</p>
                      <p className="text-sm text-foreground-muted">Network: {userDetail.crypto.network}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Technical Info</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-foreground-muted">IP: {userDetail.ip}</p>
                      <p className="text-sm text-foreground-muted">MAC: {userDetail.macAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </main>
    </div>
  )
}
