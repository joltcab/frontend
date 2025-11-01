import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Wallet as WalletIcon,
  Plus,
  Minus,
  CreditCard,
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Wallet() {
  const [user, setUser] = useState(null);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState("");
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

  const { data: wallet } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
  const wallets = await joltcab.entities.Wallet.filter({ user_email: user?.email });
      if (wallets.length === 0) {
        // Create wallet if doesn't exist
  const newWallet = await joltcab.entities.Wallet.create({
          user_email: user?.email,
          balance: 0,
          currency: "USD",
        });
        return [newWallet];
      }
      return wallets;
    },
    enabled: !!user,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
  queryFn: () => joltcab.entities.Transaction.filter({ user_email: user?.email }, "-created_date", 20),
    enabled: !!user,
  });

  const addFundsMutation = useMutation({
    mutationFn: async (amount) => {
      // TODO: Connect to your backend Stripe/PayPal integration
      // For now just creating a transaction record
  await joltcab.entities.Transaction.create({
        user_email: user?.email,
        type: "deposit",
        amount: parseFloat(amount),
        currency: "USD",
        payment_method: "stripe",
        status: "completed",
        description: "Wallet deposit",
      });

      // Update wallet balance
      const currentWallet = wallet[0];
  await joltcab.entities.Wallet.update(currentWallet.id, {
        balance: currentWallet.balance + parseFloat(amount),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wallet"]);
      queryClient.invalidateQueries(["transactions"]);
      setAmount("");
      setShowAddFunds(false);
      alert("Funds added successfully!");
    },
  });

  const handleAddFunds = (paymentMethod) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // TODO: Open Stripe or PayPal payment modal
    // For now just simulating the transaction
    addFundsMutation.mutate(amount);
  };

  const currentBalance = wallet?.[0]?.balance || 0;

  return (
    <div className="space-y-8">
      {/* Wallet Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] text-white border-0 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/80 mb-2">Current Balance</p>
                <h2 className="text-5xl font-bold mb-4">
                  ${currentBalance.toFixed(2)}
                </h2>
                <p className="text-white/80 text-sm">USD</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <WalletIcon className="w-8 h-8" />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={() => setShowAddFunds(!showAddFunds)}
                className="flex-1 bg-white text-[#15B46A] hover:bg-gray-100 py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Funds
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent border-2 border-white text-white hover:bg-white/10 py-6"
              >
                <Minus className="w-5 h-5 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        </Card>
      </motion.div>

      {/* Add Funds Form */}
      {showAddFunds && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount (USD)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setAmount("10")}
                  className="flex-1"
                >
                  $10
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAmount("25")}
                  className="flex-1"
                >
                  $25
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAmount("50")}
                  className="flex-1"
                >
                  $50
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAmount("100")}
                  className="flex-1"
                >
                  $100
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-4">Select payment method:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAddFunds("stripe")}
                    disabled={addFundsMutation.isLoading}
                    className="h-20 bg-[#635BFF] hover:bg-[#5449E0] text-white"
                  >
                    <CreditCard className="w-6 h-6 mr-3" />
                    Pay with Card (Stripe)
                  </Button>
                  <Button
                    onClick={() => handleAddFunds("paypal")}
                    disabled={addFundsMutation.isLoading}
                    className="h-20 bg-[#0070BA] hover:bg-[#005EA6] text-white"
                  >
                    <img
                      src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                      alt="PayPal"
                      className="w-6 h-6 mr-3"
                    />
                    Pay with PayPal
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#15B46A]" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const isIncome = ["deposit", "refund"].includes(transaction.type);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#15B46A] hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isIncome ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {isIncome ? (
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 capitalize">
                        {transaction.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_date).toLocaleDateString()} at{" "}
                        {new Date(transaction.created_date).toLocaleTimeString()}
                      </p>
                      {transaction.description && (
                        <p className="text-xs text-gray-400 mt-1">{transaction.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}