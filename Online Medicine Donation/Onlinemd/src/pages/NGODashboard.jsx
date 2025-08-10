
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Users, Heart, Search, Package, Clock, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { ClipboardList } from 'lucide-react';
import { donationService } from '@/services/donationService';

const NGODashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    medicineName: '',
    quantity: '',
    urgency: 'medium',
    description: '',
    beneficiaries: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load donations from API
      const donationsData = await donationService.getAllDonations();
      setDonations(Array.isArray(donationsData) ? donationsData : []);
      
      // Load requests from localStorage for now
    const savedRequests = localStorage.getItem('medishare_ngo_requests');
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      } else {
        // Initialize with sample NGO requests if none exist
        const sampleRequests = [
          {
            id: 1,
            medicineName: "Paracetamol 500mg",
            quantity: "100 tablets",
            urgency: "high",
            description: "For emergency relief operations",
            beneficiaries: "50 families",
            status: "pending",
            dateCreated: new Date().toISOString()
          },
          {
            id: 2,
            medicineName: "Amoxicillin 250mg",
            quantity: "50 capsules",
            urgency: "medium",
            description: "For community health program",
            beneficiaries: "25 children",
            status: "approved",
            dateCreated: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        localStorage.setItem('medishare_ngo_requests', JSON.stringify(sampleRequests));
        setRequests(sampleRequests);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Fallback to localStorage for development
      const savedDonations = localStorage.getItem('medishare_donations');
    if (savedDonations) {
      setDonations(JSON.parse(savedDonations));
    } else {
      // Initialize with sample donations if none exist
      const sampleDonations = [
        {
            donationId: 1,
          medicineName: "Paracetamol 500mg",
            quantity: 200,
          expiryDate: "2024-12-31",
            donorName: "Prem Ragade",
            status: "completed",
            medicineStatus: "available",
          description: "Pain reliever and fever reducer"
        },
        {
            donationId: 2,
          medicineName: "Amoxicillin 250mg",
            quantity: 50,
          expiryDate: "2024-08-15",
            donorName: "Prem Ragade",
            status: "completed",
            medicineStatus: "available",
          description: "Antibiotic for bacterial infections"
        }
      ];
      localStorage.setItem('medishare_donations', JSON.stringify(sampleDonations));
      setDonations(sampleDonations);
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

  const handleCreateRequest = (e) => {
    e.preventDefault();
    
    const request = {
      id: Date.now(),
      ngoId: user.id,
      ngoName: user.name,
      ...newRequest,
      status: 'open',
      dateCreated: new Date().toISOString(),
      responses: []
    };

    const updatedRequests = [...requests, request];
    setRequests(updatedRequests);
    localStorage.setItem('medishare_ngo_requests', JSON.stringify(updatedRequests));

    toast({
      title: "Request created successfully!",
      description: `Your request for ${newRequest.medicineName} has been posted.`,
    });

    setNewRequest({
      medicineName: '',
      quantity: '',
      urgency: 'medium',
      description: '',
      beneficiaries: ''
    });
    setShowRequestDialog(false);
  };

  const handleRequestMedicine = (donation) => {
    toast({
      title: "Request sent!",
      description: `Your request for ${donation.medicineName} has been sent to the admin.`,
    });
  };

  const filteredDonations = donations.filter(donation =>
    donation.status === 'available' &&
    donation.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ngoRequests = requests.filter(request => request.ngoId === user.id);

  const stats = [
    {
      title: 'Active Requests',
      value: ngoRequests.filter(r => r.status === 'open').length,
      icon: Heart,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Fulfilled Requests',
      value: ngoRequests.filter(r => r.status === 'fulfilled').length,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'People Helped',
      value: ngoRequests.reduce((acc, r) => acc + (parseInt(r.beneficiaries) || 0), 0),
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Available Medicines',
      value: filteredDonations.length,
      icon: Package,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ];

  return (
    <>
      <Helmet>
        <title>NGO Dashboard - MediShare</title>
        <meta name="description" content="Request medicines for your community and browse available donations." />
      </Helmet>

      <DashboardLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-white/10"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Welcome, {user.name}</h1>
                    <p className="text-gray-400 text-lg">Helping communities access essential medicines</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4 max-w-2xl">
                  Create medicine requests and connect with donors to help your community access essential healthcare.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-purple-400 text-purple-400 px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  NGO Portal
                </Badge>
                <Button
                  onClick={() => setShowRequestDialog(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </Button>
                <Button
                  onClick={() => navigate('/ngo/requests')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ClipboardList className="w-4 h-4 mr-2" />
                  View Requests
                </Button>
              </div>
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
                <Card className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center space-x-1">
                          <span className="text-purple-400 text-sm font-medium">{stat.change}</span>
                          <span className="text-gray-400 text-xs">from last month</span>
                        </div>
                      )}
                    </div>
                    <div className={`p-4 rounded-xl ${stat.bgColor} border border-white/10`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Your Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-purple-500/20">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-white">Your Medicine Requests</h2>
                  <Button
                    onClick={() => setShowRequestDialog(true)}
                    variant="outline"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </div>

                {ngoRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No requests yet</h3>
                    <p className="text-gray-400 mb-6">Create your first medicine request to help your community</p>
                    <Button
                      onClick={() => setShowRequestDialog(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Request
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {ngoRequests.map((request) => (
                      <div key={request.id} className="medicine-card p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{request.medicineName}</h3>
                              <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                                {request.status}
                              </Badge>
                              <Badge variant="outline" className={
                                request.urgency === 'high' ? 'text-red-400 border-red-400' :
                                request.urgency === 'medium' ? 'text-yellow-400 border-yellow-400' :
                                'text-green-400 border-green-400'
                              }>
                                {request.urgency} priority
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-400">
                              <span>Quantity: {request.quantity}</span>
                              <span>Beneficiaries: {request.beneficiaries}</span>
                              <span>Created: {new Date(request.dateCreated).toLocaleDateString()}</span>
                            </div>
                            {request.description && (
                              <p className="text-gray-300 mt-2 text-sm">{request.description}</p>
                            )}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast({
                              title: "🚧 Feature coming soon!",
                              description: "Request management features will be available in the next update! 🚀"
                            })}
                          >
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Available Medicines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-effect border-purple-500/20">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-white">Available Donations</h2>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search medicines..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white w-full sm:w-64"
                    />
                  </div>
                </div>

                {filteredDonations.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {searchTerm ? 'No medicines found' : 'No medicines available'}
                    </h3>
                    <p className="text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new donations'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      {filteredDonations.slice(0, 5).map((donation) => (
                        <div key={donation.id} className="medicine-card p-4 rounded-lg">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">{donation.medicineName}</h3>
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  Available
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-400">
                                <span>Quantity: {donation.quantity}</span>
                                <span>Expires: {new Date(donation.expiryDate).toLocaleDateString()}</span>
                                <span>Donor: {donation.donorName}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleRequestMedicine(donation)}
                                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                              >
                                Request
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast({
                                  title: "Medicine Details",
                                  description: `${donation.medicineName} - ${donation.description}`,
                                })}
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {filteredDonations.length > 5 && (
                      <div className="text-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => toast({
                            title: "🚧 Feature coming soon!",
                            description: "View all medicines feature will be available in the next update! 🚀"
                          })}
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                        >
                          View All Medicines ({filteredDonations.length} available)
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Create Request Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="bg-slate-800 border-purple-500/20 text-white" aria-describedby="request-dialog-description">
            <DialogHeader>
              <DialogTitle className="text-white">Create Medicine Request</DialogTitle>
            </DialogHeader>
            <div id="request-dialog-description" className="sr-only">
              Form to create a medicine request with details like medicine name, quantity, beneficiaries, urgency, and description
            </div>
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <Label htmlFor="medicineName" className="text-white">Medicine Name</Label>
                <Input
                  id="medicineName"
                  value={newRequest.medicineName}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, medicineName: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="quantity" className="text-white">Quantity Needed</Label>
                <Input
                  id="quantity"
                  value={newRequest.quantity}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, quantity: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="e.g., 100 tablets, 5 bottles"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="beneficiaries" className="text-white">Number of Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  value={newRequest.beneficiaries}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, beneficiaries: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="How many people will this help?"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="urgency" className="text-white">Urgency Level</Label>
                <select
                  id="urgency"
                  value={newRequest.urgency}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full p-2 bg-white/5 border border-white/20 rounded-md text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="Describe why this medicine is needed..."
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  Create Request
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default NGODashboard;
