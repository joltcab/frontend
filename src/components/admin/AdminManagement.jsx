
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield, Users, Plus, Edit, Trash2, Search, UserCog,
  CheckCircle, XCircle, Calendar, Loader2, AlertCircle, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

// URL Permissions Array
const URL_PERMISSIONS = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'today_requests', label: 'Today Requests' },
  { value: 'requests', label: 'All Requests' },
  { value: 'schedules', label: 'Scheduled Rides' },
  { value: 'mapview', label: 'Map View' },
  { value: 'users', label: 'Users Management' },
  { value: 'provider', label: 'Drivers Management' },
  { value: 'corporate', label: 'Corporate Accounts' },
  { value: 'hotel', label: 'Hotel Accounts' },
  { value: 'dispatcher', label: 'Dispatcher Accounts' },
  { value: 'partner', label: 'Partners' },
  { value: 'service_types', label: 'Service Types' },
  { value: 'country', label: 'Countries' },
  { value: 'city', label: 'Cities' },
  { value: 'city_type', label: 'City Type Config' },
  { value: 'promotions', label: 'Promo Codes' },
  { value: 'documents', label: 'Document Types' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'trip_earning', label: 'Trip Earnings' },
  { value: 'daily_earning', label: 'Daily Earnings' },
  { value: 'weekly_earning', label: 'Weekly Earnings' },
  { value: 'wallet_history', label: 'Wallet History' },
  { value: 'transaction_history', label: 'Transaction History' },
  { value: 'pending_payments', label: 'Pending Payments' },
  { value: 'email', label: 'Email Settings' },
  { value: 'sms', label: 'SMS Settings' },
  { value: 'send_mass_notification', label: 'Mass Notifications' },
  { value: 'settings', label: 'System Settings' },
  { value: 'admin_list', label: 'Admin Management' }
];

