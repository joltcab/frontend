import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";

export default function SystemStatus({ stats }) {
  const systemMetrics = [
    {
      label: "System Status",
      value: "Operational",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "API Uptime",
      value: "99.9%",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Avg Response Time",
      value: "145ms",
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Daily Active Users",
      value: stats?.activeUsers || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {systemMetrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${metric.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}