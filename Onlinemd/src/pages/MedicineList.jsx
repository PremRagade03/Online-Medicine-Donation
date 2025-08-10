import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Pill, 
  Calendar,
  Package,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { medicineService } from '@/services/medicineService';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  // Dummy data for medicines
  const dummyMedicines = [
    {
      id: 1,
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'Pain Relief',
      manufacturer: 'Johnson & Johnson',
      dosage: '500mg',
      form: 'Tablet',
      quantity: 1000,
      expiryDate: '2024-12-31',
      status: 'available',
      price: 5.99,
      description: 'Used for pain relief and fever reduction',
      batchNumber: 'BATCH001',
      storageCondition: 'Store in a cool, dry place',
      prescriptionRequired: false
    },
    {
      id: 2,
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotics',
      manufacturer: 'Pfizer',
      dosage: '250mg',
      form: 'Capsule',
      quantity: 500,
      expiryDate: '2024-08-15',
      status: 'available',
      price: 12.50,
      description: 'Broad-spectrum antibiotic for bacterial infections',
      batchNumber: 'BATCH002',
      storageCondition: 'Store in refrigerator',
      prescriptionRequired: true
    },
    {
      id: 3,
      name: 'Omeprazole 20mg',
      genericName: 'Omeprazole',
      category: 'Gastrointestinal',
      manufacturer: 'AstraZeneca',
      dosage: '20mg',
      form: 'Capsule',
      quantity: 300,
      expiryDate: '2024-06-30',
      status: 'low_stock',
      price: 18.75,
      description: 'Proton pump inhibitor for acid reflux',
      batchNumber: 'BATCH003',
      storageCondition: 'Store at room temperature',
      prescriptionRequired: true
    },
    {
      id: 4,
      name: 'Ibuprofen 400mg',
      genericName: 'Ibuprofen',
      category: 'Pain Relief',
      manufacturer: 'Bayer',
      dosage: '400mg',
      form: 'Tablet',
      quantity: 800,
      expiryDate: '2025-03-15',
      status: 'available',
      price: 8.25,
      description: 'Non-steroidal anti-inflammatory drug',
      batchNumber: 'BATCH004',
      storageCondition: 'Store in a cool, dry place',
      prescriptionRequired: false
    },
    {
      id: 5,
      name: 'Metformin 500mg',
      genericName: 'Metformin',
      category: 'Diabetes',
      manufacturer: 'Merck',
      dosage: '500mg',
      form: 'Tablet',
      quantity: 200,
      expiryDate: '2024-09-20',
      status: 'expiring_soon',
      price: 15.99,
      description: 'Oral diabetes medication',
      batchNumber: 'BATCH005',
      storageCondition: 'Store at room temperature',
      prescriptionRequired: true
    },
    {
      id: 6,
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine',
      category: 'Allergy',
      manufacturer: 'GSK',
      dosage: '10mg',
      form: 'Tablet',
      quantity: 1200,
      expiryDate: '2025-01-10',
      status: 'available',
      price: 6.50,
      description: 'Antihistamine for allergy relief',
      batchNumber: 'BATCH006',
      storageCondition: 'Store in a cool, dry place',
      prescriptionRequired: false
    }
  ];

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const data = await medicineService.getAllMedicines();
      console.log('Loaded medicines from API:', data);
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (error) {
      console.error('Error loading medicines:', error);
      // Fallback to dummy data if API fails
      setMedicines(dummyMedicines);
      setFilteredMedicines(dummyMedicines);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = medicines;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        (medicine.Name || medicine.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (medicine.GenericName || medicine.genericName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (medicine.Manufacturer || medicine.manufacturer || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(medicine => (medicine.Category || medicine.category) === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(medicine => (medicine.Status || medicine.status) === selectedStatus);
    }

    setFilteredMedicines(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, medicines]);

  const handleDelete = async (medicineId) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicineService.deleteMedicine(medicineId);
        const updatedMedicines = medicines.filter(medicine => (medicine.MedicineID || medicine.id) !== medicineId);
        setMedicines(updatedMedicines);
        setFilteredMedicines(updatedMedicines);
      } catch (error) {
        console.error('Error deleting medicine:', error);
        alert('Failed to delete medicine. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'expiring_soon':
        return 'bg-orange-100 text-orange-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Pain Relief':
        return 'bg-red-100 text-red-800';
      case 'Antibiotics':
        return 'bg-blue-100 text-blue-800';
      case 'Gastrointestinal':
        return 'bg-purple-100 text-purple-800';
      case 'Diabetes':
        return 'bg-green-100 text-green-800';
      case 'Allergy':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  };

  const getCategories = () => {
    return [...new Set(medicines.map(medicine => medicine.Category || medicine.category))];
  };

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
            <h1 className="text-3xl font-bold text-white">Medicines</h1>
            <p className="text-gray-400 mt-1">Manage medicine inventory and information</p>
          </div>
          <Button
            onClick={() => navigate('/medicines/new')}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Medicine
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="expiring_soon">Expiring Soon</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Medicines</p>
                  <p className="text-2xl font-bold text-white">{medicines.length}</p>
                </div>
                <Pill className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-white">
                    {medicines.filter(m => (m.Status || m.status) === 'available').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Low Stock</p>
                  <p className="text-2xl font-bold text-white">
                    {medicines.filter(m => (m.Status || m.status) === 'low_stock').length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Expiring Soon</p>
                  <p className="text-2xl font-bold text-white">
                    {medicines.filter(m => isExpiringSoon(m.ExpiryDate || m.expiryDate)).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medicines List */}
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Medicine Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine.MedicineID || medicine.id}
                  className={`flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all ${
                    isExpired(medicine.ExpiryDate || medicine.expiryDate) ? 'border-red-500/50 bg-red-500/5' : ''
                  }`}
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Pill className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{medicine.Name || medicine.name}</h3>
                          <p className="text-sm text-gray-400">{medicine.GenericName || medicine.genericName || 'N/A'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span>{medicine.Manufacturer || medicine.manufacturer || 'N/A'}</span>
                            <span>{medicine.Dosage || medicine.dosage || 'N/A'} {medicine.Form || medicine.form || 'N/A'}</span>
                            <span>Qty: {medicine.Quantity || medicine.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(medicine.Status || medicine.status)}>
                          {(medicine.Status || medicine.status || '').replace('_', ' ')}
                        </Badge>
                        <Badge className={getCategoryColor(medicine.Category || medicine.category)}>
                          {medicine.Category || medicine.category || 'General'}
                        </Badge>
                        {(medicine.PrescriptionRequired || medicine.prescriptionRequired) && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Prescription Required
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white ml-2">${medicine.Price || medicine.price || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Expiry:</span>
                        <span className={`ml-2 ${
                          isExpired(medicine.ExpiryDate || medicine.expiryDate) ? 'text-red-400' : 
                          isExpiringSoon(medicine.ExpiryDate || medicine.expiryDate) ? 'text-orange-400' : 'text-white'
                        }`}>
                          {new Date(medicine.ExpiryDate || medicine.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Batch:</span>
                        <span className="text-white ml-2">{medicine.BatchNumber || medicine.batchNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white ml-2">#{medicine.MedicineID || medicine.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/medicines/${medicine.MedicineID || medicine.id}`)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/medicines/${medicine.MedicineID || medicine.id}/edit`)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(medicine.MedicineID || medicine.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredMedicines.length === 0 && (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No medicines found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MedicineList; 
