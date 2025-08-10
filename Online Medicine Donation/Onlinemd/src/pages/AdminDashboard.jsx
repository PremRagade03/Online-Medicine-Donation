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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load medicines and donations from API
      const [medicinesData, donationsData] = await Promise.all([
        medicineService.getAllMedicines(),
        donationService.getAllDonations()
      ]);
      
      setMedicines(medicinesData);
      
      // If no donations from API, use dummy data that matches backend structure
      if (Array.isArray(donationsData) && donationsData.length > 0) {
        setDonations(donationsData);
      } else {
        // Dummy donation data that matches your backend structure
        const dummyDonations = [
          {
            donationId: 1,
            medicineId: 1,
            medicineName: "Paracetamol 500mg",
            description: "Pain reliever and fever reducer",
            expiryDate: "2026-01-01",
            quantity: 100,
            donorId: 1,
            donorName: "Prem Ragade",
            donorEmail: "prem@gmail.com",
            donorPhone: "6263950195",
            donorNotes: "Good condition, unopened",
            status: "completed",
            createdAt: "2025-08-10T03:06:26.590",
            updatedAt: "2025-08-10T03:06:26.590",
            medicineStatus: "available"
          },
          {
            donationId: 2,
            medicineId: 2,
            medicineName: "Ibuprofen 400mg",
            description: "Nonsteroidal anti-inflammatory drug",
            expiryDate: "2025-12-15",
            quantity: 80,
            donorId: 1,
            donorName: "Prem Ragade",
            donorEmail: "prem@gmail.com",
            donorPhone: "6263950195",
            donorNotes: "From pharmacy surplus",
            status: "completed",
            createdAt: "2025-08-10T03:06:26.590",
            updatedAt: "2025-08-10T03:06:26.590",
            medicineStatus: "available"
          },
          {
            donationId: 3,
            medicineId: 3,
            medicineName: "Amoxicillin 250mg",
            description: "Antibiotic for bacterial infections",
            expiryDate: "2025-10-30",
            quantity: 50,
            donorId: 1,
            donorName: "Prem Ragade",
            donorEmail: "prem@gmail.com",
            donorPhone: "6263950195",
            donorNotes: "Prescription medication",
            status: "completed",
            createdAt: "2025-08-10T03:06:26.590",
            updatedAt: "2025-08-10T03:06:26.590",
            medicineStatus: "available"
          }
        ];
        setDonations(dummyDonations);
      }
      
      // Load other data from localStorage for now (can be updated later)
      const savedOrders = localStorage.getItem('medishare_orders');
      const savedRequests = localStorage.getItem('medishare_ngo_requests');
      
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedRequests) setRequests(JSON.parse(savedRequests));
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from API",
        variant: "destructive"
      });
      
      // Fallback to localStorage for development
      const savedDonations = localStorage.getItem('medishare_donations');
      if (savedDonations) setDonations(JSON.parse(savedDonations));
    }
  };

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
      id: d.donationId,
      type: 'donation',
      title: `New donation: ${d.medicineName}`,
      subtitle: `By ${d.donorName}`,
      time: new Date(d.createdAt).toLocaleDateString(),
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
      id: m.MedicineId || m.medicineId,
      type: 'medicine',
      title: `New medicine: ${m.Name || m.name}`,
      subtitle: `Quantity: ${m.Quantity || m.quantity} • Status: ${m.Status || m.status}`,
      time: new Date(m.CreatedAt || m.createdAt).toLocaleDateString(),
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
            className="p-6 border bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl border-white/10"
          >
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center mb-2 space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-lg text-gray-400">Monitor and manage the MediShare platform</p>
                  </div>
                </div>
                <p className="max-w-2xl mt-4 text-gray-300">
                  Welcome back! Here's an overview of your platform's performance and recent activities.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-4 py-2 text-green-400 border-green-400">
                  <Shield className="w-4 h-4 mr-2" />
                  Administrator
                </Badge>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
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
                <Card className="p-6 transition-all duration-300 border bg-gradient-to-br from-slate-800 to-slate-700 border-white/10 hover:border-white/20 hover:shadow-xl hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="mb-1 text-sm font-medium text-gray-400">{stat.title}</p>
                      <p className="mb-2 text-3xl font-bold text-white">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">{stat.change}</span>
                          <span className="text-xs text-gray-400">from last month</span>
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

              {/* <TabsContent value="orders" className="space-y-6">
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
              </TabsContent> */}

