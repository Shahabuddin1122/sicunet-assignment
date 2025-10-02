'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import userService from '@/services/userService'
import { User } from '@/types/user'

export default function DashboardPage() {
  const { user: currentUser, logout } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const usersPerPage = 6

  const handleLogout = () => {
    logout()
  }

  const fetchUsers = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const skip = (page - 1) * usersPerPage
      const response = await userService.getUsers(skip, usersPerPage)
      setUsers(response.users)
      setTotalUsers(response.total)
      setTotalPages(Math.ceil(response.total / usersPerPage))
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleUserClick = (userId: number) => {
    router.push(`/dashboard/users/${userId}`)
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      setDeleting(userId)
      await userService.deleteUser(userId)
      // Refresh the current page data
      await fetchUsers(currentPage)
      setShowDeleteConfirm(null)
    } catch (err: any) {
      setError(err.message || 'Failed to delete user')
      setShowDeleteConfirm(null)
    } finally {
      setDeleting(null)
    }
  }

  const confirmDelete = (userId: number) => {
    setShowDeleteConfirm(userId)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-background shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-end sm:justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground hidden sm:block">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-foreground-muted">Welcome, {currentUser?.username}</span>
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
        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-primary">Welcome to Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground-muted">
              You have successfully logged in to the system. This is your protected dashboard area.
            </p>
          </CardContent>
        </Card>

        {/* User List Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>User List</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-normal text-foreground-muted">
                  Total: {totalUsers} users
                </span>
                <Button 
                  onClick={() => router.push('/dashboard/users/add')}
                  size="sm"
                >
                  Add User
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-foreground-muted">Loading users...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => fetchUsers(currentPage)} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                {/* User Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {users.map((user) => (
                    <Card 
                      key={user.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform relative group"
                      onClick={() => handleUserClick(user.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-foreground-muted truncate">
                              @{user.username}
                            </p>
                            <p className="text-xs text-foreground-muted">
                              {user.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {user.gender}
                              </span>
                              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                                {user.age} years
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/dashboard/users/${user.id}/edit`)
                            }}
                            variant="outline"
                            size="sm"
                            className="w-6 h-6 px-4 text-xs"
                          >
                            edit
                          </Button>
                          {/* Only show delete button if user is not deleting their own account */}
                          {user.id !== currentUser?.id && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                confirmDelete(user.id)
                              }}
                              variant="destructive"
                              size="sm"
                              className="w-6 h-6 p-0"
                              disabled={deleting === user.id}
                            >
                              {deleting === user.id ? '...' : '×'}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-destructive">Confirm Delete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground-muted mb-4">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    onClick={cancelDelete} 
                    variant="outline"
                    disabled={deleting !== null}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleDeleteUser(showDeleteConfirm)} 
                    variant="destructive"
                    disabled={deleting !== null}
                  >
                    {deleting !== null ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
