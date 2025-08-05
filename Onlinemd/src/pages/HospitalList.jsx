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
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const navigate = useNavigate();

  // Dummy data for hospitals
  const dummyHospitals = [
    {
      id: 1,
      name: 'City General Hospital',
      address: '123 Main Street, Downtown',
      city: 'New York',
      state: 'NY',
      phone: '+1 (555) 123-4567',
      email: 'contact@citygeneral.com',
      status: 'active',
      type: 'General',
      beds: 500,
      rating: 4.5,
      joinedDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Memorial Medical Center',
      address: '456 Oak Avenue, Midtown',
      city: 'Los Angeles',
      state: 'CA',
      phone: '+1 (555) 234-5678',
      email: 'info@memorialmc.com',
      status: 'active',
      type: 'Specialized',
      beds: 300,
      rating: 4.8,
      joinedDate: '2023-02-20'
    },
    {
      id: 3,
      name: 'Community Health Center',
      address: '789 Pine Street, Suburb',
      city: 'Chicago',
      state: 'IL',
      phone: '+1 (555) 345-6789',
      email: 'hello@communityhealth.com',
      status: 'pending',
      type: 'Community',
      beds: 150,
      rating: 4.2,
      joinedDate: '2023-03-10'
    },
    {
      id: 4,
      name: 'Regional Medical Hospital',
      address: '321 Elm Street, Downtown',
      city: 'Houston',
      state: 'TX',
      phone: '+1 (555) 456-7890',
      email: 'contact@regionalmed.com',
      status: 'active',
      type: 'General',
      beds: 400,
      rating: 4.6,
      joinedDate: '2023-01-30'
    },
    {
      id: 5,
      name: 'University Medical Center',
      address: '654 College Blvd, Campus',
      city: 'Boston',
      state: 'MA',
      phone: '+1 (555) 567-8901',
      email: 'info@universitymed.com',
      status: 'active',
      type: 'Academic',
      beds: 600,
      rating: 4.9,
      joinedDate: '2023-02-15'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHospitals(dummyHospitals);
      setFilteredHospitals(dummyHospitals);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = hospitals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(hospital => hospital.status === selectedStatus);
    }

    setFilteredHospitals(filtered);
  }, [searchTerm, selectedStatus, hospitals]);

  const handleDelete = (hospitalId) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      setHospitals(hospitals.filter(hospital => hospital.id !== hospitalId));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'General':
        return 'bg-blue-100 text-blue-800';
      case 'Specialized':
        return 'bg-purple-100 text-purple-800';
      case 'Community':
        return 'bg-green-100 text-green-800';
      case 'Academic':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-3xl font-bold text-white">Hospitals</h1>
            <p className="text-gray-400 mt-1">Manage hospital registrations and information</p>
          </div>
          <Button
            onClick={() => navigate('/hospitals/new')}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hospital
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
                    placeholder="Search hospitals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
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
                  <p className="text-sm text-gray-400">Total Hospitals</p>
                  <p className="text-2xl font-bold text-white">{hospitals.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-white">
                    {hospitals.filter(h => h.status === 'active').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">
                    {hospitals.filter(h => h.status === 'pending').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Beds</p>
                  <p className="text-2xl font-bold text-white">
                    {hospitals.reduce((sum, h) => sum + h.beds, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hospitals List */}
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Hospital Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{hospital.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {hospital.city}, {hospital.state}
                            </span>
                            <span className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {hospital.phone}
                            </span>
                            <span className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {hospital.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(hospital.status)}>
                          {hospital.status}
                        </Badge>
                        <Badge className={getTypeColor(hospital.type)}>
                          {hospital.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Beds:</span>
                        <span className="text-white ml-2">{hospital.beds}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rating:</span>
                        <span className="text-white ml-2">{hospital.rating}/5</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Joined:</span>
                        <span className="text-white ml-2">
                          {new Date(hospital.joinedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">ID:</span>
                        <span className="text-white ml-2">#{hospital.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/hospitals/${hospital.id}`)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/hospitals/${hospital.id}/edit`)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(hospital.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredHospitals.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No hospitals found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HospitalList; 