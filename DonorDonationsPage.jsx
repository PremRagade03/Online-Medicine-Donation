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
  Users,
  Pill
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

// Services
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

const donationService = {
  async getDonationsByDonor(donorId) {
    try {
      console.log('Fetching donations for donor ID:', donorId);
      const response = await fetch(`${API_BASE_URL}/donations/donor/${donorId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch donations: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Raw donations data:', data);
      return data;
    } catch (error) {
      console.error('Error in getDonationsByDonor:', error);
      throw error;
    }
  },

  async updateDonationStatus(donationId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: status }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update donation status: ${response.status} ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  }
};

const medicineService = {
  async getMedicinesByDonor(donorId) {
    try {
      console.log('Fetching medicines for donor ID:', donorId);
      const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch medicines: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Raw medicines data:', data);
      return data;
    } catch (error) {
      console.error('Error in getMedicinesByDonor:', error);
      throw error;
    }
  }
};

const DonorDonationsPage = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' or 'medicines'
  const [updatingStatus, setUpdatingStatus] = useState(new Set()); // Track which items are being updated
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async (isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isRetry) {
        setRetryCount(prev => prev + 1);
      }
      
      const userId = user?.id || user?.userId || user?.donorId || 1; // fallback to 1 for demo
      console.log('Loading data for user ID:', userId);
      
      // Load both donations and medicines
      const [donationsData, medicinesData] = await Promise.all([
        donationService.getDonationsByDonor(userId),
        medicineService.getMedicinesByDonor(userId)
      ]);
      
      console.log('Raw donations data:', donationsData);
      console.log('Raw medicines data:', medicinesData);
      
      // Map donations data with improved structure handling
      const mappedDonations = (donationsData || []).map(donation => {
        // Handle both direct properties and nested Medicine object
        const medicine = donation.Medicine || {};
        const ngo = donation.DonatedToNgo || {};
        
        return {
          id: donation.DonationId || donation.donationId || donation.id,
          donationNumber: `DON-${String(donation.DonationId || donation.donationId || donation.id).padStart(3, '0')}`,
          medicineId: donation.MedicineId || donation.medicineId || medicine.MedicineId || medicine.id,
          medicineName: medicine.Name || medicine.name || donation.medicineName || 'Unknown Medicine',
          quantity: donation.QuantityDonated || donation.quantityDonated || donation.quantity || medicine.Quantity || medicine.quantity || 0,
          status: (donation.Status || donation.status || 'pending')?.toLowerCase(),
          donationDate: donation.DonatedAt || donation.donatedAt || donation.CreatedAt || donation.createdAt || donation.donationDate || new Date().toISOString().split('T')[0],
          expiryDate: medicine.ExpiryDate || medicine.expiryDate || donation.expiryDate || 'N/A',
          condition: donation.Condition || donation.condition || 'excellent', // Get from donation if available
          location: donation.Location || donation.location || 'Mumbai', // Get from donation if available
          description: medicine.Description || medicine.description || donation.description || 'Medicine donation',
          recipient: ngo.Name || ngo.name || donation.ngoName || null,
          donatedToNgoId: donation.DonatedToNgoId || donation.donatedToNgoId || ngo.NgoId || ngo.id
        };
      });
      
      // Map medicines data with improved structure handling
      const mappedMedicines = (medicinesData || []).map(medicine => {
        return {
          id: medicine.MedicineId || medicine.medicineId || medicine.id,
          name: medicine.Name || medicine.name,
          description: medicine.Description || medicine.description || 'No description',
          expiryDate: medicine.ExpiryDate || medicine.expiryDate || medicine.expiryDate,
          quantity: medicine.Quantity || medicine.quantity || 0,
          status: (medicine.Status || medicine.status || 'available')?.toLowerCase(),
          createdAt: medicine.CreatedAt || medicine.createdAt || medicine.CreatedDate || medicine.createdDate || new Date().toISOString(),
          donorId: medicine.DonorId || medicine.donorId || medicine.Donor?.DonorId || medicine.donor?.id
        };
      });
      
      setDonations(validateAndCleanData(mappedDonations, 'donation'));
      setMedicines(validateAndCleanData(mappedMedicines, 'medicine'));
      
      console.log('Mapped donations:', mappedDonations);
      console.log('Mapped medicines:', mappedMedicines);
      
    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error.message || "Failed to load data. Please try again.";
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Set empty arrays on error
      setDonations([]);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadData(true);
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'claimed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'donated': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'reserved': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'disposed': return 'bg-red-600/20 text-red-300 border-red-600/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getConditionColor = (condition) => {
    if (!condition) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'poor': return 'bg-red-600/20 text-red-300 border-red-600/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatQuantity = (quantity) => {
    if (quantity === null || quantity === undefined) return '0';
    return quantity.toString();
  };

  const validateAndCleanData = (data, type) => {
    if (!Array.isArray(data)) return [];
    
    return data.filter(item => {
      if (!item) return false;
      
      if (type === 'donation') {
        // Ensure donation has required fields
        return item.id && item.medicineName && item.quantity !== undefined;
      } else if (type === 'medicine') {
        // Ensure medicine has required fields
        return item.id && item.name && item.quantity !== undefined;
      }
      
      return true;
    }).map(item => {
      // Clean and normalize the data
      if (type === 'donation') {
        return {
          ...item,
          medicineName: item.medicineName || 'Unknown Medicine',
          quantity: item.quantity || 0,
          status: (item.status || 'pending').toLowerCase(),
          donationDate: item.donationDate || new Date().toISOString().split('T')[0],
          condition: item.condition || 'excellent',
          location: item.location || 'Mumbai'
        };
      } else if (type === 'medicine') {
        return {
          ...item,
          name: item.name || 'Unknown Medicine',
          description: item.description || 'No description',
          quantity: item.quantity || 0,
          status: (item.status || 'available').toLowerCase()
        };
      }
      
      return item;
    });
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchTerm.toLowerCase();
    const medicineName = (donation.medicineName || '').toLowerCase();
    const donationNumber = (donation.donationNumber || '').toLowerCase();
    const description = (donation.description || '').toLowerCase();
    
    const matchesSearch = medicineName.includes(searchLower) ||
                        donationNumber.includes(searchLower) ||
                        description.includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || 
                         (donation.status && donation.status.toLowerCase() === statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  const filteredMedicines = medicines.filter(medicine => {
    const searchLower = searchTerm.toLowerCase();
    const name = (medicine.name || '').toLowerCase();
    const description = (medicine.description || '').toLowerCase();
    
    const matchesSearch = name.includes(searchLower) ||
                        description.includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || 
                         (medicine.status && medicine.status.toLowerCase() === statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      setUpdatingStatus(prev => new Set(prev).add(donationId));
      
      await donationService.updateDonationStatus(donationId, newStatus);
      
      setDonations(prev => prev.map(donation => 
        donation.id === donationId ? { ...donation, status: newStatus.toLowerCase() } : donation
      ));
      
      toast({
        title: "Success",
        description: "Donation status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update donation status",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(donationId);
        return newSet;
      });
    }
  };

  const handleExportData = () => {
    const data = activeTab === 'donations' ? filteredDonations : filteredMedicines;
    const headers = activeTab === 'donations' 
      ? "Donation Number,Medicine,Quantity,Status,Donation Date,Expiry Date,Condition,Location,Recipient"
      : "Medicine ID,Name,Description,Quantity,Status,Expiry Date,Created Date";
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" +
      data.map(item => {
        if (activeTab === 'donations') {
          return `${item.donationNumber},${item.medicineName},${item.quantity},${item.status},${item.donationDate},${item.expiryDate},${item.condition},${item.location},${item.recipient || 'N/A'}`;
        } else {
          return `${item.id},${item.name},${item.description},${item.quantity},${item.status},${item.expiryDate},${item.createdAt}`;
        }
      }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your donations and medicines...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-md">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Failed to Load Data</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <div className="flex space-x-3 justify-center">
              <Button onClick={handleRetry} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Retry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Refresh Page
              </Button>
            </div>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">Retry attempts: {retryCount}</p>
            )}
          </div>
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
                <h1 className="text-2xl font-bold text-white">Your Donations & Medicines</h1>
                <p className="text-gray-400">Manage and track your medicine donations and inventory</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={loadData}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'donations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('donations')}
            className={activeTab === 'donations' ? 'bg-green-600 hover:bg-green-700' : 'border-white/20 text-white hover:bg-white/10'}
          >
            <Heart className="w-4 h-4 mr-2" />
            Donations ({donations.length})
          </Button>
          <Button
            variant={activeTab === 'medicines' ? 'default' : 'outline'}
            onClick={() => setActiveTab('medicines')}
            className={activeTab === 'medicines' ? 'bg-blue-600 hover:bg-blue-700' : 'border-white/20 text-white hover:bg-white/10'}
          >
            <Pill className="w-4 h-4 mr-2" />
            Medicines ({medicines.length})
          </Button>
        </div>

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
                <p className="text-2xl font-bold text-white">{donations.filter(d => d.status === 'delivered' || d.status === 'donated').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Total Medicines</p>
                <p className="text-2xl font-bold text-white">{medicines.length}</p>
              </div>
              <Pill className="w-8 h-8 text-yellow-400" />
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
                  placeholder={`Search ${activeTab}...`}
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
              <SelectContent className="bg-slate-800 border-white/20">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="donated">Donated</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'donations' ? (
          /* Donations List */
          <div className="space-y-4">
            {filteredDonations.length === 0 ? (
              <Card className="p-12 text-center bg-slate-800/50 border-white/10">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {donations.length === 0 ? 'No Donations Yet' : 'No Donations Found'}
                </h3>
                <p className="text-gray-400">
                  {donations.length === 0 
                    ? 'Start making a difference by donating your unused medicines.' 
                    : 'No donations match your current filters.'}
                </p>
              </Card>
            ) : (
              filteredDonations.map((donation) => (
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
                        <p className="text-lg font-bold text-white">{formatQuantity(donation.quantity)} units</p>
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
                          <p className="text-white font-medium">{formatDate(donation.donationDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Expiry Date</p>
                          <p className="text-white font-medium">
                            {formatDate(donation.expiryDate)}
                          </p>
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
                          disabled={updatingStatus.has(donation.id)}
                        >
                          {updatingStatus.has(donation.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Mark Claimed
                        </Button>
                      )}
                      {donation.status === 'claimed' && (
                        <Button
                          onClick={() => handleStatusUpdate(donation.id, 'delivered')}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          disabled={updatingStatus.has(donation.id)}
                        >
                          {updatingStatus.has(donation.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Mark Delivered
                        </Button>
                      )}
                      {donation.status === 'expired' && (
                        <Button
                          onClick={() => handleStatusUpdate(donation.id, 'disposed')}
                          variant="destructive"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          disabled={updatingStatus.has(donation.id)}
                        >
                          {updatingStatus.has(donation.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Dispose
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* Medicines List */
          <div className="space-y-4">
            {filteredMedicines.length === 0 ? (
              <Card className="p-12 text-center bg-slate-800/50 border-white/10">
                <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {medicines.length === 0 ? 'No Medicines Yet' : 'No Medicines Found'}
                </h3>
                <p className="text-gray-400">
                  {medicines.length === 0 
                    ? 'Add your first medicine to start building your inventory.' 
                    : 'No medicines match your current filters.'}
                </p>
              </Card>
            ) : (
              filteredMedicines.map((medicine) => (
                <motion.div
                  key={medicine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-white">{medicine.name}</h3>
                          <Badge className={`px-2 py-1 text-xs font-medium border ${getStatusColor(medicine.status)}`}>
                            {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                          </Badge>
                          <Badge className="px-2 py-1 text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                            ID: {medicine.id}
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-white">{formatQuantity(medicine.quantity)} units</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Description</p>
                          <p className="text-white font-medium">{medicine.description}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Expiry Date</p>
                          <p className="text-white font-medium">
                            {formatDate(medicine.expiryDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Created Date</p>
                          <p className="text-white font-medium">
                            {formatDate(medicine.createdAt)}
                          </p>
                        </div>
                      </div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Donate
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DonorDonationsPage;