
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Building2, Search, ShoppingCart, Package, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load donations and orders from localStorage
    const savedDonations = localStorage.getItem('medishare_donations');
    const savedOrders = localStorage.getItem('medishare_orders');
    
    if (savedDonations) {
      setDonations(JSON.parse(savedDonations));
    } else {
      // Initialize with sample donations if none exist
      const sampleDonations = [
        {
          id: 1,
          medicineName: "Paracetamol 500mg",
          quantity: "500 tablets",
          expiryDate: "2024-12-31",
          donorName: "City Pharmacy",
          status: "available",
          description: "Pain reliever and fever reducer"
        },
        {
          id: 2,
          medicineName: "Amoxicillin 250mg",
          quantity: "200 capsules",
          expiryDate: "2024-08-15",
          donorName: "Health Plus Medical",
          status: "available",
          description: "Antibiotic for bacterial infections"
        },
        {
          id: 3,
          medicineName: "Ibuprofen 400mg",
          quantity: "300 tablets",
          expiryDate: "2025-03-20",
          donorName: "Community Clinic",
          status: "available",
          description: "Anti-inflammatory pain medication"
        },
        {
          id: 4,
          medicineName: "Omeprazole 20mg",
          quantity: "150 capsules",
          expiryDate: "2024-11-30",
          donorName: "Family Medical Store",
          status: "available",
          description: "Acid reflux medication"
        },
        {
          id: 5,
          medicineName: "Vitamin D3 1000IU",
          quantity: "100 tablets",
          expiryDate: "2025-06-15",
          donorName: "Wellness Center",
          status: "available",
          description: "Vitamin supplement"
        }
      ];
      localStorage.setItem('medishare_donations', JSON.stringify(sampleDonations));
      setDonations(sampleDonations);
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Initialize with sample hospital orders if none exist
      const sampleOrders = [
        {
          id: 1,
          donationId: 1,
          hospitalId: user.id,
          hospitalName: user.name,
          medicineName: "Paracetamol 500mg",
          quantity: "100 tablets",
          donorName: "City Pharmacy",
          status: "completed",
          orderDate: "2024-01-10T10:30:00Z"
        },
        {
          id: 2,
          donationId: 2,
          hospitalId: user.id,
          hospitalName: user.name,
          medicineName: "Amoxicillin 250mg",
          quantity: "50 capsules",
          donorName: "Health Plus Medical",
          status: "pending",
          orderDate: "2024-01-15T14:45:00Z"
        }
      ];
      localStorage.setItem('medishare_orders', JSON.stringify(sampleOrders));
      setOrders(sampleOrders);
    }
  }, [user.id]);

  const handleOrderMedicine = (donation) => {
    const order = {
      id: Date.now(),
      donationId: donation.id,
      hospitalId: user.id,
      hospitalName: user.name,
      medicineName: donation.medicineName,
      quantity: donation.quantity,
      donorName: donation.donorName,
      status: 'pending',
      orderDate: new Date().toISOString()
    };

    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem('medishare_orders', JSON.stringify(updatedOrders));

    toast({
      title: "Order placed successfully!",
      description: `Your request for ${donation.medicineName} has been sent to the donor.`,
    });
  };

  const filteredDonations = donations.filter(donation =>
    donation.status === 'available' &&
    donation.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hospitalOrders = orders.filter(order => order.hospitalId === user.id);

  const stats = [
    {
      title: 'Total Orders',
      value: hospitalOrders.length,
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Pending Orders',
      value: hospitalOrders.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      title: 'Completed Orders',
      value: hospitalOrders.filter(o => o.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Available Medicines',
      value: filteredDonations.length,
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hospital Dashboard - MediShare</title>
        <meta name="description" content="Browse and order donated medicines for your hospital patients." />
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
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Welcome, {user.name}</h1>
                    <p className="text-gray-400 text-lg">Find the medicines your patients need</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4 max-w-2xl">
                  Browse available medicines and place orders for your hospital's needs. Track your orders and manage your inventory efficiently.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-blue-400 text-blue-400 px-4 py-2">
                  <Building2 className="w-4 h-4 mr-2" />
                  Hospital Portal
                </Badge>
                <Button 
                  onClick={() => navigate('/hospital/orders')}
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Hospital Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect border-blue-500/20">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Hospital Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Hospital Name</label>
                      <p className="text-white font-medium">{user.name || "City General Hospital"}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white">{user.email || "info@cityhospital.com"}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Phone</label>
                      <p className="text-white">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Address</label>
                      <p className="text-white">123 Medical Center Drive</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">City</label>
                      <p className="text-white">Mumbai</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">State</label>
                      <p className="text-white">Maharashtra</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Pincode</label>
                      <p className="text-white">400001</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Hospital ID: {user.id || "H001"}</span>
                    <span>•</span>
                    <span>Member since: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
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
                          <span className="text-blue-400 text-sm font-medium">{stat.change}</span>
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

          {/* Search and Available Medicines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-effect border-blue-500/20">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold text-white">Available Medicines</h2>
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
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      {searchTerm ? 'No medicines found' : 'No medicines available'}
                    </h3>
                    <p className="text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new donations'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredDonations.map((donation) => (
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
                            {donation.description && (
                              <p className="text-gray-300 mt-2 text-sm">{donation.description}</p>
                            )}
                          </div>
                          
                          <Button
                            onClick={() => handleOrderMedicine(donation)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                            disabled={hospitalOrders.some(order => order.donationId === donation.id)}
                          >
                            {hospitalOrders.some(order => order.donationId === donation.id) ? 'Already Ordered' : 'Order Medicine'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-effect border-blue-500/20">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Orders</h2>
                
                {hospitalOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                    <p className="text-gray-400">Start ordering medicines from the available donations above</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hospitalOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{order.medicineName}</h4>
                          <p className="text-sm text-gray-400">
                            From: {order.donorName} • {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default HospitalDashboard;
