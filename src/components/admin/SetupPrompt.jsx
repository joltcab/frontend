import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Rocket, Loader2, CheckCircle, Settings } from "lucide-react";
import { joltcab } from "@/lib/joltcab-api";

export default function SetupPrompt({ onStartSetup }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fixMissingConfigs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const missingConfigs = [
        {
          config_key: 'max_vehicle_age_years',
          config_value: '15',
          config_category: 'operational',
          data_type: 'number',
          is_public: false,
          description: 'Maximum vehicle age allowed (years)'
        },
        {
          config_key: 'default_commission_rate',
          config_value: '15',
          config_category: 'pricing',
          data_type: 'number',
          is_public: false,
          description: 'Platform commission percentage'
        },
        {
          config_key: 'cancellation_fee',
          config_value: '5',
          config_category: 'pricing',
          data_type: 'number',
          is_public: true,
          description: 'Cancellation fee amount (USD)'
        }
      ];

      // Simplemente crear/actualizar todas las configuraciones
      for (const config of missingConfigs) {
        await joltcab.setup.saveConfiguration(
          config.config_key,
          config.config_value,
          config.config_category,
          false
        );
        console.log(`✅ Saved: ${config.config_key}`);
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error('❌ Error fixing configs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-[#15B46A] bg-gradient-to-br from-[#15B46A]/5 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#15B46A]">
          <Rocket className="w-6 h-6" />
          Quick Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">
          Welcome to JoltCab! It looks like this is your first time setting up the system.
          Let's configure everything you need to get started.
        </p>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Configurations fixed! Reloading...
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={fixMissingConfigs}
            disabled={loading || success}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Fixing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Fixed!
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Fix Missing Configs
              </>
            )}
          </Button>

          <Button
            onClick={onStartSetup}
            variant="outline"
            className="border-[#15B46A] text-[#15B46A] hover:bg-[#15B46A] hover:text-white"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Start Full Setup Wizard
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">What will be configured:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Maximum vehicle age (15 years)</li>
            <li>✓ Default commission rate (15%)</li>
            <li>✓ Cancellation fee ($5)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}