<TabsContent value="orders" className="space-y-6">
  <Card className="glass-effect border-blue-500/20">
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Hospital Orders</h3>
        <Button
          onClick={() => toast({
            title: "📦 Orders Updated",
            description: "All order changes are saved in localStorage.",
          })}
          variant="outline"
          className="text-blue-400 border-blue-500/30"
        >
          Save Changes
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
          {orders.map((order, index) => {
            const medicine = medicines.find(m => m.Name === order.medicineName && m.Status === 'Verified');
            const isAvailable = medicine && medicine.Quantity >= order.quantity;

            const handleComplete = async () => {
              if (!isAvailable) {
                toast({
                  title: "❌ Not Enough Medicine",
                  description: `Only ${medicine ? medicine.Quantity : 0} units available. Required: ${order.quantity}`,
                  variant: "destructive",
                });
                return;
              }

              try {
                const updatedOrders = [...orders];
                updatedOrders[index].status = 'completed';
                setOrders(updatedOrders);
                localStorage.setItem('medishare_orders', JSON.stringify(updatedOrders));

                // Update medicine quantity via API
                const updatedQuantity = medicine.Quantity - order.quantity;
                const updatedMedicine = await medicineService.updateMedicine(medicine.MedicineID, {
                  ...medicine,
                  Quantity: updatedQuantity,
                });
                
                const updatedMedicines = medicines.map(m => 
                  m.MedicineID === medicine.MedicineID ? updatedMedicine : m
                );
                setMedicines(updatedMedicines);

                toast({
                  title: "✅ Order Completed",
                  description: `Order for ${order.medicineName} completed.`,
                });
              } catch (error) {
                console.error('Error completing order:', error);
                toast({
                  title: "❌ Error",
                  description: "Failed to complete order. Please try again.",
                  variant: "destructive",
                });
              }
            };

            return (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <div>
                  <h4 className="font-medium text-white">{order.medicineName}</h4>
                  <p className="text-sm text-gray-400">
                    By {order.hospitalName} • Qty: {order.quantity} • {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                    {order.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isAvailable ? "text-green-400 border-green-400" : "text-red-400 border-red-400"}
                    onClick={handleComplete}
                    disabled={order.status === 'completed'}
                  >
                    {order.status === 'completed' ? 'Completed' : isAvailable ? 'Complete' : 'Unavailable'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </Card>
</TabsContent>


              {/* <TabsContent value="requests" className="space-y-6">
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
              </TabsContent> */}

              <TabsContent value="requests" className="space-y-6">
                <Card className="glass-effect border-purple-500/20">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-white">NGO Requests</h3>
                      <Button
                        onClick={() => toast({
                          title: "✅ Requests Synced",
                          description: "Request updates saved to localStorage",
                        })}
                        variant="outline"
                        className="text-purple-400 border-purple-500/30"
                      >
                        Save Changes
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
                        {requests.map((request, index) => {
                          const matchingMedicine = medicines.find(m => m.Name === request.medicineName && m.Status === 'Verified');
                          const isEnough = matchingMedicine && matchingMedicine.Quantity >= request.quantity;

                          const handleFulfill = async () => {
                            if (!isEnough) {
                              toast({
                                title: "❌ Not Enough Medicine",
                                description: `Only ${matchingMedicine ? matchingMedicine.Quantity : 0} units available for "${request.medicineName}". Needed: ${request.quantity}`,
                                variant: "destructive",
                              });
                              return;
                            }

                            try {
                              const updatedRequests = [...requests];
                              updatedRequests[index].status = 'fulfilled';
                              setRequests(updatedRequests);
                              localStorage.setItem('medishare_ngo_requests', JSON.stringify(updatedRequests));

                              // Update medicine quantity via API
                              const updatedQuantity = matchingMedicine.Quantity - request.quantity;
                              const updatedMedicine = await medicineService.updateMedicine(matchingMedicine.MedicineID, {
                                ...matchingMedicine,
                                Quantity: updatedQuantity,
                              });
                              
                              const updatedMedicines = medicines.map(m => 
                                m.MedicineID === matchingMedicine.MedicineID ? updatedMedicine : m
                              );
                              setMedicines(updatedMedicines);

                              toast({
                                title: "✅ Request Fulfilled",
                                description: `Request for ${request.medicineName} fulfilled and quantity updated.`,
                              });
                            } catch (error) {
                              console.error('Error fulfilling request:', error);
                              toast({
                                title: "❌ Error",
                                description: "Failed to fulfill request. Please try again.",
                                variant: "destructive",
                              });
                            }
                          };

                          return (
                            <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                              <div>
                                <h4 className="font-medium text-white">{request.medicineName}</h4>
                                <p className="text-sm text-gray-400">
                                  By {request.ngoName} • Qty: {request.quantity} • {request.beneficiaries} beneficiaries
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
                                  className={isEnough ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}
                                  onClick={handleFulfill}
                                  disabled={request.status === 'fulfilled'}
                                >
                                  {request.status === 'fulfilled' ? 'Fulfilled' : isEnough ? 'Fulfill' : 'Unavailable'}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
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
