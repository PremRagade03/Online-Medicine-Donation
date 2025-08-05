
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Plus, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDonation, setNewDonation] = useState({
    medicineName: '',
    quantity: '',
    expiryDate: '',
    description: '',
    category: 'tablets'
  });

  useEffect(() => {
    // Load donations from localStorage
    const savedDonations = localStorage.getItem('medishare_donations');
    if (savedDonations) {
      setDonations(JSON.parse(savedDonations));
    }
  }, []);

  const handleAddDonation = (e) => {
    e.preventDefault();
    
    const donation = {
      id: Date.now(),
      ...newDonation,
      donorId: user.id,
      donorName: user.name,
      status: 'available',
      dateAdded: new Date().toISOString(),
      requests: []
    };

    const updatedDonations = [...donations, donation];
    setDonations(updatedDonations);
    localStorage.setItem('medishare_donations', JSON.stringify(updatedDonations));

    toast({
      title: "Medicine donated successfully!",
      description: `${newDonation.medicineName} has been added to your donations.`,
    });

    setNewDonation({
      medicineName: '',
      quantity: '',
      expiryDate: '',
      description: '',
      category: 'tablets'
    });
    setShowAddDialog(false);
  };

  const stats = [
    {
      title: 'Total Donations',
      value: donations.length,
      icon: Package,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Available',
      value: donations.filter(d => d.status === 'available').length,
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Pending Requests',
      value: donations.reduce((acc, d) => acc + (d.requests?.length || 0), 0),
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Lives Impacted',
      value: donations.filter(d => d.status === 'donated').length * 3,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Donor Dashboard - MediShare</title>
        <meta name="description" content="Manage your medicine donations and track their impact on the community." />
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
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Welcome back, {user.name}!</h1>
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
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Donate Medicine
                </Button>
                <Button
                  onClick={() => navigate('/donor/donations')}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  View Donations
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
                          <span className="text-green-400 text-sm font-medium">{stat.change}</span>
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

          {/* Donations List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-green-500/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Donations</h2>
                
                {donations.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No donations yet</h3>
                    <p className="text-gray-400 mb-6">Start making a difference by donating your unused medicines</p>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Donation
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {donations.map((donation) => (
                      <div key={donation.id} className="medicine-card p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{donation.medicineName}</h3>
                              <Badge variant={donation.status === 'available' ? 'default' : 'secondary'}>
                                {donation.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-400">
                              <span>Quantity: {donation.quantity}</span>
                              <span>Expires: {new Date(donation.expiryDate).toLocaleDateString()}</span>
                              <span>Added: {new Date(donation.dateAdded).toLocaleDateString()}</span>
                            </div>
                            {donation.description && (
                              <p className="text-gray-300 mt-2 text-sm">{donation.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {donation.requests?.length > 0 && (
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                                {donation.requests.length} request(s)
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toast({
                                title: "🚧 Feature coming soon!",
                                description: "Medicine management features will be available in the next update! 🚀"
                              })}
                            >
                              Manage
                            </Button>
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

        {/* Add Donation Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="bg-slate-800 border-green-500/20">
                        <DialogHeader>
              <DialogTitle className="text-white">Donate Medicine</DialogTitle>
            </DialogHeader>
              
              <form onSubmit={handleAddDonation} className="space-y-4">
                <div>
                  <Label htmlFor="medicineName" className="text-white">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    value={newDonation.medicineName}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, medicineName: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="quantity" className="text-white">Quantity</Label>
                  <Input
                    id="quantity"
                    value={newDonation.quantity}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, quantity: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="e.g., 30 tablets, 1 bottle"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiryDate" className="text-white">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newDonation.expiryDate}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={newDonation.description}
                    onChange={(e) => setNewDonation(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Additional notes about the medicine..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                  >
                    Donate
                  </Button>
                </div>
              </form>
            </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default DonorDashboard;
