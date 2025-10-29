import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Wallet, ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp,
  Loader2, Download, Plus, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";

export default function PartnerWallet() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      if (userData.role !== 'partner') {
        window.location.href = createPageUrl('Home');
        return;
      }

      const profiles = await base44.entities.PartnerProfile.filter({
        user_email: userData.email
      });
      
      if (profiles[0]) {
        setProfile(profiles[0]);
      }

      // Get wallet
      const wallets = await base44.entities.Wallet.filter({
        user_email: userData.email
      });

      if (wallets[0]) {
        setWallet(wallets[0]);
      } else {
        // Create wallet if doesn't exist
        const newWallet = await base44.entities.Wallet.create({
          user_email: userData.email,
          balance: 0,
          currency: 'USD'
        });
        setWallet(newWallet);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['partnerTransactions', user?.email],
    queryFn: async () => {
      const txns = await base44.entities.Transaction.filter({
        user_email: user?.email
      }, '-created_date', 50);
      return txns;
    },
    enabled: !!user,
  });

  // Withdraw mutation
  const withdrawMutation = useMutation({
    mutationFn: async (amount) => {
      if (!wallet || !profile) throw new Error('Wallet or profile not found');
      
      if (amount <= 0) throw new Error('Invalid amount');
      if (amount > wallet.balance) throw new Error('Insufficient balance');
      
      if (!profile.bank_account_number) {
        throw new Error('Please add bank details first');
      }

      // Create withdrawal transaction
      const transaction = await base44.entities.Transaction.create({
        user_email: user.email,
        type: 'withdrawal',
        amount: -amount,
        currency: wallet.currency,
        payment_method: 'wallet',
        status: 'pending',
        description: `Withdrawal to bank account ending in ${profile.bank_account_number.slice(-4)}`
      });

      // Update wallet balance
      await base44.entities.Wallet.update(wallet.id, {
        balance: wallet.balance - amount
      });

      // Notify admin
      await base44.functions.invoke('notifyAdmin', {
        type: 'withdrawal_request',
        data: {
          partner_email: user.email,
          partner_name: `${profile.first_name} ${profile.last_name}`,
          amount: amount,
          transaction_id: transaction.id
        }
      });

      return transaction;
    },
    onSuccess: () => {
      alert('Withdrawal request submitted! Funds will be transferred within 2-3 business days.');
      setShowWithdrawDialog(false);
      setWithdrawAmount("");
      queryClient.invalidateQueries(['partnerTransactions']);
      loadUser();
    },
    onError: (error) => {
      alert('Withdrawal failed: ' + error.message);
    }
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    withdrawMutation.mutate(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  const pendingWithdrawals = transactions.filter(t => 
    t.type === 'withdrawal' && t.status === 'pending'
  );

  const completedWithdrawals = transactions.filter(t => 
    t.type === 'withdrawal' && t.status === 'completed'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">
            Manage your commission balance and withdrawals
          </p>
        </div>
        <Button
          onClick={() => {
            if (!profile?.bank_account_number) {
              alert('Please add bank details first');
              window.location.href = createPageUrl('PartnerBankDetails');
              return;
            }
            setShowWithdrawDialog(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <ArrowUpRight className="w-5 h-5 mr-2" />
          Withdraw Funds
        </Button>
      </motion.div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 mb-2">Available Balance</p>
              <h2 className="text-5xl font-bold mb-4">
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </h2>
              <p className="text-green-100 text-sm">
                {wallet?.currency || 'USD'}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8" />
            </div>
          </div>

          {pendingWithdrawals.length > 0 && (
            <div className="mt-6 pt-6 border-t border-green-400/30">
              <p className="text-green-100 text-sm">
                Pending withdrawals: ${pendingWithdrawals.reduce((sum, t) => sum + Math.abs(t.amount), 0).toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Earned</p>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${transactions
                .filter(t => t.type === 'commission' && t.status === 'completed')
                .reduce((sum, t) => sum + t.amount, 0)
                .toFixed(2)
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Withdrawn</p>
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${completedWithdrawals
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                .toFixed(2)
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${pendingWithdrawals
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                .toFixed(2)
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Transaction History</span>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        {format(new Date(txn.created_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {txn.type === 'withdrawal' ? (
                            <ArrowUpRight className="w-4 h-4 text-red-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-green-500" />
                          )}
                          <span className="capitalize">{txn.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {txn.description || 'N/A'}
                      </TableCell>
                      <TableCell className={`font-semibold ${
                        txn.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.amount >= 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          txn.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : txn.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {txn.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Available Balance</p>
              <p className="text-3xl font-bold text-gray-900">
                ${wallet?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={wallet?.balance || 0}
                  className="pl-10"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum withdrawal: $10.00
              </p>
            </div>

            {profile?.bank_account_number && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Withdrawal to:</strong>
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {profile.bank_name} - ****{profile.bank_account_number.slice(-4)}
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Funds will be transferred within 2-3 business days
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleWithdraw}
                disabled={withdrawMutation.isPending || !withdrawAmount || parseFloat(withdrawAmount) < 10}
                className="bg-green-600 hover:bg-green-700"
              >
                {withdrawMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Withdraw ${withdrawAmount || '0.00'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}