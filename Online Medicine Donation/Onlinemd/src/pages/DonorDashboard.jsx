import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Plus, Package, Clock, CheckCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

// Services
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

// Enhanced Medicine Service with proper data transformation
const medicineService = {
  async getMedicinesByDonor(donorId) {
    console.log('Fetching medicines for donor ID:', donorId);
    const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch medicines: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    
    // Transform the data to ensure consistent property names
    return this.transformMedicineData(data);
  },

  // Transform backend data to consistent frontend format
  transformMedicineData(backendData) {
    if (!Array.isArray(backendData)) {
      backendData = [backendData];
    }

    console.log('Transforming medicine data:', backendData);

    return backendData.map(item => {
      console.log('Processing medicine item:', item);
      
      const transformed = {
        MedicineID: item.id || item.MedicineID || item.medicineId || item.MedicineId,
        Name: item.name || item.Name || item.medicineName || item.MedicineName || item.medicine_name || 'Unknown Medicine',
        Description: item.description || item.Description || item.medicineDescription || 'No description available',
        ExpiryDate: item.expiryDate || item.ExpiryDate || item.expiry_date || item.ExpirationDate,
        Quantity: item.quantity || item.Quantity || item.medicineQuantity || 0,
        DonorID: item.donorId || item.DonorID || item.donor_id || item.DonorId || 0,
        Status: item.status || item.Status || 'available',
        CreatedAt: item.createdAt || item.CreatedAt || item.created_at || item.DateCreated || new Date().toISOString(),
        Category: item.category || item.Category || 'General',
        Manufacturer: item.manufacturer || item.Manufacturer || 'Unknown',
        Dosage: item.dosage || item.Dosage || 'N/A',
        Form: item.form || item.Form || 'N/A'
      };
      
      console.log('Transformed medicine:', transformed);
      return transformed;
    });
  }
};

