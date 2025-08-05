import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Search,
  Download,
  Plus,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const NGORequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - replace with actual API calls
  const mockRequests = [
    {
      id: 1,
      requestNumber: 'REQ-001',
      medicineName: 'Paracetamol 500mg',
      quantity: 50,
      status: 'pending',
      requestDate: '2024-01-15',
      urgency: 'high',
      ngoName: 'HealthCare NGO',
      location: 'Mumbai',
      description: 'Urgent need for fever medication for rural clinic',
      contactPerson: 'Dr. Sarah Johnson',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      requestNumber: 'REQ-002',
      medicineName: 'Amoxicillin 250mg',
      quantity: 100,
      status: 'approved',
      requestDate: '2024-01-14',
      urgency: 'medium',
      ngoName: 'Rural Health Initiative',
      location: 'Delhi',
      description: 'Antibiotics needed for community health program',
      contactPerson: 'Dr. Rajesh Kumar',
      phone: '+91 98765 43211'
    },
    {
      id: 3,
      requestNumber: 'REQ-003',
      medicineName: 'Ibuprofen 400mg',
      quantity: 75,
      status: 'fulfilled',
      requestDate: '2024-01-10',
      urgency: 'low',
      ngoName: 'Urban Health Foundation',
      location: 'Bangalore',
      description: 'Pain relief medication for elderly care center',
      contactPerson: 'Dr. Priya Sharma',
      phone: '+91 98765 43212'
    },
    {
      id: 4,
      requestNumber: 'REQ-004',
      medicineName: 'Omeprazole 20mg',
      quantity: 30,
      status: 'rejected',
      requestDate: '2024-01-12',
      urgency: 'high',
      ngoName: 'Medical Aid Society',
      location: 'Chennai',
      description: 'Gastric medication for emergency cases',
      contactPerson: 'Dr. Arun Patel',
      phone: '+91 98765 43213'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fulfilled': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        request.ngoName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (requestId, newStatus) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
  };

  const handleExportRequests = () => {
    // Export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Request Number,Medicine,Quantity,Status,Request Date,Urgency,NGO,Location,Contact Person\n" +
      filteredRequests.map(request => 
        `${request.requestNumber},${request.medicineName},${request.quantity},${request.status},${request.requestDate},${request.urgency},${request.ngoName},${request.location},${request.contactPerson}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ngo_requests.csv");
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
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">NGO Requests</h1>
                <p className="text-gray-400">Manage and track medicine requests from NGOs</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExportRequests}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">{requests.length}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-purple-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Fulfilled</p>
                <p className="text-2xl font-bold text-white">{requests.filter(r => r.status === 'fulfilled').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{requests.filter(r => r.status === 'approved').length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
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
                  placeholder="Search requests..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{request.medicineName}</h3>
                      <Badge className={`px-2 py-1 text-xs font-medium border ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                      <Badge className={`px-2 py-1 text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Priority
                      </Badge>
                    </div>
                    <p className="text-lg font-bold text-white">{request.quantity} units</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Request Number</p>
                      <p className="text-white font-medium">{request.requestNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">NGO</p>
                      <p className="text-white font-medium">{request.ngoName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="text-white font-medium">{request.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Request Date</p>
                      <p className="text-white font-medium">{request.requestDate}</p>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Description</p>
                    <p className="text-white text-sm">{request.description}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Contact:</span>
                      <span className="text-white">{request.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{request.phone}</span>
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
                  {request.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'approved')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(request.id, 'rejected')}
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <Button
                      onClick={() => handleStatusUpdate(request.id, 'fulfilled')}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Fulfilled
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card className="p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Requests Found</h3>
            <p className="text-gray-400">No requests match your current filters.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NGORequestsPage; 