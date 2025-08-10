import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Hash, 
  User, 
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { medicineService } from '@/services/medicineService';

const MedicinePage = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    ExpiryDate: '',
    Quantity: '',
    DonorID: '',
    Status: 'Pending'
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  useEffect(() => {
    filterMedicines();
  }, [medicines, searchTerm, statusFilter]);

  const loadMedicines = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicineService.getAllMedicines();
      console.log('Loaded medicines from API:', data);
      setMedicines(data);
      setRetryCount(0);
    } catch (error) {
      console.error('Error loading medicines:', error);
      setError(error.message);
      setRetryCount(prev => prev + 1);
      
      toast({
        title: "Error",
        description: `Failed to load medicines: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadMedicines();
  };

  const filterMedicines = () => {
    let filtered = medicines;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        (medicine.Name && medicine.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (medicine.Description && medicine.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (medicine.MedicineID && medicine.MedicineID.toString().includes(searchTerm))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(medicine => 
        medicine.Status && medicine.Status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredMedicines(filtered);
  };

  const handleAddMedicine = async () => {
    try {
      // Validate form data
      const validationErrors = medicineService.validateMedicineData(formData);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive"
        });
        return;
      }

      const newMedicine = await medicineService.addMedicine(formData);
      setMedicines(prev => [...prev, newMedicine]);
      
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Medicine added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add medicine: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleEditMedicine = async () => {
    try {
      if (!selectedMedicine) return;

      // Validate form data
      const validationErrors = medicineService.validateMedicineData(formData);
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive"
        });
        return;
      }

      const updatedMedicine = await medicineService.updateMedicine(selectedMedicine.MedicineID, formData);
      
      setMedicines(prev => prev.map(med =>
        med.MedicineID === selectedMedicine.MedicineID ? updatedMedicine : med
      ));

      setIsEditDialogOpen(false);
      setSelectedMedicine(null);
      resetForm();
      toast({
        title: "Success",
        description: "Medicine updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update medicine: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      await medicineService.deleteMedicine(medicineId);
      setMedicines(prev => prev.filter(med => med.MedicineID !== medicineId));
      
      toast({
        title: "Success",
        description: "Medicine deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete medicine: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      ExpiryDate: '',
      Quantity: '',
      DonorID: '',
      Status: 'Pending'
    });
  };

  const openEditDialog = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      Name: medicine.Name || '',
      Description: medicine.Description || '',
      ExpiryDate: medicine.ExpiryDate || '',
      Quantity: (medicine.Quantity || 0).toString(),
      DonorID: (medicine.DonorID || 0).toString(),
      Status: medicine.Status || 'Pending'
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (medicine) => {
    setSelectedMedicine(medicine);
    setIsViewDialogOpen(true);
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    switch (status.toLowerCase()) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'donated': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'reserved': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'disposed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    if (!status) return <AlertCircle className="w-4 h-4" />;
    
    switch (status.toLowerCase()) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'donated': return <Package className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'reserved': return <Clock className="w-4 h-4" />;
      case 'disposed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatQuantity = (quantity) => {
    if (quantity === null || quantity === undefined || quantity === '') return 'N/A';
    return quantity.toString();
  };

  const stats = [
    {
      title: 'Total Medicines',
      value: medicines.length,
      icon: Pill,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20'
    },
    {
      title: 'Pending',
      value: medicines.filter(m => m.Status && m.Status.toLowerCase() === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Verified',
      value: medicines.filter(m => m.Status && m.Status.toLowerCase() === 'verified').length,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Available',
      value: medicines.filter(m => m.Status && m.Status.toLowerCase() === 'available').length,
      icon: Package,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    }
  ];

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading medicines from server...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Failed to load medicines</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleRetry} className="bg-cyan-600 hover:bg-cyan-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry ({retryCount < 3 ? 3 - retryCount : '∞'})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-white/20 text-white"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Helmet>
        <title>Medicine Management - MediShare</title>
        <meta name="description" content="Manage medicine inventory, add new medicines, and track medicine status." />
      </Helmet>

      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white">Medicine Management</h1>
              <p className="text-gray-400 mt-2">Central hub for managing all medicine data</p>
            </div>
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Medicine Hub</span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-effect p-6 border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Available">Available</option>
                <option value="Donated">Donated</option>
                <option value="Reserved">Reserved</option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
              <Button
                variant="outline"
                onClick={() => toast({
                  title: "🚧 Feature coming soon!",
                  description: "Export functionality will be available soon! 🚀"
                })}
                className="border-cyan-500/30 text-cyan-400"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Medicines List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-effect border-cyan-500/20">
              <div className="p-6">
                {filteredMedicines.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-medium text-white mb-2">
                      {searchTerm || statusFilter !== 'all' ? 'No medicines found' : 'No medicines available'}
                    </h4>
                    <p className="text-gray-400 mb-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Add your first medicine to get started'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Medicine
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMedicines.map((medicine) => (
                      <div key={medicine.MedicineID} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-white text-lg">{medicine.Name || 'Unknown Medicine'}</h4>
                            <Badge variant="outline" className="text-xs">
                              ID: {medicine.MedicineID || 'N/A'}
                            </Badge>
                            <Badge className={getStatusColor(medicine.Status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(medicine.Status)}
                                {medicine.Status || 'Unknown'}
                              </div>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">Qty:</span>
                              <span className="text-white">{formatQuantity(medicine.Quantity)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">Expires:</span>
                              <span className="text-white">{formatDate(medicine.ExpiryDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">Donor:</span>
                              <span className="text-white">{medicine.DonorID || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Created:</span>
                              <span className="text-white">{formatDate(medicine.CreatedAt)}</span>
                            </div>
                          </div>
                          {medicine.Description && (
                            <p className="text-sm text-gray-400 mt-2">{medicine.Description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openViewDialog(medicine)}
                            className="border-blue-500/30 text-blue-400"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(medicine)}
                            className="border-yellow-500/30 text-yellow-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMedicine(medicine.MedicineID)}
                            className="border-red-500/30 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-slate-800 border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Medicine Name</Label>
                <Input
                  id="name"
                  value={formData.Name}
                  onChange={(e) => setFormData({...formData, Name: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.Description}
                  onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Enter medicine description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-white">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.ExpiryDate}
                    onChange={(e) => setFormData({...formData, ExpiryDate: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-white">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.Quantity}
                    onChange={(e) => setFormData({...formData, Quantity: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donorId" className="text-white">Donor ID</Label>
                  <Input
                    id="donorId"
                    type="number"
                    value={formData.DonorID}
                    onChange={(e) => setFormData({...formData, DonorID: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter donor ID"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-white">Status</Label>
                  <select
                    id="status"
                    value={formData.Status}
                    onChange={(e) => setFormData({...formData, Status: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Available">Available</option>
                    <option value="Donated">Donated</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMedicine}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Add Medicine
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Medicine Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-slate-800 border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Medicine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-white">Medicine Name</Label>
                <Input
                  id="edit-name"
                  value={formData.Name}
                  onChange={(e) => setFormData({...formData, Name: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Enter medicine name"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-white">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.Description}
                  onChange={(e) => setFormData({...formData, Description: e.target.value})}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Enter medicine description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-expiryDate" className="text-white">Expiry Date</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={formData.ExpiryDate}
                    onChange={(e) => setFormData({...formData, ExpiryDate: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quantity" className="text-white">Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={formData.Quantity}
                    onChange={(e) => setFormData({...formData, Quantity: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-donorId" className="text-white">Donor ID</Label>
                  <Input
                    id="edit-donorId"
                    type="number"
                    value={formData.DonorID}
                    onChange={(e) => setFormData({...formData, DonorID: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter donor ID"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status" className="text-white">Status</Label>
                  <select
                    id="edit-status"
                    value={formData.Status}
                    onChange={(e) => setFormData({...formData, Status: e.target.value})}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Available">Available</option>
                    <option value="Donated">Donated</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedMedicine(null);
                    resetForm();
                  }}
                  className="border-white/20 text-white"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditMedicine}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Update Medicine
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Medicine Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-slate-800 border-cyan-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Medicine Details</DialogTitle>
            </DialogHeader>
            {selectedMedicine && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Medicine ID</Label>
                    <p className="text-white font-medium">{selectedMedicine.MedicineID || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Status</Label>
                    <Badge className={getStatusColor(selectedMedicine.Status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedMedicine.Status)}
                        {selectedMedicine.Status || 'Unknown'}
                      </div>
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Name</Label>
                  <p className="text-white font-medium">{selectedMedicine.Name || 'Unknown Medicine'}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Description</Label>
                  <p className="text-white">{selectedMedicine.Description || 'No description available'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Quantity</Label>
                    <p className="text-white font-medium">{formatQuantity(selectedMedicine.Quantity)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Donor ID</Label>
                    <p className="text-white font-medium">{selectedMedicine.DonorID || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm">Expiry Date</Label>
                    <p className="text-white font-medium">{formatDate(selectedMedicine.ExpiryDate)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Created At</Label>
                    <p className="text-white font-medium">{formatDate(selectedMedicine.CreatedAt)}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="border-white/20 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default MedicinePage; 