// Toast Component
function Toast({ message, type, onClose }) {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 ${bgColors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md`}
    >
      {type === 'success' && <CheckCircle className="w-5 h-5" />}
      {type === 'error' && <XCircle className="w-5 h-5" />}
      <p>{message}</p>
      <button onClick={onClose} className="ml-auto">
        <XCircle className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

// Password Dialog
function PasswordDialog({ isOpen, onClose, password }) {
  const [copied, setCopied] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Admin Created Successfully!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>⚠️ Important:</strong> Save this password now!
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-gray-50 rounded-lg border-2">
            <Label className="text-sm text-gray-600">Temporary Password:</Label>
            <div className="flex items-center gap-2 mt-2">
              <code className="flex-1 p-3 bg-white border rounded font-mono text-sm break-all">
                {password}
              </code>
              <Button variant="outline" size="icon" onClick={copyPassword}>
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-[#15B46A] hover:bg-[#0F9456]">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [syncEmail, setSyncEmail] = useState("");
  const [makeSuperAdmin, setMakeSuperAdmin] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [toast, setToast] = useState(null);
  const [passwordDialog, setPasswordDialog] = useState({ isOpen: false, password: '' });
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    type: 1,
    is_active: true
  });
  const queryClient = useQueryClient();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await joltcab.auth.logout();
        // Force redirect to Home page
        window.location.href = createPageUrl("Home");
      } catch (error) {
        console.error("Error logging out:", error);
        showToast("Error logging out: " + error.message, "error");
        // Even if logout fails, redirect to home
        window.location.href = createPageUrl("Home");
      }
    }
  };

  // Use JoltCab API to list admins
  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      try {
        const admins = await joltcab.entities.Admin.list();
        return admins || [];
      } catch (error) {
        console.error('❌ Error loading admins:', error);
        showToast('Failed to load admins: ' + error.message, 'error');
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      return await joltcab.entities.Admin.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      handleCloseDialog();
      showToast("Admin created successfully!", 'success');
    },
    onError: (error) => {
      showToast(`Error: ${error.message}`, 'error');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await joltcab.entities.Admin.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      handleCloseDialog();
      showToast("Admin updated successfully!", 'success');
    },
    onError: (error) => {
      showToast(`Error: ${error.message}`, 'error');
    }
  });

  // Use JoltCab API to delete admin
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await joltcab.entities.Admin.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      showToast("Admin deleted successfully!", 'success');
    },
    onError: (error) => {
      showToast(`Error: ${error.message}`, 'error');
    }
  });

  const upgradeMutation = useMutation({
    mutationFn: async (admin_email) => {
      console.log('🔄 Upgrading admin:', admin_email);
      const response = await joltcab.entities.Admin.upgradeToSuperAdmin(admin_email);
      console.log('📥 Upgrade response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to upgrade admin');
      }
      return response;
    },
    onSuccess: (data) => {
      console.log('✅ Upgrade successful:', data);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      showToast("Admin upgraded to Super Admin!", 'success');
      
      // Forzar recarga después de 1 segundo para asegurar que se vea el cambio
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      }, 1000);
    },
    onError: (error) => {
      console.error('❌ Upgrade error:', error);
      showToast(`Error: ${error.message}`, 'error');
    }
  });

  const syncAdminMutation = useMutation({
    mutationFn: async ({ admin_email, make_super_admin }) => {
      console.log('🔄 Syncing admin:', admin_email, 'as super admin:', make_super_admin);
      
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(admin_email)) {
        throw new Error('Invalid email format');
      }
      
      const response = await joltcab.entities.Admin.sync(admin_email, make_super_admin);
      console.log('📥 Sync response:', response);
      
      // Verificar si el backend retornó error
      if (!response.success) {
        throw new Error(response.error || response.message || 'Failed to sync admin');
      }
      
      return response;
    },
    onSuccess: (data) => {
      console.log('✅ Sync successful, full data:', data);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setIsSyncDialogOpen(false);
      setSyncEmail("");
      
      // Intentar obtener el password de diferentes ubicaciones posibles
      const tempPassword = data.temp_password 
        || data.data?.temp_password 
        || data.password 
        || data.data?.password
        || data.temporary_password
        || data.data?.temporary_password;
      
      console.log('🔑 Temporary password:', tempPassword);
      
      if (tempPassword) {
        setPasswordDialog({ isOpen: true, password: tempPassword });
        showToast('Admin synced successfully! Password generated.', 'success');
      } else {
        console.error('❌ No temporary password found in response');
        showToast('Admin synced but no temporary password received', 'warning');
      }
      
      const adminRole = data.admin?.admin_role || data.data?.admin?.admin_role || 'admin';
      console.log('👤 Admin role:', adminRole);
    },
    onError: (error) => {
      console.error('❌ Sync error:', error);
      
      // Mensajes de error específicos
      let errorMessage = error.message;
      
      if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        errorMessage = '❌ This email does not exist in the system. Please register the user first.';
      } else if (errorMessage.includes('already') || errorMessage.includes('exists')) {
        errorMessage = '⚠️ This user is already an admin.';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = '❌ Invalid email format. Please check the email address.';
      }
      
      showToast(errorMessage, 'error');
    }
  });

  const handleSyncAdmin = () => {
    if (!syncEmail) {
      showToast("Please enter an email address", 'warning');
      return;
    }
    syncAdminMutation.mutate({
      admin_email: syncEmail,
      make_super_admin: makeSuperAdmin
    });
  };

  const handleUpgradeToSuperAdmin = async (admin) => {
    const adminName = admin.username || admin.email || `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || 'this admin';
    if (confirm(`Upgrade "${adminName}" to Super Admin?`)) {
      upgradeMutation.mutate(admin.email);
    }
  };

  const handleOpenDialog = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        email: admin.email,
        password: "",
        first_name: admin.first_name || "",
        last_name: admin.last_name || "",
        type: admin.type,
        is_active: admin.is_active
      });
      setSelectedPermissions(admin.url_array || []);
    } else {
      setEditingAdmin(null);
      setFormData({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        type: 1,
        is_active: true
      });
      setSelectedPermissions([]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAdmin(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      type: 1,
      is_active: true
    });
    setSelectedPermissions([]);
  };

  const togglePermission = (permission) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      showToast("Username and email are required", 'warning');
      return;
    }

    if (!editingAdmin && !formData.password) {
      showToast("Password is required for new admin", 'warning');
      return;
    }

    const submitData = {
      ...formData,
      url_array: selectedPermissions
    };

    if (editingAdmin) {
      updateMutation.mutate({ id: editingAdmin.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleDelete = (admin) => {
    if (confirm(`Delete admin "${admin.username}"?`)) {
      deleteMutation.mutate(admin.id);
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <PasswordDialog
        isOpen={passwordDialog.isOpen}
        onClose={() => setPasswordDialog({ isOpen: false, password: '' })}
        password={passwordDialog.password}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Admin Management ({admins.length} admins)
            </CardTitle>

            <div className="flex items-center gap-2">
              {/* Sync Dialog */}
              <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    Sync Admin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sync Admin from User Entity</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      If an admin exists in the User entity but not in AdminUser, you can sync them here.
                    </p>
                    <div>
                      <Label>Admin Email</Label>
                      <Input
                        type="email"
                        placeholder="admin@example.com"
                        value={syncEmail}
                        onChange={(e) => setSyncEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={makeSuperAdmin}
                        onCheckedChange={setMakeSuperAdmin}
                      />
                      <Label>Make Super Admin</Label>
                    </div>
                    <Button
                      onClick={handleSyncAdmin}
                      disabled={!syncEmail || syncAdminMutation.isPending}
                      className="w-full bg-[#15B46A] hover:bg-[#0F9456]"
                    >
                      {syncAdminMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        "Sync Admin"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Admin Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#15B46A] hover:bg-[#0F9456]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Username *</Label>
                        <Input
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label>Password {!editingAdmin && '*'}</Label>
                        <Input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder={editingAdmin ? "Leave empty to keep current" : "Enter password"}
                          required={!editingAdmin}
                        />
                      </div>

                      <div>
                        <Label>Admin Type</Label>
                        <Select
                          value={String(formData.type)}
                          onValueChange={(v) => setFormData({ ...formData, type: parseInt(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Super Admin (Full Access)</SelectItem>
                            <SelectItem value="1">Regular Admin (Permissions Based)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <Switch
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                      <div>
                        <Label>Account Active</Label>
                        <p className="text-sm text-gray-500">
                          {formData.is_active ? 'Admin can login' : 'Admin cannot login'}
                        </p>
                      </div>
                    </div>

                    {/* Permissions */}
                    {formData.type === 1 && (
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">Permissions</Label>
                        <Alert>
                          <Shield className="w-4 h-4" />
                          <AlertDescription>
                            Select sections this admin can access.
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                          {URL_PERMISSIONS.map(perm => (
                            <div
                              key={perm.value}
                              onClick={() => togglePermission(perm.value)}
                              className={`
                                p-3 rounded-lg border-2 cursor-pointer transition-all
                                ${selectedPermissions.includes(perm.value)
                                  ? 'border-[#15B46A] bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                }
                              `}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`
                                  w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                                  ${selectedPermissions.includes(perm.value)
                                    ? 'border-[#15B46A] bg-[#15B46A]'
                                    : 'border-gray-300'
                                  }
                                `}>
                                  {selectedPermissions.includes(perm.value) && (
                                    <CheckCircle className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="text-sm font-medium">{perm.label}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="text-sm text-gray-500">
                          {selectedPermissions.length} permission(s) selected
                        </p>
                      </div>
                    )}

                    {/* Submit */}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={handleCloseDialog}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="bg-[#15B46A] hover:bg-[#0F9456]"
                      >
                        {(createMutation.isPending || updateMutation.isPending) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingAdmin ? 'Update Admin' : 'Create Admin'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Logout Button */}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <XCircle className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#15B46A]" />
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserCog className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold mb-2">No admins found</p>
              <p className="text-sm">Click "Sync Admin" to sync existing admin users</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAdmins.map((admin, index) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:border-[#15B46A] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold
                      ${admin.type === 0 || admin.admin_role === 'super_admin'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-gradient-to-br from-[#15B46A] to-[#0F9456]'}
                    `}>
                      {admin.first_name?.charAt(0) || admin.username?.charAt(0) || 'A'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {admin.first_name && admin.last_name
                            ? `${admin.first_name} ${admin.last_name}`
                            : admin.username
                          }
                        </p>
                        {(admin.type === 0 || admin.admin_role === 'super_admin') && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Super Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>@{admin.username}</span>
                        <span>•</span>
                        <span>{admin.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {admin.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}

                    {admin.type !== 0 && admin.admin_role !== 'super_admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpgradeToSuperAdmin(admin)}
                        className="text-purple-600 border-purple-200"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Upgrade
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(admin)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200"
                      onClick={() => handleDelete(admin)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
