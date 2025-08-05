import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Download,
  Plus,
  Heart,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const DonorDonationsPage = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API calls
  const mockDonations = [
    {
      id: 1,
      donationNumber: 'DON-001',
      medicineName: 'Paracetamol 500mg',
      quantity: 100,
      status: 'available',
      donationDate: '2024-01-15',
      expiryDate: '2025-06-15',
      condition: 'excellent',
      location: 'Mumbai',
      description: 'Unused medicine from personal stock',
      recipient: null
    },
    {
      id: 2,
      donationNumber: 'DON-002',
      medicineName: 'Amoxicillin 250mg',
      quantity: 50,
      status: 'claimed',
      donationDate: '2024-01-14',
      expiryDate: '2024-12-15',
      condition: 'good',
      location: 'Delhi',
      description: 'Leftover from family prescription',
      recipient: 'City General Hospital'
    },
    {
      id: 3,
      donationNumber: 'DON-003',
      medicineName: 'Ibuprofen 400mg',
      quantity: 75,
      status: 'delivered',
      donationDate: '2024-01-10',
      expiryDate: '2025-03-15',
      condition: 'excellent',
      location: 'Bangalore',
      description: 'Unopened medicine packets',
      recipient: 'Rural Health Initiative'
    },
    {
      id: 4,
      donationNumber: 'DON-004',
      medicineName: 'Omeprazole 20mg',
      quantity: 30,
      status: 'expired',
      donationDate: '2024-01-12',
      expiryDate: '2024-01-10',
      condition: 'expired',
      location: 'Chennai',
      description: 'Expired medicine - needs disposal',
      recipient: null
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDonations(mockDonations);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'claimed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        donation.donationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (donationId, newStatus) => {
    setDonations(prev => prev.map(donation => 
      donation.id === donationId ? { ...donation, status: newStatus } : donation
    ));
  };

  const handleExportDonations = () => {
    // Export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Donation Number,Medicine,Quantity,Status,Donation Date,Expiry Date,Condition,Location,Recipient\n" +
      filteredDonations.map(donation => 
        `${donation.donationNumber},${donation.medicineName},${donation.quantity},${donation.status},${donation.donationDate},${donation.expiryDate},${donation.condition},${donation.location},${donation.recipient || 'N/A'}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donor_donations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-white/10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Donations</h1>
                <p className="text-gray-400">Manage and track your medicine donations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExportDonations}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Donation
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Total Donations</p>
                <p className="text-2xl font-bold text-white">{donations.length}</p>
              </div>
              <Heart className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Available</p>
                <p className="text-2xl font-bold text-white">{donations.filter(d => d.status === 'available').length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Delivered</p>
                <p className="text-2xl font-bold text-white">{donations.filter(d => d.status === 'delivered').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Claimed</p>
                <p className="text-2xl font-bold text-white">{donations.filter(d => d.status === 'claimed').length}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-slate-800/50 border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search donations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Donations List */}
        <div className="space-y-4">
          {filteredDonations.map((donation) => (
            <motion.div
              key={donation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{donation.medicineName}</h3>
                      <Badge className={`px-2 py-1 text-xs font-medium border ${getStatusColor(donation.status)}`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </Badge>
                      <Badge className={`px-2 py-1 text-xs font-medium border ${getConditionColor(donation.condition)}`}>
                        {donation.condition.charAt(0).toUpperCase() + donation.condition.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-white">{donation.quantity} units</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Donation Number</p>
                      <p className="text-white font-medium">{donation.donationNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="text-white font-medium">{donation.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Donation Date</p>
                      <p className="text-white font-medium">{donation.donationDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Expiry Date</p>
                      <p className="text-white font-medium">{donation.expiryDate}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Description</p>
                    <p className="text-white text-sm">{donation.description}</p>
                  </div>

                  {donation.recipient && (
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400">Recipient:</span>
                        <span className="text-white">{donation.recipient}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {donation.status === 'available' && (
                    <Button
                      onClick={() => handleStatusUpdate(donation.id, 'claimed')}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Claimed
                    </Button>
                  )}
                  {donation.status === 'claimed' && (
                    <Button
                      onClick={() => handleStatusUpdate(donation.id, 'delivered')}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Delivered
                    </Button>
                  )}
                  {donation.status === 'expired' && (
                    <Button
                      onClick={() => handleStatusUpdate(donation.id, 'disposed')}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Dispose
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDonations.length === 0 && (
          <Card className="p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Donations Found</h3>
            <p className="text-gray-400">No donations match your current filters.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DonorDonationsPage; 