import { Modal, Badge, Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function DriverDetailModal({ isOpen, onClose, driver }) {
  if (!driver) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Driver Details: ${driver.name}`}
      size="4xl"
    >
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                
                <div className="space-y-3">
                  <InfoItem
                    icon={UserIcon}
                    label="Full Name"
                    value={driver.name}
                  />
                  <InfoItem
                    icon={EnvelopeIcon}
                    label="Email"
                    value={driver.email}
                  />
                  <InfoItem
                    icon={PhoneIcon}
                    label="Phone"
                    value={driver.phone}
                  />
                  <InfoItem
                    icon={CalendarIcon}
                    label="Joined"
                    value={driver.joinedDate || 'Jan 15, 2024'}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Trips</span>
                    <span className="text-lg font-semibold text-gray-900">{driver.totalTrips || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="text-lg font-semibold text-gray-900">⭐ {driver.rating || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Earnings</span>
                    <span className="text-lg font-semibold text-gray-900">${driver.earnings || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Status</span>
                    <div className="flex gap-2">
                      <Badge variant={driver.isApproved ? 'success' : 'warning'}>
                        {driver.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <Badge variant={driver.isOnline ? 'success' : 'default'}>
                        {driver.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPinIcon className="w-5 h-5 mt-0.5" />
                <p>{driver.address || '123 Main St, City, State 12345'}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Required Documents</h3>
            
            <div className="space-y-3">
              <DocumentItem
                title="Driver's License"
                status={driver.documentsVerified ? 'verified' : 'pending'}
                uploadDate="Jan 20, 2024"
                expiryDate="Dec 31, 2026"
              />
              <DocumentItem
                title="Government ID"
                status={driver.documentsVerified ? 'verified' : 'pending'}
                uploadDate="Jan 20, 2024"
                expiryDate="Dec 31, 2026"
              />
              <DocumentItem
                title="Profile Photo"
                status={driver.documentsVerified ? 'verified' : 'pending'}
                uploadDate="Jan 20, 2024"
              />
              <DocumentItem
                title="Background Check"
                status={driver.documentsVerified ? 'verified' : 'pending'}
                uploadDate="Jan 22, 2024"
                expiryDate="Jan 22, 2025"
              />
              <DocumentItem
                title="Insurance Certificate"
                status={driver.documentsVerified ? 'verified' : 'pending'}
                uploadDate="Jan 20, 2024"
                expiryDate="Dec 31, 2024"
              />
            </div>

            {!driver.documentsVerified && (
              <div className="mt-6 flex gap-3">
                <Button variant="primary">Approve All Documents</Button>
                <Button variant="outline">Request Re-upload</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="vehicles">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Registered Vehicles</h3>
              <Button variant="outline" size="sm">Add Vehicle</Button>
            </div>
            
            <div className="space-y-4">
              <VehicleCard
                make={driver.vehicleMake || 'Toyota'}
                model={driver.vehicleModel || 'Camry'}
                year="2022"
                plate="ABC-1234"
                color="Silver"
                serviceType={driver.vehicleType || 'Economy'}
                isVerified={driver.documentsVerified}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
        {!driver.isApproved && (
          <Button variant="primary">Approve Driver</Button>
        )}
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function DocumentItem({ title, status, uploadDate, expiryDate }) {
  const isVerified = status === 'verified';
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <DocumentTextIcon className="w-6 h-6 text-gray-400" />
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">Uploaded: {uploadDate}</p>
          {expiryDate && (
            <p className="text-xs text-gray-500">Expires: {expiryDate}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {isVerified ? (
          <Badge variant="success">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Verified
          </Badge>
        ) : (
          <Badge variant="warning">
            <ClockIcon className="w-4 h-4 mr-1" />
            Pending
          </Badge>
        )}
        <Button variant="ghost" size="sm">View</Button>
      </div>
    </div>
  );
}

function VehicleCard({ make, model, year, plate, color, serviceType, isVerified }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <TruckIcon className="w-8 h-8 text-gray-400" />
          <div>
            <h4 className="font-semibold text-gray-900">{year} {make} {model}</h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>Plate: <span className="font-medium">{plate}</span></p>
              <p>Color: <span className="font-medium">{color}</span></p>
              <p>Service Type: <span className="font-medium">{serviceType}</span></p>
            </div>
          </div>
        </div>
        <div>
          {isVerified ? (
            <Badge variant="success">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="warning">
              <ClockIcon className="w-4 h-4 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm">View Documents</Button>
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">Remove</Button>
      </div>
    </div>
  );
}
