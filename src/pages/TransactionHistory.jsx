import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, Download, TrendingUp, TrendingDown, Loader2,
  Calendar, ArrowUpRight, ArrowDownRight, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function TransactionHistory() {
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

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

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', user?.email],
  queryFn: () => joltcab.entities.Transaction.filter({ user_email: user?.email }, '-created_date', 100),
    enabled: !!user,
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.email],
    queryFn: async () => {
  const wallets = await joltcab.entities.Wallet.filter({ user_email: user?.email });
      return wallets[0];
    },
    enabled: !!user,
  });

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const stats = {
    totalIn: transactions
      .filter(t => ['deposit', 'ride_payment', 'refund'].includes(t.type) && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    totalOut: transactions
      .filter(t => ['withdrawal', 'commission'].includes(t.type) && t.status === 'completed')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
    pending: transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + (t.amount || 0), 0),
  };

  const getTransactionIcon = (type) => {
    const isIncoming = ['deposit', 'ride_payment', 'refund'].includes(type);
    return isIncoming ? (
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <ArrowDownRight className="w-5 h-5 text-green-600" />
      </div>
    ) : (
      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
        <ArrowUpRight className="w-5 h-5 text-red-600" />
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const exportToCSV = () => {
    const csvData = filteredTransactions.map(t => ({
      Date: format(new Date(t.created_date), 'yyyy-MM-dd HH:mm'),
      Type: t.type,
      Amount: t.amount,
      Status: t.status,
      Method: t.payment_method || '',
      Reference: t.reference || '',
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
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
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#15B46A] to-[#0F9456] rounded-3xl p-8 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-white/90">Track all your payments and earnings</p>
        </motion.div>

        {/* Wallet Balance */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-2">Current Balance</p>
                <p className="text-5xl font-bold">${wallet?.balance?.toFixed(2) || '0.00'}</p>
              </div>
              <DollarSign className="w-16 h-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Received</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    ${stats.totalIn.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    ${stats.totalOut.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    ${stats.pending.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
              <Button
                variant="outline"
                onClick={exportToCSV}
                disabled={filteredTransactions.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={filter} onValueChange={setFilter} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposit">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
                <TabsTrigger value="ride_payment">Rides</TabsTrigger>
                <TabsTrigger value="refund">Refunds</TabsTrigger>
              </TabsList>
            </Tabs>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#15B46A] animate-spin" />
                <p className="text-gray-600">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</p>
                <p className="text-gray-600">Your transaction history will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-semibold text-gray-900 capitalize">
                              {transaction.type.replace('_', ' ')}
                            </p>
                            {transaction.description && (
                              <p className="text-sm text-gray-600">{transaction.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500">
                                {format(new Date(transaction.created_date), 'MMM d, yyyy • h:mm a')}
                              </p>
                              {transaction.payment_method && (
                                <Badge variant="outline" className="text-xs">
                                  {transaction.payment_method}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            ['deposit', 'ride_payment', 'refund'].includes(transaction.type)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}>
                            {['deposit', 'ride_payment', 'refund'].includes(transaction.type) ? '+' : '-'}
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}