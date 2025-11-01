import React, { useState, useEffect } from "react";
import joltcab from "@/lib/joltcab-api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard, Plus, Edit, Trash2, Loader2, Save, Building2, Hash
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function PartnerBankDetails() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBankDialog, setShowBankDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [bankData, setBankData] = useState({
    bank_name: "",
    bank_account_number: "",
    bank_routing_number: "",
    bank_account_holder: ""
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
  const userData = await joltcab.auth.me();
      setUser(userData);
      
      if (userData.role !== 'partner') {
        window.location.href = createPageUrl('Home');
        return;
      }

  const profiles = await joltcab.entities.PartnerProfile.filter({
        user_email: userData.email
      });
      
      if (profiles[0]) {
        setProfile(profiles[0]);
        
        // Load existing bank details
        if (profiles[0].bank_name) {
          setBankData({
            bank_name: profiles[0].bank_name || "",
            bank_account_number: profiles[0].bank_account_number || "",
            bank_routing_number: profiles[0].bank_routing_number || "",
            bank_account_holder: profiles[0].bank_account_holder || ""
          });
          setEditMode(true);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBankDetailsMutation = useMutation({
    mutationFn: async (data) => {
      if (!profile) throw new Error('Profile not found');
      
  await joltcab.entities.PartnerProfile.update(profile.id, {
        bank_name: data.bank_name,
        bank_account_number: data.bank_account_number,
        bank_routing_number: data.bank_routing_number,
        bank_account_holder: data.bank_account_holder
      });
    },
    onSuccess: () => {
      alert('Bank details saved successfully!');
      setShowBankDialog(false);
      queryClient.invalidateQueries(['partnerProfile']);
      loadUser();
    },
    onError: (error) => {
      alert('Failed to save bank details: ' + error.message);
    }
  });

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    
    if (!bankData.bank_name || !bankData.bank_account_number || !bankData.bank_account_holder) {
      alert('Please fill all required fields');
      return;
    }

    saveBankDetailsMutation.mutate(bankData);
  };

  const handleEditBankDetails = () => {
    setShowBankDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const hasBankDetails = profile?.bank_name && profile?.bank_account_number;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bank Details</h1>
          <p className="text-gray-600 mt-1">
            Manage your bank account for receiving payments
          </p>
        </div>
        {hasBankDetails && (
          <Button onClick={handleEditBankDetails}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        )}
      </motion.div>

      {!hasBankDetails ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Bank Details Added
            </h3>
            <p className="text-gray-600 mb-6">
              Add your bank account details to receive commission payments
            </p>
            <Button onClick={() => setShowBankDialog(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Bank Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Bank Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-gray-600 text-sm">Bank Name</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.bank_name}
                </p>
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Account Holder</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {profile.bank_account_holder}
                </p>
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Account Number</Label>
                <p className="text-lg font-mono text-gray-900 mt-1">
                  ************{profile.bank_account_number?.slice(-4)}
                </p>
              </div>

              <div>
                <Label className="text-gray-600 text-sm">Routing Number</Label>
                <p className="text-lg font-mono text-gray-900 mt-1">
                  {profile.bank_routing_number || 'N/A'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">ℹ️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Payment Schedule
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Commission payments are processed weekly. Funds will be transferred to this account every Monday for the previous week's earnings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Details Dialog */}
      <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit Bank Details' : 'Add Bank Account'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveBankDetails} className="space-y-4">
            <div>
              <Label htmlFor="bank_name">Bank Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="bank_name"
                  className="pl-10"
                  placeholder="e.g., Chase Bank"
                  value={bankData.bank_name}
                  onChange={(e) => setBankData({...bankData, bank_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bank_account_holder">Account Holder Name *</Label>
              <Input
                id="bank_account_holder"
                placeholder="Full name as appears on account"
                value={bankData.bank_account_holder}
                onChange={(e) => setBankData({...bankData, bank_account_holder: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="bank_account_number">Account Number *</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="bank_account_number"
                  type="text"
                  className="pl-10 font-mono"
                  placeholder="Enter account number"
                  value={bankData.bank_account_number}
                  onChange={(e) => setBankData({...bankData, bank_account_number: e.target.value.replace(/\D/g, '')})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bank_routing_number">Routing Number</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="bank_routing_number"
                  type="text"
                  className="pl-10 font-mono"
                  placeholder="9-digit routing number (optional)"
                  maxLength={9}
                  value={bankData.bank_routing_number}
                  onChange={(e) => setBankData({...bankData, bank_routing_number: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Note:</strong> Your bank details are encrypted and stored securely. We never share this information with third parties.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBankDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveBankDetailsMutation.isPending}
              >
                {saveBankDetailsMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Bank Details
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}