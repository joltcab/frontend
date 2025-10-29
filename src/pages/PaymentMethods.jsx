import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddPaymentMethodDialog from "../components/payment/AddPaymentMethodDialog";

export default function PaymentMethods() {
  const [user, setUser] = React.useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['paymentMethods', user?.email],
    queryFn: () => base44.entities.PaymentMethod.filter({ user_email: user?.email }),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PaymentMethod.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (methodId) => {
      // Primero quitar default de todos
      for (const method of paymentMethods) {
        if (method.is_default) {
          await base44.entities.PaymentMethod.update(method.id, { is_default: false });
        }
      }
      // Luego establecer el nuevo default
      await base44.entities.PaymentMethod.update(methodId, { is_default: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });

  const getBrandIcon = (brand) => {
    const icons = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
      paypal: "🅿️",
    };
    return icons[brand.toLowerCase()] || "💳";
  };

  const getBrandColor = (brand) => {
    const colors = {
      visa: "from-blue-500 to-blue-600",
      mastercard: "from-red-500 to-orange-500",
      amex: "from-blue-700 to-blue-800",
      discover: "from-orange-500 to-orange-600",
      paypal: "from-blue-600 to-blue-700",
    };
    return colors[brand.toLowerCase()] || "from-gray-500 to-gray-600";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-[#15B46A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Payment Methods</h1>
          <p className="text-white/90">Manage your payment options</p>
        </motion.div>

        {/* Add Payment Method Button */}
        <Button
          onClick={() => setShowAddDialog(true)}
          className="w-full h-16 bg-[#15B46A] hover:bg-[#0F9456] text-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Payment Method
        </Button>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#15B46A] animate-spin" />
                <p className="text-gray-600">Loading payment methods...</p>
              </CardContent>
            </Card>
          ) : paymentMethods.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-semibold text-gray-900 mb-2">No payment methods yet</p>
                <p className="text-gray-600 mb-4">Add a payment method to start booking rides</p>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-r ${getBrandColor(method.brand)} p-6 text-white relative`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{getBrandIcon(method.brand)}</span>
                            <div>
                              <p className="text-2xl font-bold">{method.brand.toUpperCase()}</p>
                              <p className="text-white/80 text-sm">•••• {method.last4}</p>
                            </div>
                          </div>
                          {method.is_default && (
                            <Badge className="bg-yellow-400 text-yellow-900 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              Default
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute bottom-6 right-6 opacity-20">
                          <CreditCard className="w-24 h-24" />
                        </div>
                      </div>

                      <div className="p-4 bg-white flex gap-2">
                        {!method.is_default && (
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDefaultMutation.mutate(method.id)}
                            disabled={setDefaultMutation.isPending}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Set as Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            if (confirm(`Remove ${method.brand} •••• ${method.last4}?`)) {
                              deleteMutation.mutate(method.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#15B46A]" />
              Accepted Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl mb-2">💳</p>
                <p className="text-sm font-semibold">Visa</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl mb-2">💳</p>
                <p className="text-sm font-semibold">Mastercard</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl mb-2">💳</p>
                <p className="text-sm font-semibold">Amex</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl mb-2">🅿️</p>
                <p className="text-sm font-semibold">PayPal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Dialog */}
      {showAddDialog && (
        <AddPaymentMethodDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          userEmail={user.email}
        />
      )}
    </div>
  );
}