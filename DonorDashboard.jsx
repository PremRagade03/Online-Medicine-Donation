import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Plus, Package, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

// Services
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

const medicineService = {
  async getMedicinesByDonor(donorId) {
    const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
    if (!response.ok) throw new Error('Failed to fetch medicines');
    return await response.json();
  },

  async getAvailableMedicines() {
    const response = await fetch(`${API_BASE_URL}/medicines/available`);
    if (!response.ok) throw new Error('Failed to fetch available medicines');
    return await response.json();
  },

  async createMedicine(medicineData) {
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicineData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create medicine');
    }
    return await response.json();
  }
};

const donationService = {
  async getDonationsByDonor(donorId) {
    const response = await fetch(`${API_BASE_URL}/donations/donor/${donorId}`);
    if (!response.ok) throw new Error('Failed to fetch donations');
    return await response.json();
  },

  async createDonation(donationData) {
    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create donation');
    }
    return await response.json();
  }
};

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showAddMedicineDialog, setShowAddMedicineDialog] = useState(false);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [newMedicine, setNewMedicine] = useState({
    medicineName: '',
    description: '',
    expiryDate: '',
    quantity: '',
    status: 'available'
  });

  const [newDonation, setNewDonation] = useState({
    medicineId: '',
    donatedToNgoId: null,
    quantityDonated: '',
    status: 'available'
  });

  useEffect(() => {
    // Debug: Check what user object contains
    console.log('Current user object:', user);
    console.log('Available user properties:', Object.keys(user || {}));
    
    // For development, create a mock user if none exists
    if (!user) {
      const mockUser = {
        id: 1,
        name: 'Demo Donor',
        userId: 1,
        donorId: 1
      };
      console.log('Using mock user for development:', mockUser);
      // We can't set the user in context, but we can work with it locally
      loadDataWithUser(mockUser);
    } else if (user && (user.id || user.userId || user.donorId)) {
      loadData();
    } else {
      console.warn('No valid user ID found in user object:', user);
      setLoading(false);
    }
  }, [user]);

  const loadDataWithUser = async (mockUser) => {
    try {
      setLoading(true);
      const userId = mockUser?.id || mockUser?.userId || mockUser?.donorId;
      
      // Load medicines and donations from API
      const [medicinesData, donationsData] = await Promise.all([
        medicineService.getMedicinesByDonor(userId),
        donationService.getDonationsByDonor(userId)
      ]);
      
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
      setDonations(Array.isArray(donationsData) ? donationsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Fallback to localStorage for development
      const savedDonations = localStorage.getItem('medishare_donations');
      const savedMedicines = localStorage.getItem('medishare_medicines');
      
      if (savedDonations) {
        setDonations(JSON.parse(savedDonations));
      } else {
        // Add sample data for development
        const sampleDonations = [
          {
            donationId: 1,
            medicineId: 1,
            donatedAt: new Date().toISOString(),
            status: 'Available'
          }
        ];
        setDonations(sampleDonations);
        localStorage.setItem('medishare_donations', JSON.stringify(sampleDonations));
      }
      
      if (savedMedicines) {
        setMedicines(JSON.parse(savedMedicines));
      } else {
        // Add sample data for development
        const sampleMedicines = [
          {
            medicineId: 1,
            medicineName: 'Paracetamol 500mg',
            description: 'Pain relief tablets',
            quantity: 50,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'available'
          }
        ];
        setMedicines(sampleMedicines);
        localStorage.setItem('medishare_medicines', JSON.stringify(sampleMedicines));
      }
      
      toast({
        title: "Connection Error",
        description: "Using offline data. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = user?.id || user?.userId || user?.donorId;
      
      if (!userId) {
        console.warn('No valid user ID found:', user);
        toast({
          title: "Authentication Error",
          description: "User ID not found. Please try logging in again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Load medicines and donations from API
      const [medicinesData, donationsData] = await Promise.all([
        medicineService.getMedicinesByDonor(userId),
        donationService.getDonationsByDonor(userId)
      ]);
      
      setMedicines(Array.isArray(medicinesData) ? medicinesData : []);
      setDonations(Array.isArray(donationsData) ? donationsData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Fallback to localStorage for development
    const savedDonations = localStorage.getItem('medishare_donations');
      const savedMedicines = localStorage.getItem('medishare_medicines');
      
    if (savedDonations) {
      setDonations(JSON.parse(savedDonations));
    }
      
      if (savedMedicines) {
        setMedicines(JSON.parse(savedMedicines));
      } else {
        // Add sample data for development
        const sampleMedicines = [
          {
            medicineId: 1,
            medicineName: 'Paracetamol 500mg',
            description: 'Pain relief tablets',
            quantity: 50,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'available'
          }
        ];
        setMedicines(sampleMedicines);
        localStorage.setItem('medishare_medicines', JSON.stringify(sampleMedicines));
      }
      
      toast({
        title: "Connection Error",
        description: "Using offline data. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();

    if (!newMedicine.medicineName || !newMedicine.quantity || !newMedicine.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const userId = user?.id || user?.userId || user?.donorId;
      
      if (!userId) {
        toast({
          title: "Authentication Error",
          description: "User ID not found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      const medicineData = {
        medicineName: newMedicine.medicineName,
        description: newMedicine.description,
        expiryDate: newMedicine.expiryDate,
        quantity: parseInt(newMedicine.quantity),
        donorId: userId,
        status: newMedicine.status
      };

      await medicineService.createMedicine(medicineData);
      await loadData(); // Reload data
      
      toast({
        title: "Medicine added successfully!",
        description: `${newMedicine.medicineName} has been added to your inventory.`,
      });

      setNewMedicine({
        medicineName: '',
        description: '',
        expiryDate: '',
        quantity: '',
        status: 'available'
      });
      setShowAddMedicineDialog(false);

    } catch (error) {
      console.error('Error adding medicine:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add medicine",
        variant: "destructive",
      });
    }
  };

  const handleDonationFormSubmit = (e) => {
    e.preventDefault();

    if (!newDonation.medicineId) {
      toast({
        title: "Validation Error",
        description: "Please select a medicine to donate",
        variant: "destructive",
      });
      return;
    }

    setShowDonateDialog(false);
    setShowReviewDialog(true);
  };

  const handleConfirmDonation = async () => {
    try {
      const donationData = {
        medicineId: parseInt(newDonation.medicineId),
        donatedToNgoId: newDonation.donatedToNgoId ? parseInt(newDonation.donatedToNgoId) : null,
        quantityDonated: newDonation.quantityDonated ? parseInt(newDonation.quantityDonated) : null,
        status: newDonation.status
      };

      await donationService.createDonation(donationData);
      await loadData(); // Reload data

      const selectedMedicine = medicines.find(m => m?.medicineId === parseInt(newDonation.medicineId));

    toast({
      title: "Medicine donated successfully!",
        description: `${selectedMedicine?.medicineName || 'Medicine'} has been added to your donations.`,
    });

    setNewDonation({
        medicineId: '',
        donatedToNgoId: null,
        quantityDonated: '',
        status: 'available'
      });
    setShowReviewDialog(false);

    } catch (error) {
      console.error('Error creating donation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create donation",
        variant: "destructive",
      });
    }
  };

  // Safe filtering with null checks
  const filteredDonations = (donations || []).filter(donation => {
    if (!donation) return false;
    
    // Try to find the medicine name from the medicines array
    const medicine = medicines.find(m => m?.medicineId === donation?.medicineId);
    const medicineName = medicine?.medicineName || 'Unknown Medicine';
    
    return medicineName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = [
    {
      title: 'Total Donations',
      value: donations?.length || 0,
      icon: Package,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Available',
      value: (donations || []).filter(d => d?.status?.toLowerCase() === 'available').length,
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Donated',
      value: (donations || []).filter(d => d?.status?.toLowerCase() === 'donated').length,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Lives Impacted',
      value: ((donations || []).filter(d => d?.status?.toLowerCase() === 'donated').length * 3),
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Demo Mode</h2>
            <p className="text-gray-400">Running in demo mode. You can test the donation functionality.</p>
            <Button 
              onClick={() => {
                const mockUser = { id: 1, name: 'Demo Donor', userId: 1, donorId: 1 };
                loadDataWithUser(mockUser);
              }}
              className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              Start Demo
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Debug logging
  console.log('DonorDashboard render - user:', user, 'medicines:', medicines, 'donations:', donations);

  return (
    <>
      <Helmet>
        <title>Donor Dashboard - MediShare</title>
        <meta name="description" content="Manage your medicine donations and track their impact on the community." />
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-white/10"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Welcome back, {user?.name || user?.username || 'Demo Donor'}!
                    </h1>
                    <p className="text-gray-400 text-lg">Thank you for making a difference in people's lives</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4 max-w-2xl">
                  Your donations help save lives. Track your contributions and see the impact you're making in the community.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-green-400 text-green-400 px-4 py-2">
                  <Heart className="w-4 h-4 mr-2" />
                  Donor Portal
                </Badge>
                <Button
                  onClick={() => setShowAddMedicineDialog(true)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
                <Button
                  onClick={() => setShowDonateDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Donate Medicine
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${stat.bgColor} border border-white/10`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by medicine name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          {/* Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-green-500/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Donations</h2>

                {(!donations || donations.length === 0) ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No donations yet</h3>
                    <p className="text-gray-400 mb-6">Start making a difference by adding and donating your unused medicines</p>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => setShowAddMedicineDialog(true)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medicine First
                      </Button>
                    <Button
                        onClick={() => setShowDonateDialog(true)}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                        Donate Medicine
                    </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredDonations.map((donation, index) => (
                      <div key={donation?.donationId || `donation-${index}`} className="medicine-card p-4 rounded-lg bg-slate-700/30 border border-white/10">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                                          <h3 className="text-lg font-semibold text-white">
                              {(() => {
                                const medicine = medicines.find(m => m?.medicineId === donation?.medicineId);
                                return medicine?.medicineName || 'Unknown Medicine';
                              })()}
                            </h3>
                              <Badge variant={donation?.status === 'available' ? 'default' : 'secondary'}>
                                {donation?.status || 'unknown'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-400">
                              <span>Quantity: {(() => {
                                const medicine = medicines.find(m => m?.medicineId === donation?.medicineId);
                                return medicine?.quantity || 'N/A';
                              })()}</span>
                              <span>Expires: {(() => {
                                const medicine = medicines.find(m => m?.medicineId === donation?.medicineId);
                                return medicine?.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString() : 'N/A';
                              })()}</span>
                              <span>Donated: {donation?.donatedAt ? new Date(donation.donatedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {(() => {
                              const medicine = medicines.find(m => m?.medicineId === donation?.medicineId);
                              return medicine?.description ? (
                                <p className="text-gray-300 mt-2 text-sm">{medicine.description}</p>
                              ) : null;
                            })()}
                            </div>
                            <div className="flex items-center gap-2">
                            {donation?.donatedToNgoId && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                Donated to {donation?.ngoName || 'NGO'}
                                </Badge>
                              )}
                          </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Add Medicine Dialog */}
        <Dialog open={showAddMedicineDialog} onOpenChange={setShowAddMedicineDialog}>
          <DialogContent className="bg-slate-800 border-green-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Medicine</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div>
                <Label htmlFor="medicineName" className="text-white">Medicine Name *</Label>
                <Input
                  id="medicineName"
                  type="text"
                  value={newMedicine.medicineName}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, medicineName: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Enter medicine name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={newMedicine.description}
                  onChange={(e) => setNewMedicine(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Enter medicine description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-white">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, quantity: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Enter quantity"
                    min="1"
                    required
                />
              </div>

              <div>
                  <Label htmlFor="expiryDate" className="text-white">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddMedicineDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Add Medicine
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Donate Medicine Dialog */}
        <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
          <DialogContent className="bg-slate-800 border-green-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Donate Medicine</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleDonationFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="medicineId" className="text-white">Select Medicine *</Label>
                <Select 
                  value={newDonation.medicineId} 
                  onValueChange={(value) => setNewDonation(prev => ({ ...prev, medicineId: value }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Choose a medicine to donate" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    {(!medicines || medicines.length === 0) ? (
                      <SelectItem value="" disabled>
                        <span className="text-gray-400">No medicines available. Add medicines first.</span>
                      </SelectItem>
                    ) : (
                      medicines
                        .filter(medicine => medicine?.status?.toLowerCase() === 'available')
                        .map((medicine) => (
                          <SelectItem key={medicine?.medicineId || Math.random()} value={medicine?.medicineId?.toString() || ''}>
                            <div className="flex flex-col">
                              <span className="text-white">{medicine?.medicineName || 'Unknown Medicine'}</span>
                              <span className="text-gray-400 text-sm">
                                Qty: {medicine?.quantity || 'N/A'} | Expires: {medicine?.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantityDonated" className="text-white">Quantity to Donate</Label>
                <Input
                  id="quantityDonated"
                  type="number"
                  value={newDonation.quantityDonated}
                  onChange={(e) => setNewDonation(prev => ({ ...prev, quantityDonated: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Leave empty to donate all"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-white">Status</Label>
                <Select 
                  value={newDonation.status} 
                  onValueChange={(value) => setNewDonation(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="donated">Donated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDonateDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  Preview
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="bg-slate-800 border-blue-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Review Your Donation</DialogTitle>
            </DialogHeader>

            <div className="text-white space-y-4">
              {(() => {
                const selectedMedicine = medicines.find(m => m?.medicineId === parseInt(newDonation.medicineId));
                return (
                  <>
                    <p><strong>Medicine Name:</strong> {selectedMedicine?.medicineName || 'Unknown Medicine'}</p>
                    <p><strong>Available Quantity:</strong> {selectedMedicine?.quantity || 'N/A'}</p>
                    <p><strong>Quantity to Donate:</strong> {newDonation.quantityDonated || selectedMedicine?.quantity || 'All'}</p>
                    {selectedMedicine?.expiryDate && (
                      <p><strong>Expiry Date:</strong> {new Date(selectedMedicine.expiryDate).toLocaleDateString()}</p>
                    )}
                    <p><strong>Status:</strong> {newDonation.status}</p>
                    {selectedMedicine?.description && (
                      <p><strong>Description:</strong> {selectedMedicine.description}</p>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewDialog(false);
                  setShowDonateDialog(true);
                }}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                onClick={handleConfirmDonation}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Confirm Donation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default DonorDashboard;