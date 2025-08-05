import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  Building2, 
  Pill,
  Heart,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  // Dummy data for analytics
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      totalDonations: 892,
      totalRequests: 456,
      totalHospitals: 89,
      totalNGOs: 34,
      totalMedicines: 156,
      totalRevenue: 45600,
      growthRate: 12.5
    },
    donations: {
      monthly: [120, 145, 132, 189, 156, 178, 234, 198, 167, 189, 212, 245],
      byStatus: [
        { status: 'Approved', count: 456, percentage: 65 },
        { status: 'Pending', count: 189, percentage: 27 },
        { status: 'Rejected', count: 56, percentage: 8 }
      ],
      byCategory: [
        { category: 'Pain Relief', count: 234, percentage: 33 },
        { category: 'Antibiotics', count: 156, percentage: 22 },
        { category: 'Diabetes', count: 89, percentage: 13 },
        { category: 'Cardiovascular', count: 78, percentage: 11 },
        { category: 'Other', count: 145, percentage: 21 }
      ]
    },
    requests: {
      monthly: [45, 67, 54, 78, 89, 67, 98, 87, 76, 89, 98, 112],
      byStatus: [
        { status: 'Approved', count: 234, percentage: 51 },
        { status: 'Pending', count: 156, percentage: 34 },
        { status: 'Completed', count: 45, percentage: 10 },
        { status: 'Rejected', count: 21, percentage: 5 }
      ],
      byHospital: [
        { hospital: 'City General', count: 45, percentage: 15 },
        { hospital: 'Memorial Medical', count: 38, percentage: 13 },
        { hospital: 'Community Health', count: 32, percentage: 11 },
        { hospital: 'Regional Medical', count: 28, percentage: 9 },
        { hospital: 'Others', count: 156, percentage: 52 }
      ]
    },
    users: {
      byRole: [
        { role: 'Donors', count: 567, percentage: 45 },
        { role: 'Hospitals', count: 234, percentage: 19 },
        { role: 'NGOs', count: 89, percentage: 7 },
        { role: 'Admins', count: 12, percentage: 1 },
        { role: 'Others', count: 345, percentage: 28 }
      ],
      growth: [89, 123, 156, 189, 234, 267, 289, 312, 345, 378, 412, 445]
    },
    topDonors: [
      { name: 'John Smith', donations: 45, totalValue: 2340, lastDonation: '2024-01-15' },
      { name: 'Sarah Johnson', donations: 38, totalValue: 1890, lastDonation: '2024-01-12' },
      { name: 'Mike Wilson', donations: 32, totalValue: 1560, lastDonation: '2024-01-10' },
      { name: 'Lisa Brown', donations: 28, totalValue: 1340, lastDonation: '2024-01-08' },
      { name: 'David Lee', donations: 25, totalValue: 1200, lastDonation: '2024-01-05' }
    ],
    topHospitals: [
      { name: 'City General Hospital', requests: 67, medicines: 234, rating: 4.8 },
      { name: 'Memorial Medical Center', requests: 54, medicines: 189, rating: 4.6 },
      { name: 'Community Health Center', requests: 45, medicines: 156, rating: 4.4 },
      { name: 'Regional Medical Hospital', requests: 38, medicines: 134, rating: 4.2 },
      { name: 'University Medical Center', requests: 32, medicines: 112, rating: 4.0 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getGrowthIcon = (growth) => {
    return growth > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-400" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-400" />
    );
  };

  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalUsers)}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(analyticsData.overview.growthRate)}
                <span className="text-green-400 text-sm ml-1">+{analyticsData.overview.growthRate}%</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Donations</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalDonations)}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(8.2)}
                <span className="text-green-400 text-sm ml-1">+8.2%</span>
              </div>
            </div>
            <Package className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.overview.totalRequests)}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(15.3)}
                <span className="text-green-400 text-sm ml-1">+15.3%</span>
              </div>
            </div>
            <Heart className="w-8 h-8 text-red-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
              <div className="flex items-center mt-1">
                {getGrowthIcon(22.1)}
                <span className="text-green-400 text-sm ml-1">+22.1%</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDonationAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Donations by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.donations.byStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-white">{item.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{item.count}</span>
                  <span className="text-gray-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Donations by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.donations.byCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-white">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{item.count}</span>
                  <span className="text-gray-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRequestAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Requests by Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.requests.byStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-green-500' : 
                    index === 1 ? 'bg-yellow-500' : 
                    index === 2 ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-white">{item.status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{item.count}</span>
                  <span className="text-gray-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Top Hospitals by Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topHospitals.map((hospital, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">{hospital.name}</span>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{hospital.requests} requests</span>
                    <span>{hospital.medicines} medicines</span>
                    <span>★ {hospital.rating}</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">#{index + 1}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTopDonors = () => (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Top Donors
          </div>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.topDonors.map((donor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{donor.name.charAt(0)}</span>
                </div>
                <div>
                  <span className="text-white font-medium">{donor.name}</span>
                  <div className="text-sm text-gray-400">
                    {donor.donations} donations • {formatCurrency(donor.totalValue)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-800">#{index + 1}</Badge>
                <div className="text-sm text-gray-400 mt-1">
                  Last: {new Date(donor.lastDonation).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderUserAnalytics = () => (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Users by Role
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {analyticsData.users.byRole.map((role, index) => (
            <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{role.count}</div>
              <div className="text-sm text-gray-400">{role.role}</div>
              <div className="text-xs text-gray-500 mt-1">{role.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Platform insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        {renderOverviewCards()}

        {/* Donation Analytics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Donation Analytics</h2>
          {renderDonationAnalytics()}
        </div>

        {/* Request Analytics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Request Analytics</h2>
          {renderRequestAnalytics()}
        </div>

        {/* Top Donors */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Top Performers</h2>
          {renderTopDonors()}
        </div>

        {/* User Analytics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">User Analytics</h2>
          {renderUserAnalytics()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics; 