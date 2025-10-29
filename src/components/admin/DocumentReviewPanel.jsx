import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2, XCircle, Eye, Loader2, Zap, Calendar,
  FileText, User, AlertCircle, RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentReviewPanel() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const queryClient = useQueryClient();

  const { data: pendingDocs = [], isLoading } = useQuery({
    queryKey: ['pendingDocuments'],
    queryFn: () => base44.entities.Document.filter({ status: 'pending' }, '-created_date'),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.update(id, { 
      status: 'approved',
      rejection_reason: null 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDocuments'] });
      setSelectedDoc(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => base44.entities.Document.update(id, { 
      status: 'rejected',
      rejection_reason: reason 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDocuments'] });
      setSelectedDoc(null);
      setRejectionReason("");
    },
  });

  const aiVerifyMutation = useMutation({
    mutationFn: async (documentId) => {
      const { data } = await base44.functions.invoke('verifyDocumentAI', {
        document_id: documentId
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDocuments'] });
      alert('AI verification completed!');
    },
  });

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#15B46A]" />
              Pending Documents ({pendingDocs.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['pendingDocuments'] })}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#15B46A] mx-auto mb-4" />
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : pendingDocs.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">No pending documents to review</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {pendingDocs.map((doc, index) => {
                  const daysUntil = getDaysUntilExpiry(doc.expiry_date);
                  const isExpired = daysUntil !== null && daysUntil < 0;
                  
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`${isExpired ? 'border-red-300' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Document Preview */}
                            {doc.file_url && (
                              <div className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                {doc.file_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                  <img
                                    src={doc.file_url}
                                    alt={doc.document_type}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => window.open(doc.file_url, '_blank')}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Document Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {doc.document_type.replace(/_/g, ' ').toUpperCase()}
                                </h3>
                                {isExpired && (
                                  <Badge className="bg-red-500">
                                    Expired {Math.abs(daysUntil)} days ago
                                  </Badge>
                                )}
                                {daysUntil > 0 && daysUntil <= 15 && (
                                  <Badge className="bg-yellow-500 text-yellow-900">
                                    Expires in {daysUntil} days
                                  </Badge>
                                )}
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <User className="w-4 h-4" />
                                  <span>{doc.user_email}</span>
                                </div>
                                
                                {doc.document_number && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <FileText className="w-4 h-4" />
                                    <span>ID: {doc.document_number}</span>
                                  </div>
                                )}

                                {doc.expiry_date && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    <span>Expires: {new Date(doc.expiry_date).toLocaleDateString()}</span>
                                  </div>
                                )}

                                {doc.full_name_on_document && (
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <User className="w-4 h-4" />
                                    <span>Name: {doc.full_name_on_document}</span>
                                  </div>
                                )}

                                <p className="text-xs text-gray-500">
                                  Uploaded: {new Date(doc.created_date).toLocaleString()}
                                </p>
                              </div>

                              {/* AI Verification Data */}
                              {doc.ai_verification_data && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                  <p className="text-xs font-medium text-blue-900 mb-2">
                                    🤖 AI Verification Available
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const data = JSON.parse(doc.ai_verification_data);
                                      alert(JSON.stringify(data, null, 2));
                                    }}
                                  >
                                    View AI Analysis
                                  </Button>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 mt-4">
                                <Button
                                  size="sm"
                                  className="bg-[#15B46A] hover:bg-[#0F9456]"
                                  onClick={() => approveMutation.mutate(doc.id)}
                                  disabled={approveMutation.isPending}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => setSelectedDoc(doc.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600"
                                  onClick={() => aiVerifyMutation.mutate(doc.id)}
                                  disabled={aiVerifyMutation.isPending}
                                >
                                  {aiVerifyMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  ) : (
                                    <Zap className="w-4 h-4 mr-2" />
                                  )}
                                  AI Verify
                                </Button>

                                {doc.file_url && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(doc.file_url, '_blank')}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Rejection Form */}
                          {selectedDoc === doc.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200"
                            >
                              <p className="text-sm font-medium text-red-900 mb-3">
                                Rejection Reason
                              </p>
                              <Textarea
                                placeholder="Explain why this document is being rejected..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                className="mb-3"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => rejectMutation.mutate({ 
                                    id: doc.id, 
                                    reason: rejectionReason 
                                  })}
                                  disabled={!rejectionReason || rejectMutation.isPending}
                                >
                                  Confirm Rejection
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedDoc(null);
                                    setRejectionReason("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}