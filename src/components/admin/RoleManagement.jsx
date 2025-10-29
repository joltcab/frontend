import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { joltcab } from "@/lib/joltcab-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Eye,
  AlertCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function RoleManagement() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewingRole, setViewingRole] = useState(null);
  const queryClient = useQueryClient();

  // Fetch roles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => joltcab.entities.Role.list(),
  });

  // Initialize/Update roles
  const seedRolesMutation = useMutation({
    mutationFn: async () => {
      const response = await joltcab.entities.Role.seed();
      if (!response.success) {
        throw new Error(response.error || 'Failed to initialize roles');
      }
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setMessage({ 
        type: 'success', 
        text: `✓ ${data.message || 'Roles initialized successfully!'}`
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    },
    onError: (error) => {
      setMessage({ 
        type: 'error', 
        text: `❌ ${error.message}` 
      });
    },
  });

  // Update role status
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }) => joltcab.entities.Role.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setMessage({ type: 'success', text: '✓ Role updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    },
  });

  const getRoleLevelColor = (level) => {
    if (level >= 100) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (level >= 80) return 'bg-red-100 text-red-800 border-red-300';
    if (level >= 60) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-blue-100 text-blue-800 border-blue-300';
  };

  const countPermissions = (permissions) => {
    if (!permissions || typeof permissions !== 'object') return 0;
    
    let count = 0;
    try {
      Object.values(permissions).forEach(resource => {
        if (resource && typeof resource === 'object') {
          Object.values(resource).forEach(action => {
            if (action === true) count++;
          });
        }
      });
    } catch (error) {
      console.error('Error counting permissions:', error);
      return 0;
    }
    return count;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#15B46A]" />
            Roles & Permissions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage system roles and their permissions (RBAC)
          </p>
        </div>

        <Button
          onClick={() => seedRolesMutation.mutate()}
          disabled={seedRolesMutation.isPending}
          className="bg-[#15B46A] hover:bg-[#0F9456] text-white"
        >
          {seedRolesMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Initialize/Update Roles
            </>
          )}
        </Button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <Alert className={`${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                About RBAC System
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• <strong>Super Admin (Level 100):</strong> Full access to ALL resources and actions</li>
                <li>• <strong>Administrator (Level 80):</strong> General administrative access</li>
                <li>• <strong>Operations Manager (Level 70):</strong> Daily operations management</li>
                <li>• <strong>Finance Manager (Level 65):</strong> Payment and financial reports</li>
                <li>• <strong>Support Manager (Level 60):</strong> Customer support and tickets</li>
                <li>• <strong>Support Agent (Level 40):</strong> Handle support tickets</li>
                <li>• <strong>Data Analyst (Level 30):</strong> View reports and analytics</li>
                <li>• <strong>Content Moderator (Level 20):</strong> Review content and documents</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.sort((a, b) => (b.level || 0) - (a.level || 0)).map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={`${getRoleLevelColor(role.level || 0)} border`}>
                  Level {role.level || 0}
                </Badge>
                {role.name === 'super_admin' && (
                  <Badge className="bg-purple-600 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    SUPER
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{role.display_name || role.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {role.description || 'No description'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Permissions:</span>
                <span className="font-semibold text-[#15B46A]">
                  {countPermissions(role.permissions)} granted
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`active-${role.id}`} className="text-sm">Active</Label>
                  <Switch
                    id={`active-${role.id}`}
                    checked={role.is_active !== false}
                    onCheckedChange={(checked) => {
                      updateRoleMutation.mutate({
                        id: role.id,
                        data: { is_active: checked }
                      });
                    }}
                  />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingRole(role)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{role.display_name || role.name} - Permissions</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-4">
                        {role.permissions && typeof role.permissions === 'object' && Object.entries(role.permissions).map(([resource, actions]) => (
                          <Card key={resource}>
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm capitalize">
                                {resource.replace(/_/g, ' ')}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <div className="flex flex-wrap gap-2">
                                {actions && typeof actions === 'object' && Object.entries(actions).map(([action, allowed]) => (
                                  <Badge
                                    key={action}
                                    variant={allowed ? "default" : "secondary"}
                                    className={allowed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                                  >
                                    {allowed ? (
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                    ) : (
                                      <XCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {action}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {roles.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Roles Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click "Initialize/Update Roles" to create the default system roles
            </p>
            <Button
              onClick={() => seedRolesMutation.mutate()}
              disabled={seedRolesMutation.isPending}
              className="bg-[#15B46A] hover:bg-[#0F9456] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Initialize Roles
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}