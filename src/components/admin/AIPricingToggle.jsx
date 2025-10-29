import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Brain, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AIPricingToggle({ enabled, onToggle }) {
  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Dynamic Pricing
          <Badge className={enabled ? "bg-green-500" : "bg-gray-400"}>
            {enabled ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold">Enable AI Pricing</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use artificial intelligence to optimize prices in real-time based on demand, supply, and market conditions
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              className="ml-4"
            />
          </div>

          {enabled && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Supply & Demand</p>
                  <p className="text-xs text-gray-600">Real-time analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Smart Surge</p>
                  <p className="text-xs text-gray-600">1.0x - 3.0x multiplier</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">ML Model</p>
                  <p className="text-xs text-gray-600">GPT-4 powered</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-xs text-purple-900 dark:text-purple-200">
              <strong>How it works:</strong> AI analyzes driver availability, current demand, time of day, recent activity, and market conditions to automatically adjust surge pricing for optimal revenue and driver utilization.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}