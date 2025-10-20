import { useState, useEffect } from 'react';
import adminService from '@/services/dashboardService';

export default function VehicleDocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await adminService.getVehicleDocuments();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to load vehicle documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (docId) => {
    try {
      await adminService.approveVehicleDocument(docId);
      loadDocuments();
      alert('Document approved successfully');
    } catch (error) {
      console.error('Failed to approve document:', error);
    }
  };

  const handleReject = async (docId) => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      try {
        await adminService.rejectVehicleDocument(docId, { reason });
        loadDocuments();
        alert('Document rejected');
      } catch (error) {
        console.error('Failed to reject document:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vehicle Documents</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No documents found</td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{doc.vehicle_plate || 'N/A'}</td>
                    <td className="px-6 py-4">{doc.provider_name || 'N/A'}</td>
                    <td className="px-6 py-4">{doc.document_type || 'Registration'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        doc.is_approved ? 'bg-green-100 text-green-800' : 
                        doc.is_rejected ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.is_approved ? 'Approved' : doc.is_rejected ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{doc.expiry_date || 'N/A'}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      {!doc.is_approved && !doc.is_rejected && (
                        <>
                          <button 
                            onClick={() => handleApprove(doc._id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(doc._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