const donationService = {
  async getDonationsByDonor(donorId) {
    console.log('Fetching donations for donor ID:', donorId);
    const response = await fetch(`${API_BASE_URL}/donations/donor/${donorId}`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch donations: ${response.status} ${errorText}`);
    }
    return await response.json();
  },

  async createDonation(donationData) {
    console.log('Creating donation with data:', donationData);
    
    // Validate expiry date on frontend
    const expiryDate = new Date(donationData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate <= today) {
      throw new Error('Expiry date must be in the future');
    }

    // Match the DTO structure expected by backend
    const requestBody = {
      DonorId: parseInt(donationData.donorId),
      MedicineName: donationData.medicineName.trim(),
      Description: donationData.description?.trim() || '',
      ExpiryDate: donationData.expiryDate, // Backend expects DateOnly in YYYY-MM-DD format
      Quantity: parseInt(donationData.quantity),
      DonorNotes: donationData.donorNotes?.trim() || ''
    };

    console.log('Request body being sent:', requestBody);

    const response = await fetch(`${API_BASE_URL}/donations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = errorData.message || errorData.error || errorData.title || 'Failed to create donation';
        if (errorData.details) {
          errorText += ` Details: ${errorData.details}`;
        }
      } catch {
        errorText = await response.text() || `HTTP ${response.status}: Failed to create donation`;
      }
      
      console.error('Create donation error:', response.status, errorText);
      throw new Error(errorText);
    }

    const result = await response.json();
    console.log('Donation created successfully:', result);
    return result;
  }
};

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newDonation, setNewDonation] = useState({
    medicineName: '',
    description: '',
    expiryDate: '',
    quantity: '',
    donorNotes: ''
  });

  // Helper function to extract user ID from different possible user object structures
  const getUserId = (userObj) => {
    if (!userObj) return null;
    
    // Try different possible property names
    return userObj.UserId || 
           userObj.userId || 
           userObj.id || 
           userObj.donorId || 
           userObj.DonorId || 
           userObj.user_id ||
           null;
  };

  // Helper function to safely get medicine name
  const getMedicineName = (medicine) => {
    if (!medicine) return 'Unknown Medicine';
    
    // Try all possible property names for medicine name
    const possibleNames = [
      'Name', 'name', 'MedicineName', 'medicineName', 
      'medicine_name', 'title', 'Title', 'drugName', 'DrugName'
    ];
    
    for (const prop of possibleNames) {
      if (medicine[prop] && typeof medicine[prop] === 'string' && medicine[prop].trim()) {
        return medicine[prop].trim();
      }
    }
    
    console.warn('No medicine name found in object:', medicine);
    return 'Unknown Medicine';
  };

  // Helper function to safely get any property
  const getMedicineProperty = (medicine, propNames, defaultValue = 'N/A') => {
    if (!medicine) return defaultValue;
    
    const props = Array.isArray(propNames) ? propNames : [propNames];
    
    for (const prop of props) {
      if (medicine[prop] !== undefined && medicine[prop] !== null) {
        return medicine[prop];
      }
    }
    
    return defaultValue;
  };

  useEffect(() => {
    console.log('User object in useEffect:', user);
    console.log('Available user properties:', user ? Object.keys(user) : 'No user');
    
    const userId = getUserId(user);
    console.log('Extracted user ID:', userId);

    if (userId) {
      loadData(userId);
    } else {
      console.log('No user found, loading with fallback');
      setLoading(false);
    }
  }, [user]);

  const loadData = async (userId) => {
    try {
      setLoading(true);
      console.log('Loading data for user ID:', userId);
      
      // Load both donations and medicines
      const [donationsData, medicinesData] = await Promise.allSettled([
        donationService.getDonationsByDonor(userId),
        medicineService.getMedicinesByDonor(userId)
      ]);
      
      console.log('Loaded donations:', donationsData);
      console.log('Loaded medicines:', medicinesData);
      
      // Log raw backend data for debugging
      if (medicinesData.status === 'fulfilled' && medicinesData.value) {
        console.log('Raw medicine data from backend:', medicinesData.value);
        console.log('First medicine object keys:', medicinesData.value[0] ? Object.keys(medicinesData.value[0]) : 'No medicines');
      }
      
      setDonations(donationsData.status === 'fulfilled' && Array.isArray(donationsData.value) ? donationsData.value : []);
      setMedicines(medicinesData.status === 'fulfilled' && Array.isArray(medicinesData.value) ? medicinesData.value : []);
      
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Show error message
      toast({
        title: "Connection Error",
        description: `Failed to load data: ${error.message}`,
        variant: "destructive",
      });
      
      // Set empty arrays instead of demo data
      setDonations([]);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewDonation({
      medicineName: '',
      description: '',
      expiryDate: '',
      quantity: '',
      donorNotes: ''
    });
  };

  const handleDonationFormSubmit = (e) => {
    e.preventDefault();

    if (!newDonation.medicineName.trim() || !newDonation.quantity || !newDonation.expiryDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate quantity is a positive number
    const quantity = parseInt(newDonation.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Quantity must be a positive number",
        variant: "destructive",
      });
      return;
    }

    // Validate expiry date is in the future
    const expiryDate = new Date(newDonation.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for proper date comparison
    
    if (expiryDate <= today) {
      toast({
        title: "Invalid Expiry Date",
        description: "Medicine expiry date must be in the future",
        variant: "destructive",
      });
      return;
    }

    setShowDonateDialog(false);
    setShowReviewDialog(true);
  };

  const handleConfirmDonation = async () => {
    try {
      setSubmitting(true);
      
      const userId = getUserId(user);
      
      if (!userId) {
        console.error('No valid user ID found. User object:', user);
        toast({
          title: "Authentication Error",
          description: "User ID not found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      const donationData = {
        donorId: userId,
        medicineName: newDonation.medicineName.trim(),
        description: newDonation.description.trim(),
        expiryDate: newDonation.expiryDate, // YYYY-MM-DD format for DateOnly
        quantity: parseInt(newDonation.quantity),
        donorNotes: newDonation.donorNotes.trim()
      };

      console.log('Submitting donation with data:', donationData);
      const result = await donationService.createDonation(donationData);
      
      // Close dialog first
      setShowReviewDialog(false);
      
      // Show success message
      toast({
        title: "🎉 Donation Successful!",
        description: `${newDonation.medicineName} has been added to your donation record and is now available in the medicine inventory. Thank you for your generosity!`,
        className: "bg-green-800 text-white border-green-600",
      });

      // Reset form
      resetForm();
      
      // Reload data to show the new donation and created medicine
      await loadData(userId);

    } catch (error) {
      console.error('Error creating donation:', error);
      toast({
        title: "Donation Failed",
        description: error.message || "Failed to create donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter medicines and donations with improved name extraction
  const filteredMedicines = medicines.filter(med => {
    if (!med) return false;
    const medicineName = getMedicineName(med);
    return medicineName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredDonations = donations.filter(donation => {
    if (!donation) return false;
    const medicineName = donation.MedicineName || donation.medicineName || 'Unknown Medicine';
    return medicineName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Updated stats to be more accurate
  const stats = [
    {
      title: 'Total Donations',
      value: donations?.length || 0,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    },
    {
      title: 'Medicines Created',
      value: medicines?.length || 0,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Available for Distribution',
      value: medicines?.filter(m => getMedicineProperty(m, ['Status', 'status'], '').toLowerCase() === 'available').length || 0,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Total Quantity Donated',
      value: donations?.reduce((sum, donation) => sum + (donation?.Quantity || donation?.quantity || 0), 0) || 0,
      icon: Activity,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-green-400 rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading your donations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
            className="p-6 border bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border-white/10"
          >
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center mb-2 space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      Welcome back, {user?.name || user?.Name || user?.username || 'Donor'}!
                    </h1>
                    <p className="text-lg text-gray-400">Thank you for making a difference in people's lives</p>
                  </div>
                </div>
                <p className="max-w-2xl mt-4 text-gray-300">
                  Your donations create both donation records and medicine inventory entries that are immediately available for distribution to those in need.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-4 py-2 text-green-400 border-green-400">
                  <Heart className="w-4 h-4 mr-2" />
                  Donor Portal
                </Badge>
                <Button
                  onClick={() => setShowDonateDialog(true)}
                  className="text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Donate Medicine
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 transition-all duration-300 border bg-gradient-to-br from-slate-800 to-slate-700 border-white/10 hover:border-white/20 hover:shadow-xl hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-medium text-gray-400">{stat.title}</p>
                      <p className="mb-2 text-3xl font-bold text-white">{stat.value}</p>
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
              className="text-white bg-white/5 border-white/20"
            />
          </div>

          {/* Medicine Inventory Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-blue-500/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Medicine Inventory Created by You</h2>
                  <Badge variant="outline" className="text-blue-400 border-blue-400">
                    <Package className="w-4 h-4 mr-2" />
                    {filteredMedicines.length} items
                  </Badge>
                </div>

                {filteredMedicines.length === 0 ? (
                  <div className="py-12 text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-white">No medicines in inventory yet</h3>
                    <p className="mb-6 text-gray-400">Start donating to create your first medicine inventory record</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredMedicines.map((medicine, index) => (
                      <div key={getMedicineProperty(medicine, ['MedicineID', 'id'], `med-${index}`)} className="p-4 border rounded-lg bg-slate-700/30 border-white/10">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {getMedicineName(medicine)}
                              </h3>
                              <Badge variant="default" className="text-blue-400 border-blue-400 bg-blue-500/20">
                                {getMedicineProperty(medicine, ['Status', 'status'], 'available')}
                              </Badge>
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                ID: {getMedicineProperty(medicine, ['MedicineID', 'id'], 'N/A')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-400 sm:grid-cols-3">
                              <span>Quantity: {getMedicineProperty(medicine, ['Quantity', 'quantity'], 'N/A')}</span>
                              <span>Expires: {getMedicineProperty(medicine, ['ExpiryDate', 'expiryDate', 'expiry_date']) ? 
                                new Date(getMedicineProperty(medicine, ['ExpiryDate', 'expiryDate', 'expiry_date'])).toLocaleDateString() : 'N/A'}</span>
                              <span>Added: {getMedicineProperty(medicine, ['CreatedAt', 'createdAt', 'DateCreated']) ? 
                                new Date(getMedicineProperty(medicine, ['CreatedAt', 'createdAt', 'DateCreated'])).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {getMedicineProperty(medicine, ['Description', 'description']) !== 'N/A' && getMedicineProperty(medicine, ['Description', 'description']) !== 'No description available' && (
                              <p className="mt-2 text-sm text-gray-300">{getMedicineProperty(medicine, ['Description', 'description'])}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              Available for Distribution
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Donation History Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-effect border-green-500/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Your Donation History</h2>
                  <Badge variant="outline" className="text-green-400 border-green-400">
                    <Heart className="w-4 h-4 mr-2" />
                    {filteredDonations.length} records
                  </Badge>
                </div>

                {filteredDonations.length === 0 ? (
                  <div className="py-12 text-center">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-white">No donation records yet</h3>
                    <p className="mb-6 text-gray-400">Your donation history will appear here after your first donation</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredDonations.map((donation, index) => (
                      <div key={donation?.DonationId || `donation-${index}`} className="p-4 border rounded-lg bg-slate-700/30 border-white/10">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {donation?.MedicineName || donation?.medicineName || 'Unknown Medicine'}
                              </h3>
                              <Badge variant="secondary" className="text-green-400 bg-green-500/20 border-green-500/30">
                                {donation?.Status || donation?.status || 'pending'}
                              </Badge>
                              <Badge variant="outline" className="text-blue-400 border-blue-400">
                                DON-{String(donation?.DonationId || index + 1).padStart(3, '0')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-sm text-gray-400 sm:grid-cols-3">
                              <span>Quantity: {donation?.Quantity || donation?.quantity || 'N/A'}</span>
                              <span>Expires: {donation?.ExpiryDate ? 
                                new Date(donation.ExpiryDate).toLocaleDateString() : 'N/A'}</span>
                              <span>Donated: {donation?.CreatedAt ? 
                                new Date(donation.CreatedAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            {(donation?.Description || donation?.description) && (
                              <p className="mt-2 text-sm text-gray-300">{donation.Description || donation.description}</p>
                            )}
                            {(donation?.DonorNotes || donation?.donorNotes) && (
                              <p className="mt-2 text-sm italic text-gray-300">Notes: {donation.DonorNotes || donation.donorNotes}</p>
                            )}
                            {(donation?.AdminNotes || donation?.adminNotes) && (
                              <p className="mt-2 text-sm italic text-yellow-300">Admin Notes: {donation.AdminNotes || donation.adminNotes}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              <Clock className="w-3 h-3 mr-1" />
                              Donation Record
                            </Badge>
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

        {/* Donate Medicine Dialog */}
        <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
          <DialogContent className="bg-slate-800 border-green-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Donate Medicine</DialogTitle>
              <DialogDescription className="text-gray-300">
                Fill out the form below to donate medicine. This will create both a donation record and add the medicine to the inventory for distribution.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleDonationFormSubmit} className="space-y-4">
              <div>
                <Label htmlFor="medicineName" className="text-white">Medicine Name *</Label>
                <Input
                  id="medicineName"
                  type="text"
                  value={newDonation.medicineName}
                  onChange={(e) => setNewDonation(prev => ({ ...prev, medicineName: e.target.value }))}
                  className="text-white bg-white/5 border-white/20"
                  placeholder="Enter medicine name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={newDonation.description}
                  onChange={(e) => setNewDonation(prev => ({ ...prev, description: e.target.value }))}
                  className="text-white bg-white/5 border-white/20"
                  placeholder="Enter medicine description (optional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity" className="text-white">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newDonation.quantity}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, quantity: e.target.value }))}
                    className="text-white bg-white/5 border-white/20"
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
                    value={newDonation.expiryDate}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="text-white bg-white/5 border-white/20"
                    min={new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]} // Tomorrow
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="donorNotes" className="text-white">Additional Notes</Label>
                <Textarea
                  id="donorNotes"
                  value={newDonation.donorNotes}
                  onChange={(e) => setNewDonation(prev => ({ ...prev, donorNotes: e.target.value }))}
                  className="text-white bg-white/5 border-white/20"
                  placeholder="Any additional notes about the medicine (optional)"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDonateDialog(false)}
                  className="flex-1 text-white border-white/20 hover:bg-white/10"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  disabled={submitting}
                >
                  Preview Donation
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
              <DialogDescription className="text-gray-300">
                Please review your donation details below and confirm to proceed.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-white">
              <div className="p-4 border rounded-lg bg-slate-700/30 border-white/10">
                <p className="mb-2"><strong className="text-green-400">Medicine Name:</strong> {newDonation.medicineName}</p>
                <p className="mb-2"><strong className="text-green-400">Quantity:</strong> {newDonation.quantity} units</p>
                <p className="mb-2"><strong className="text-green-400">Expiry Date:</strong> {newDonation.expiryDate ? new Date(newDonation.expiryDate).toLocaleDateString() : 'N/A'}</p>
                {newDonation.description && (
                  <p className="mb-2"><strong className="text-green-400">Description:</strong> {newDonation.description}</p>
                )}
                {newDonation.donorNotes && (
                  <p className="mb-2"><strong className="text-green-400">Notes:</strong> {newDonation.donorNotes}</p>
                )}
              </div>
              
              <div className="p-4 border rounded-lg bg-blue-500/20 border-blue-500/30">
                <p className="text-sm text-blue-300">
                  <strong>✅ What happens next:</strong> This will:
                </p>
                <ul className="mt-2 ml-4 text-sm text-blue-300 list-disc">
                  <li>Create a donation record in your donation history</li>
                  <li>Add the medicine to the inventory for distribution</li>
                  <li>Make it immediately available for those in need</li>
                  <li>Track the impact of your generous contribution</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewDialog(false);
                  setShowDonateDialog(true);
                }}
                className="flex-1 text-white border-white/20 hover:bg-white/10"
                disabled={submitting}
              >
                Edit
              </Button>
              <Button
                onClick={handleConfirmDonation}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Donation
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default DonorDashboard;