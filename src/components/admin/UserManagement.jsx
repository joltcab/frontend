
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Mail, Phone, Shield, Ban, Edit } from "lucide-react";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: allUsers = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list('-created_date', 100),
  });

  // FILTRAR: Solo mostrar users que NO sean admins
  const users = allUsers.filter(user => user.role !== 'admin');

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }) => base44.entities.User.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
      setEditDialogOpen(false);
      setEditingUser(null);
    },
  });

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      full_name: user.full_name || '',
      phone: user.phone || '',
      city: user.city || '',
      country: user.country || '',
    });
    setEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    
    updateUserMutation.mutate({
      userId: editingUser.id,
      data: {
        full_name: editingUser.full_name,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status,
        city: editingUser.city,
        country: editingUser.country,
      }
    });
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const colors = {
      user: "bg-blue-100 text-blue-800",
      driver: "bg-green-100 text-green-800",
      corporate: "bg-purple-100 text-purple-800",
      hotel: "bg-orange-100 text-orange-800",
      dispatcher: "bg-gray-100 text-gray-800",
      partner: "bg-pink-100 text-pink-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="w-5 h-5" />
            User Management ({users.length} total users)
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Regular users, drivers, corporate accounts, hotels, and dispatchers. Admins are managed separately.
          </p>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all bg-white dark:bg-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.full_name || "Unknown User"}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadge(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge className={getStatusBadge(user.status)}>
                      {user.status}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    {user.status === 'suspended' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserMutation.mutate({
                          userId: user.id,
                          data: { status: 'active' }
                        })}
                        className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Activate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900"
                        onClick={() => updateUserMutation.mutate({
                          userId: user.id,
                          data: { status: 'suspended' }
                        })}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit User Profile</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Full Name</Label>
                <Input
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">Email</Label>
                <Input
                  value={editingUser.email}
                  disabled
                  className="bg-gray-100 dark:bg-gray-600 dark:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">Phone</Label>
                <Input
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  className="dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">City</Label>
                  <Input
                    value={editingUser.city}
                    onChange={(e) => setEditingUser({...editingUser, city: e.target.value})}
                    className="dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">Country</Label>
                  <Input
                    value={editingUser.country}
                    onChange={(e) => setEditingUser({...editingUser, country: e.target.value})}
                    className="dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-gray-300">Status</Label>
                <Select
                  value={editingUser.status}
                  onValueChange={(value) => setEditingUser({...editingUser, status: value})}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="dark:border-gray-600">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUser} 
              disabled={updateUserMutation.isPending}
              className="bg-[#15B46A] hover:bg-[#0F9456]"
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
