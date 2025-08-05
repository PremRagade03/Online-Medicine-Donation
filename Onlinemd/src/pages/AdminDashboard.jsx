
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, Users, Package, Building2, Heart, TrendingUp, AlertCircle, CheckCircle, Pill, Calendar, Hash, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/services/userService';
import { donationService } from '@/services/donationService';
import { requestService } from '@/services/requestService';
import { ngoService } from '@/services/ngoService';
import { medicineService } from '@/services/medicineService';
import { hospitalService } from '@/services/hospitalService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // Load all data from localStorage
    const savedDonations = localStorage.getItem('medishare_donations');
    const savedOrders = localStorage.getItem('medishare_orders');
    const savedRequests = localStorage.getItem('medishare_ngo_requests');
    const savedMedicines = localStorage.getItem('medishare_medicines');
    
    if (savedDonations) setDonations(JSON.parse(savedDonations));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
    
    if (savedMedicines) {
      setMedicines(JSON.parse(savedMedicines));
    } else {
      // Initialize with sample medicine data if none exists
      const sampleMedicines = [
        {
          MedicineID: 1,
          Name: "Paracetamol 500mg",
          Description: "Pain reliever and fever reducer",
          ExpiryDate: "2024-12-31",
          Quantity: 100,
          DonorID: 1,
          Status: "Verified",
          CreatedAt: "2024-01-15T10:30:00Z"
        },
        {
          MedicineID: 2,
          Name: "Amoxicillin 250mg",
          Description: "Antibiotic for bacterial infections",
          ExpiryDate: "2024-08-15",
          Quantity: 50,
          DonorID: 2,
          Status: "Pending",
          CreatedAt: "2024-01-20T14:45:00Z"
        },
        {
          MedicineID: 3,
          Name: "Ibuprofen 400mg",
          Description: "Anti-inflammatory pain medication",
          ExpiryDate: "2025-03-20",
          Quantity: 75,
          DonorID: 1,
          Status: "Donated",
          CreatedAt: "2024-01-25T09:15:00Z"
        }
      ];
      localStorage.setItem('medishare_medicines', JSON.stringify(sampleMedicines));
      setMedicines(sampleMedicines);
    }
  }, []);

  const stats = [
    {
      title: 'Total Donations',
      value: donations.length,
      icon: Package,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      change: '+12%'
    },
    {
      title: 'Hospital Orders',
      value: orders.length,
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      change: '+8%'
    },
    {
      title: 'NGO Requests',
      value: requests.length,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      change: '+15%'
    },
    {
      title: 'Total Medicines',
      value: medicines.length,
      icon: Pill,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      change: '+18%'
    }
  ];

  const recentActivity = [
    ...donations.slice(-3).map(d => ({
      id: d.id,
      type: 'donation',
      title: `New donation: ${d.medicineName}`,
      subtitle: `By ${d.donorName}`,
      time: new Date(d.dateAdded).toLocaleDateString(),
      icon: Package,
      color: 'text-green-400'
    })),
    ...orders.slice(-3).map(o => ({
      id: o.id,
      type: 'order',
      title: `Hospital order: ${o.medicineName}`,
      subtitle: `By ${o.hospitalName}`,
      time: new Date(o.orderDate).toLocaleDateString(),
      icon: Building2,
      color: 'text-blue-400'
    })),
    ...requests.slice(-3).map(r => ({
      id: r.id,
      type: 'request',
      title: `NGO request: ${r.medicineName}`,
      subtitle: `By ${r.ngoName}`,
      time: new Date(r.dateCreated).toLocaleDateString(),
      icon: Users,
      color: 'text-purple-400'
    })),
    ...medicines.slice(-3).map(m => ({
      id: m.MedicineID,
      type: 'medicine',
      title: `New medicine: ${m.Name}`,
      subtitle: `Quantity: ${m.Quantity} • Status: ${m.Status}`,
      time: new Date(m.CreatedAt).toLocaleDateString(),
      icon: Pill,
      color: 'text-cyan-400'
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MediShare</title>
        <meta name="description" content="Manage the MediShare platform, monitor activities, and oversee medicine donations." />
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
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 text-lg">Monitor and manage the MediShare platform</p>
                  </div>
                </div>
                <p className="text-gray-300 mt-4 max-w-2xl">
                  Welcome back! Here's an overview of your platform's performance and recent activities.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-green-400 text-green-400 px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Administrator
                </Badge>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                          <TrendingUp className="w-4 h-4 text-green-400" />
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

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 border bg-white/5 border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="medicines" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                  Medicines
                </TabsTrigger>
                <TabsTrigger value="donations" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                  Donations
                </TabsTrigger>
                <TabsTrigger value="orders" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
                  Orders
                </TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                  Requests
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="glass-effect border-orange-500/20">
                  <div className="p-6">
                    <h3 className="mb-6 text-xl font-semibold text-white">Recent Activity</h3>
                    
                    {recentActivity.length === 0 ? (
                      <div className="py-8 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <h4 className="mb-2 text-lg font-medium text-white">No recent activity</h4>
                        <p className="text-gray-400">Activity will appear here as users interact with the platform</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentActivity.map((activity) => (
                          <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                            <div className={`p-2 rounded-lg bg-white/10`}>
                              <activity.icon className={`w-4 h-4 ${activity.color}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                              <p className="text-xs text-gray-400">{activity.subtitle}</p>
                            </div>
                            <span className="text-xs text-gray-400">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="medicines" className="space-y-6">
                <Card className="glass-effect border-cyan-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">All Medicines</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => navigate('/medicines')}
                          className="text-white bg-cyan-600 hover:bg-cyan-700"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Manage Medicines
                        </Button>
                        <Button
                          onClick={() => toast({
                            title: "🚧 Feature coming soon!",
                            description: "Medicine management features will be available in the next update! 🚀"
                          })}
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-400"
                        >
                          Export Data
                        </Button>
                      </div>
                    </div>
                    
                    {medicines.length === 0 ? (
                      <div className="py-12 text-center">
                        <Pill className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h4 className="mb-2 text-xl font-medium text-white">No medicines available</h4>
                        <p className="mb-4 text-gray-400">No medicines have been added to the system yet</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Hash className="w-4 h-4" />
                          <span>MedicineID • Name • Description • ExpiryDate • Quantity • DonorID • Status • CreatedAt</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {medicines.map((medicine) => (
                          <div key={medicine.MedicineID} className="flex items-center justify-between p-4 transition-colors rounded-lg bg-white/5 hover:bg-white/10">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-medium text-white">{medicine.Name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  ID: {medicine.MedicineID}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                                <div>
                                  <p className="text-gray-400">Description</p>
                                  <p className="text-white">{medicine.Description || 'No description'}</p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Quantity</p>
                                  <p className="flex items-center gap-1 text-white">
                                    <Hash className="w-3 h-3" />
                                    {medicine.Quantity}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Expiry Date</p>
                                  <p className="flex items-center gap-1 text-white">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(medicine.ExpiryDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-400">Donor ID</p>
                                  <p className="text-white">{medicine.DonorID}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                <Badge variant={
                                  medicine.Status === 'Verified' ? 'default' :
                                  medicine.Status === 'Donated' ? 'secondary' :
                                  'outline'
                                } className={
                                  medicine.Status === 'Verified' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                  medicine.Status === 'Donated' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }>
                                  {medicine.Status}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                  Created: {new Date(medicine.CreatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toast({
                                  title: "🚧 Feature coming soon!",
                                  description: "Medicine management features will be available in the next update! 🚀"
                                })}
                                className="border-cyan-500/30 text-cyan-400"
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
              </TabsContent>

              <TabsContent value="donations" className="space-y-6">
                <Card className="glass-effect border-green-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">All Donations</h3>
                      <Button
                        onClick={() => toast({
                          title: "🚧 Feature coming soon!",
                          description: "Advanced donation management features will be available in the next update! 🚀"
                        })}
                        variant="outline"
                        className="text-green-400 border-green-500/30"
                      >
                        Export Data
                      </Button>
                    </div>
                    
                    {donations.length === 0 ? (
                      <div className="py-8 text-center">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <h4 className="mb-2 text-lg font-medium text-white">No donations yet</h4>
                        <p className="text-gray-400">Donations will appear here as users add them</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {donations.map((donation) => (
                          <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <div>
                              <h4 className="font-medium text-white">{donation.medicineName}</h4>
                              <p className="text-sm text-gray-400">
                                By {donation.donorName} • {donation.quantity} • Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={donation.status === 'available' ? 'default' : 'secondary'}>
                                {donation.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toast({
                                  title: "🚧 Feature coming soon!",
                                  description: "Donation management features will be available in the next update! 🚀"
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
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <Card className="glass-effect border-blue-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">Hospital Orders</h3>
                      <Button
                        onClick={() => toast({
                          title: "🚧 Feature coming soon!",
                          description: "Order management features will be available in the next update! 🚀"
                        })}
                        variant="outline"
                        className="text-blue-400 border-blue-500/30"
                      >
                        Export Data
                      </Button>
                    </div>
                    
                    {orders.length === 0 ? (
                      <div className="py-8 text-center">
                        <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <h4 className="mb-2 text-lg font-medium text-white">No orders yet</h4>
                        <p className="text-gray-400">Hospital orders will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <div>
                              <h4 className="font-medium text-white">{order.medicineName}</h4>
                              <p className="text-sm text-gray-400">
                                By {order.hospitalName} • {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                                {order.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toast({
                                  title: "🚧 Feature coming soon!",
                                  description: "Order management features will be available in the next update! 🚀"
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
              </TabsContent>

              <TabsContent value="requests" className="space-y-6">
                <Card className="glass-effect border-purple-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">NGO Requests</h3>
                      <Button
                        onClick={() => toast({
                          title: "🚧 Feature coming soon!",
                          description: "Request management features will be available in the next update! 🚀"
                        })}
                        variant="outline"
                        className="text-purple-400 border-purple-500/30"
                      >
                        Export Data
                      </Button>
                    </div>
                    
                    {requests.length === 0 ? (
                      <div className="py-8 text-center">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <h4 className="mb-2 text-lg font-medium text-white">No requests yet</h4>
                        <p className="text-gray-400">NGO requests will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {requests.map((request) => (
                          <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                            <div>
                              <h4 className="font-medium text-white">{request.medicineName}</h4>
                              <p className="text-sm text-gray-400">
                                By {request.ngoName} • {request.quantity} • {request.beneficiaries} beneficiaries
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={request.status === 'open' ? 'default' : 'secondary'}>
                                {request.status}
                              </Badge>
                              <Badge variant="outline" className={
                                request.urgency === 'high' ? 'text-red-400 border-red-400' :
                                request.urgency === 'medium' ? 'text-yellow-400 border-yellow-400' :
                                'text-green-400 border-green-400'
                              }>
                                {request.urgency}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
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
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
