import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  CreditCard,
  Building2,
  Plus,
  Trash2,
  CheckCircle,
  ArrowLeft,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function DriverPayments() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("wallet");
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user");
    }
  };

  // Fetch wallet
  const { data: wallet } = useQuery({
    queryKey: ["wallet", user?.email],
    queryFn: async () => {
  const wallets = await joltcab.entities.Wallet.filter({ user_email: user.email });
      if (wallets[0]) return wallets[0];
      
  return await joltcab.entities.Wallet.create({
        user_email: user.email,
        balance: 0,
        currency: "USD",
      });
    },
    enabled: !!user,
  });

  // Fetch payment methods
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ["paymentMethods", user?.email],
  queryFn: () => joltcab.entities.PaymentMethod.filter({ user_email: user.email }),
    enabled: !!user,
  });

  // Fetch driver profile
  const { data: driverProfile } = useQuery({
    queryKey: ["driverProfile", user?.email],
    queryFn: async () => {
  const profiles = await joltcab.entities.DriverProfile.filter({ user_email: user.email });
      return profiles[0] || null;
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => window.location.href = createPageUrl("DriverDashboard")}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Methods 💳</h1>
              <p className="text-white/90">Manage your wallet, cards, and bank details</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallet" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Bank Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <WalletSection wallet={wallet} user={user} />
        </TabsContent>

        <TabsContent value="cards">
          <CardsSection 
            paymentMethods={paymentMethods} 
            user={user} 
            queryClient={queryClient}
          />
        </TabsContent>

        <TabsContent value="bank">
          <BankDetailsSection 
            driverProfile={driverProfile} 
            user={user}
            queryClient={queryClient}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// WALLET SECTION
// ============================================
function WalletSection({ wallet, user }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const addFundsMutation = useMutation({
    mutationFn: async (amount) => {
  const { data } = await joltcab.functions.invoke("stripePaymentIntent", {
        amount: parseFloat(amount),
        currency: "usd",
        description: "Add funds to wallet",
      });

      if (data.success) {
        const newBalance = (wallet?.balance || 0) + parseFloat(amount);
  await joltcab.entities.Wallet.update(wallet.id, { balance: newBalance });

  await joltcab.entities.Transaction.create({
          user_email: user.email,
          type: "deposit",
          amount: parseFloat(amount),
          currency: "USD",
          payment_method: "stripe",
          status: "completed",
          reference: data.payment_intent_id,
          description: "Added funds to wallet",
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      setShowAddDialog(false);
      setAmount("");
    },
  });

  const handleAddFunds = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    addFundsMutation.mutate(amount);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[#15B46A] to-[#0F9456] text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-2">Current Balance</p>
              <h2 className="text-5xl font-bold">
                ${wallet?.balance?.toFixed(2) || "0.00"}
              </h2>
              <p className="text-white/60 mt-2 text-sm">{wallet?.currency || "USD"}</p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-10 h-10" />
            </div>
          </div>

          <Button
            onClick={() => setShowAddDialog(true)}
            className="mt-6 bg-white text-[#15B46A] hover:bg-gray-100 w-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Funds
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTransactions userEmail={user?.email} />
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Amount (USD)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>

            <div className="flex gap-2">
              {[10, 25, 50, 100].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset.toString())}
                >
                  ${preset}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFunds}
                className="bg-[#15B46A] hover:bg-[#0F9456]"
                disabled={addFundsMutation.isPending}
              >
                {addFundsMutation.isPending ? "Processing..." : "Add Funds"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================
// CARDS SECTION (simplified without Stripe Elements)
// ============================================
function CardsSection({ paymentMethods, user, queryClient }) {
  const deleteMutation = useMutation({
  mutationFn: (cardId) => joltcab.entities.PaymentMethod.delete(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (cardId) => {
      await Promise.all(
        paymentMethods.map((pm) =>
  joltcab.entities.PaymentMethod.update(pm.id, { is_default: false })
        )
      );
  return joltcab.entities.PaymentMethod.update(cardId, { is_default: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const handleDelete = (cardId) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    deleteMutation.mutate(cardId);
  };

  return (
    <div className="space-y-6">
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No cards added yet
            </h3>
            <p className="text-gray-600 mb-6">
              Cards can be added through the Stripe dashboard or during checkout
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {paymentMethods.map((card) => (
            <Card key={card.id} className="relative">
              <CardContent className="p-6">
                {card.is_default && (
                  <Badge className="absolute top-4 right-4 bg-[#15B46A]">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#15B46A] to-[#0F9456] rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 capitalize">
                      {card.brand} •••• {card.last4}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {card.is_default ? "Default card" : "Backup card"}
                    </p>

                    <div className="flex gap-2 mt-4">
                      {!card.is_default && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDefaultMutation.mutate(card.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// BANK DETAILS SECTION
// ============================================
function BankDetailsSection({ driverProfile, user, queryClient }) {
  const [formData, setFormData] = useState({
    bank_account_holder: driverProfile?.bank_account_holder || "",
    bank_routing_number: driverProfile?.bank_routing_number || "",
    bank_account_number: driverProfile?.bank_account_number || "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const updateBankMutation = useMutation({
    mutationFn: async (data) => {
      if (driverProfile) {
  return await joltcab.entities.DriverProfile.update(driverProfile.id, data);
      } else {
  return await joltcab.entities.DriverProfile.create({
          user_email: user.email,
          ...data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverProfile"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBankMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[#15B46A]" />
          Bank Account Details
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Add your bank details to receive your driver earnings
        </p>
      </CardHeader>

      <CardContent>
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">Bank details saved successfully!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Account Holder Name *</Label>
              <Input
                placeholder="John Doe"
                value={formData.bank_account_holder}
                onChange={(e) =>
                  setFormData({ ...formData, bank_account_holder: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Routing Number *</Label>
              <Input
                placeholder="110000000"
                value={formData.bank_routing_number}
                onChange={(e) =>
                  setFormData({ ...formData, bank_routing_number: e.target.value })
                }
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                9-digit routing number
              </p>
            </div>

            <div className="md:col-span-2">
              <Label>Account Number *</Label>
              <Input
                type="password"
                placeholder="••••••••••"
                value={formData.bank_account_number}
                onChange={(e) =>
                  setFormData({ ...formData, bank_account_number: e.target.value })
                }
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Your account number is encrypted and secure
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Why do we need this?</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>To transfer your driver earnings directly to your bank</li>
                  <li>Payouts are processed weekly or on-demand</li>
                  <li>All information is encrypted and secure</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="submit"
              className="bg-[#15B46A] hover:bg-[#0F9456]"
              disabled={updateBankMutation.isPending}
            >
              {updateBankMutation.isPending ? "Saving..." : "Save Bank Details"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================
// RECENT TRANSACTIONS
// ============================================
function RecentTransactions({ userEmail }) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", userEmail],
    queryFn: () =>
  joltcab.entities.Transaction.filter(
        { user_email: userEmail },
        "-created_date",
        10
      ),
    enabled: !!userEmail,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-[#15B46A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <p className="font-medium text-gray-900 capitalize">
              {tx.type.replace("_", " ")}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(tx.created_date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${
                tx.amount >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
            </p>
            <Badge
              variant="outline"
              className={
                tx.status === "completed"
                  ? "border-green-200 text-green-700"
                  : "border-yellow-200 text-yellow-700"
              }
            >
              {tx.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}