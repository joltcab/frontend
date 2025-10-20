import { useState, useEffect } from 'react';
import { UserIcon, TruckIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import adminService from '@/services/dashboardService';
import { DataTable, Badge, StatCard, Tabs } from '@/components/ui';

export default function Referrals() {
  const [activeTab, setActiveTab] = useState('users');
  const [userReferrals, setUserReferrals] = useState([]);
  const [driverReferrals, setDriverReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUserReferrals: 0,
    totalDriverReferrals: 0,
    totalBonus: 0,
    completedReferrals: 0
  });

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    setLoading(true);
    try {
      const [usersRes, driversRes] = await Promise.all([
        adminService.getUserReferrals(),
        adminService.getDriverReferrals()
      ]);
      
      const userRefs = usersRes.data?.data || [];
      const driverRefs = driversRes.data?.data || [];
      
      setUserReferrals(userRefs);
      setDriverReferrals(driverRefs);
      
      const allReferrals = [...userRefs, ...driverRefs];
      const totalBonus = allReferrals.reduce((sum, ref) => sum + (ref.bonus_amount || 0), 0);
      const completedCount = allReferrals.filter(ref => ref.status === 'completed').length;
      
      setStats({
        totalUserReferrals: userRefs.length,
        totalDriverReferrals: driverRefs.length,
        totalBonus: totalBonus,
        completedReferrals: completedCount
      });
    } catch (error) {
      console.error('Failed to load referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const userColumns = [
    {
      key: 'referrer',
      label: 'Referrer',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {value?.first_name && value?.last_name 
                ? `${value.first_name} ${value.last_name}`
                : 'N/A'}
            </p>
            {value?.email && (
              <p className="text-xs text-gray-500">{value.email}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'referred_user',
      label: 'Referred User',
      sortable: true,
      render: (value) => (
        <div>
          <p className="font-medium text-gray-900">
            {value?.first_name && value?.last_name 
              ? `${value.first_name} ${value.last_name}`
              : 'N/A'}
          </p>
          {value?.email && (
            <p className="text-xs text-gray-500">{value.email}</p>
          )}
        </div>
      )
    },
    {
      key: 'referral_code',
      label: 'Referral Code',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm text-gray-700">{value || 'N/A'}</span>
      )
    },
    {
      key: 'bonus_amount',
      label: 'Bonus',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${value ? value.toFixed(2) : '0.00'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const status = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending';
        const variant = 
          value === 'completed' ? 'success' :
          value === 'pending' ? 'warning' :
          'default';
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  const driverColumns = [
    {
      key: 'referrer',
      label: 'Referrer Driver',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <TruckIcon className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {value?.first_name && value?.last_name 
                ? `${value.first_name} ${value.last_name}`
                : 'N/A'}
            </p>
            {value?.phone && (
              <p className="text-xs text-gray-500">{value.phone}</p>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'referred_driver',
      label: 'Referred Driver',
      sortable: true,
      render: (value) => (
        <div>
          <p className="font-medium text-gray-900">
            {value?.first_name && value?.last_name 
              ? `${value.first_name} ${value.last_name}`
              : 'N/A'}
          </p>
          {value?.phone && (
            <p className="text-xs text-gray-500">{value.phone}</p>
          )}
        </div>
      )
    },
    {
      key: 'referral_code',
      label: 'Referral Code',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm text-gray-700">{value || 'N/A'}</span>
      )
    },
    {
      key: 'bonus_amount',
      label: 'Bonus',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${value ? value.toFixed(2) : '0.00'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => {
        const status = value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Pending';
        const variant = 
          value === 'completed' ? 'success' :
          value === 'pending' ? 'warning' :
          'default';
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      key: 'created_at',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? new Date(value).toLocaleDateString() : 'N/A'}
        </span>
      )
    }
  ];

  const tabs = [
    { id: 'users', label: 'User Referrals', icon: UserIcon },
    { id: 'drivers', label: 'Driver Referrals', icon: TruckIcon }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
          <p className="text-gray-500 mt-1">Track and manage referral program activities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="User Referrals"
          value={stats.totalUserReferrals}
          icon={UserIcon}
          iconColor="text-blue-500"
        />
        <StatCard
          title="Driver Referrals"
          value={stats.totalDriverReferrals}
          icon={TruckIcon}
          iconColor="text-green-500"
        />
        <StatCard
          title="Total Bonus Paid"
          value={`$${stats.totalBonus?.toLocaleString() || '0'}`}
          icon={UserIcon}
          iconColor="text-yellow-500"
        />
        <StatCard
          title="Completed"
          value={stats.completedReferrals}
          icon={UserIcon}
          iconColor="text-purple-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        
        <div className="p-6">
          <DataTable
            columns={activeTab === 'users' ? userColumns : driverColumns}
            data={activeTab === 'users' ? userReferrals : driverReferrals}
            loading={loading}
            emptyMessage={`No ${activeTab} referrals found`}
            pageSize={10}
            searchPlaceholder="Search referrals..."
          />
        </div>
      </div>
    </div>
  );
}
