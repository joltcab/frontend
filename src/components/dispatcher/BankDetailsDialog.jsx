import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Check } from "lucide-react";

export default function BankDetailsDialog({ open, onClose, profile, onSuccess }) {
  const [formData, setFormData] = useState({
    bank_name: "",
    bank_branch: "",
    bank_account_number: "",
    bank_account_holder_name: "",
    bank_beneficiary_address: "",
    bank_unique_code: "",
    bank_swift_code: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        bank_name: profile.bank_name || "",
        bank_branch: profile.bank_branch || "",
        bank_account_number: profile.bank_account_number || "",
        bank_account_holder_name: profile.bank_account_holder_name || "",
        bank_beneficiary_address: profile.bank_beneficiary_address || "",
        bank_unique_code: profile.bank_unique_code || "",
        bank_swift_code: profile.bank_swift_code || ""
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.DispatcherProfile.update(profile.id, data);
    },
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: (error) => {
      setError(error.message || "Failed to update bank details");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!formData.bank_name || !formData.bank_account_number || !formData.bank_account_holder_name) {
      setError("Please fill in all required fields");
      return;
    }

    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#15B46A]" />
            Bank Details
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Bank Name *</Label>
              <Input
                placeholder="Bank of America"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Bank Branch *</Label>
              <Input
                placeholder="Downtown Branch"
                value={formData.bank_branch}
                onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Account Number *</Label>
            <Input
              placeholder="1234567890"
              value={formData.bank_account_number}
              onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Account Holder Name *</Label>
            <Input
              placeholder="John Doe"
              value={formData.bank_account_holder_name}
              onChange={(e) => setFormData({ ...formData, bank_account_holder_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Beneficiary Address *</Label>
            <Input
              placeholder="123 Main St, City, State, ZIP"
              value={formData.bank_beneficiary_address}
              onChange={(e) => setFormData({ ...formData, bank_beneficiary_address: e.target.value })}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Bank Unique Code / IBAN</Label>
              <Input
                placeholder="US12345678901234567890"
                value={formData.bank_unique_code}
                onChange={(e) => setFormData({ ...formData, bank_unique_code: e.target.value })}
              />
            </div>

            <div>
              <Label>SWIFT / BIC Code</Label>
              <Input
                placeholder="BOFAUS3N"
                value={formData.bank_swift_code}
                onChange={(e) => setFormData({ ...formData, bank_swift_code: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-[#15B46A] hover:bg-[#0F9456]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Details
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}