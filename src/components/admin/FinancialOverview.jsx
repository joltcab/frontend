import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Wallet,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function FinancialOverview({ stats }) {
  const [timeRange, setTimeRange] = useState('7d');

  const { data: transactions = [] } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 200),
  });

  // Calculate financial metrics
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  
  const totalRevenue = completedTransactions
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const todayRevenue = completedTransactions
    .filter(t => new Date(t.created_date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + (t.amount || 0), 0);
    
  const yesterdayRevenue = completedTransactions
    .filter(t => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return new Date(t.created_date).toDateString() === yesterday.toDateString();
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const revenueChange = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
    : 0;

  // Revenue by payment method
  const revenueByMethod = {
    stripe: completedTransactions.filter(t => t.payment_method === 'stripe').reduce((sum, t) => sum + t.amount, 0),
    paypal: completedTransactions.filter(t => t.payment_method === 'paypal').reduce((sum, t) => sum + t.amount, 0),
    cash: completedTransactions.filter(t => t.payment_method === 'cash').reduce((sum, t) => sum + t.amount, 0),
    wallet: completedTransactions.filter(t => t.payment_method === 'wallet').reduce((sum, t) => sum + t.amount, 0),
  };

  // Revenue by transaction type
  const revenueByType = {
    ride_payment: completedTransactions.filter(t => t.type === 'ride_payment').reduce((sum, t) => sum + t.amount, 0),
    deposit: completedTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0),
    commission: completedTransactions.filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0),
  };

  // Daily revenue chart data (last 7 days)
  const dailyRevenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayTransactions = completedTransactions.filter(t => 
      new Date(t.created_date).toDateString() === date.toDateString()
    );
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactions: dayTransactions.length,
    };
  });

  // Payment method pie chart data
  const paymentMethodData = [
    { name: 'Stripe', value: revenueByMethod.stripe, color: '#635BFF' },
    { name: 'PayPal', value: revenueByMethod.paypal, color: '#0070BA' },
    { name: 'Cash', value: revenueByMethod.cash, color: '#10B981' },
    { name: 'Wallet', value: revenueByMethod.wallet, color: '#8B5CF6' },
  ].filter(item => item.value > 0);

  // Transaction type bar chart data
  const transactionTypeData = [
    { name: 'Ride Payments', amount: revenueByType.ride_payment },
    { name: 'Deposits', amount: revenueByType.deposit },
    { name: 'Commissions', amount: revenueByType.commission },
  ];

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRevenue,
        todayRevenue,
        revenueChange,
        totalTransactions: completedTransactions.length,
      },
      revenueByMethod,
      revenueByType,
      dailyRevenue: dailyRevenueData,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <Badge className={revenueChange >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {revenueChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(revenueChange)}%
              </Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${todayRevenue.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Today's Revenue</p>
            <p className="text-xs text-gray-500 mt-2">
              Yesterday: ${yesterdayRevenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xs text-gray-500 mt-2">
              {completedTransactions.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${(totalRevenue / completedTransactions.length || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Avg Transaction</p>
            <p className="text-xs text-gray-500 mt-2">
              Per completed transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {transactions.filter(t => t.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-600">Pending Payments</p>
            <p className="text-xs text-gray-500 mt-2">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Daily Revenue (Last 7 Days)
              </CardTitle>
              <Button size="sm" variant="outline" onClick={exportReport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Revenue by Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {paymentMethodData.map((method) => (
                <div key={method.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: method.color }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-600">${method.value.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Types Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue by Transaction Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFF', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Bar dataKey="amount" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedTransactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'ride_payment' ? 'bg-green-100' :
                    transaction.type === 'deposit' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    <DollarSign className={`w-5 h-5 ${
                      transaction.type === 'ride_payment' ? 'text-green-600' :
                      transaction.type === 'deposit' ? 'text-blue-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{transaction.description || transaction.type}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{transaction.user_email}</span>
                      <span>•</span>
                      <span>{new Date(transaction.created_date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.payment_method}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}