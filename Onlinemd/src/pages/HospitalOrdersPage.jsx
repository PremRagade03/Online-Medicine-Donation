// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Package, 
//   Clock, 
//   CheckCircle, 
//   XCircle, 
//   Eye,
//   Search,
//   Filter,
//   Download,
//   Calendar,
//   MapPin,
//   Phone,
//   Mail
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import DashboardLayout from '@/components/DashboardLayout';
// import { useAuth } from '@/contexts/AuthContext';

// const HospitalOrdersPage = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Mock data - replace with actual API calls
//   const mockOrders = [
//     {
//       id: 1,
//       orderNumber: 'ORD-001',
//       medicineName: 'Paracetamol 500mg',
//       quantity: 100,
//       status: 'pending',
//       orderDate: '2024-01-15',
//       expectedDelivery: '2024-01-20',
//       supplier: 'MediCorp',
//       totalAmount: 2500,
//       priority: 'high'
//     },
//     {
//       id: 2,
//       orderNumber: 'ORD-002',
//       medicineName: 'Amoxicillin 250mg',
//       quantity: 50,
//       status: 'approved',
//       orderDate: '2024-01-14',
//       expectedDelivery: '2024-01-18',
//       supplier: 'PharmaPlus',
//       totalAmount: 1800,
//       priority: 'medium'
//     },
//     {
//       id: 3,
//       orderNumber: 'ORD-003',
//       medicineName: 'Ibuprofen 400mg',
//       quantity: 200,
//       status: 'delivered',
//       orderDate: '2024-01-10',
//       expectedDelivery: '2024-01-15',
//       supplier: 'HealthCare Ltd',
//       totalAmount: 3200,
//       priority: 'low'
//     },
//     {
//       id: 4,
//       orderNumber: 'ORD-004',
//       medicineName: 'Omeprazole 20mg',
//       quantity: 75,
//       status: 'cancelled',
//       orderDate: '2024-01-12',
//       expectedDelivery: '2024-01-17',
//       supplier: 'MediCorp',
//       totalAmount: 1500,
//       priority: 'high'
//     }
//   ];

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setOrders(mockOrders);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
//       case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
//       case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
//       case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
//       default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
//       case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
//       case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
//       default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
//     }
//   };

//   const filteredOrders = orders.filter(order => {
//     const matchesSearch = order.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleStatusUpdate = (orderId, newStatus) => {
//     setOrders(prev => prev.map(order => 
//       order.id === orderId ? { ...order, status: newStatus } : order
//     ));
//   };

//   const handleExportOrders = () => {
//     // Export functionality
//     const csvContent = "data:text/csv;charset=utf-8," + 
//       "Order Number,Medicine,Quantity,Status,Order Date,Expected Delivery,Supplier,Amount\n" +
//       filteredOrders.map(order => 
//         `${order.orderNumber},${order.medicineName},${order.quantity},${order.status},${order.orderDate},${order.expectedDelivery},${order.supplier},${order.totalAmount}`
//       ).join("\n");
    
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "hospital_orders.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-white/10"
//         >
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
//                 <Package className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Hospital Orders</h1>
//                 <p className="text-gray-400">Manage and track your medicine orders</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Button
//                 onClick={handleExportOrders}
//                 variant="outline"
//                 className="border-white/20 text-white hover:bg-white/10"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Export
//               </Button>
//               <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
//                 <Package className="w-4 h-4 mr-2" />
//                 New Order
//               </Button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <Card className="p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-300 text-sm">Total Orders</p>
//                 <p className="text-2xl font-bold text-white">{orders.length}</p>
//               </div>
//               <Package className="w-8 h-8 text-blue-400" />
//             </div>
//           </Card>
//           <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-yellow-300 text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'pending').length}</p>
//               </div>
//               <Clock className="w-8 h-8 text-yellow-400" />
//             </div>
//           </Card>
//           <Card className="p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-300 text-sm">Delivered</p>
//                 <p className="text-2xl font-bold text-white">{orders.filter(o => o.status === 'delivered').length}</p>
//               </div>
//               <CheckCircle className="w-8 h-8 text-green-400" />
//             </div>
//           </Card>
//           <Card className="p-6 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-300 text-sm">Total Value</p>
//                 <p className="text-2xl font-bold text-white">₹{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
//               </div>
//               <Package className="w-8 h-8 text-purple-400" />
//             </div>
//           </Card>
//         </div>

//         {/* Filters */}
//         <Card className="p-6 bg-slate-800/50 border-white/10">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <Input
//                   placeholder="Search orders..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 bg-white/5 border-white/20 text-white"
//                 />
//               </div>
//             </div>
//             <Select value={statusFilter} onValueChange={setStatusFilter}>
//               <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/20 text-white">
//                 <SelectValue placeholder="Filter by status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Status</SelectItem>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="approved">Approved</SelectItem>
//                 <SelectItem value="delivered">Delivered</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </Card>

//         {/* Orders List */}
//         <div className="space-y-4">
//           {filteredOrders.map((order) => (
//             <motion.div
//               key={order.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:bg-slate-700/50 transition-colors"
//             >
//               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//                 <div className="flex-1 space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <h3 className="text-lg font-semibold text-white">{order.medicineName}</h3>
//                       <Badge className={`px-2 py-1 text-xs font-medium border ${getStatusColor(order.status)}`}>
//                         {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                       </Badge>
//                       <Badge className={`px-2 py-1 text-xs font-medium border ${getPriorityColor(order.priority)}`}>
//                         {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
//                       </Badge>
//                     </div>
//                     <p className="text-2xl font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-400">Order Number</p>
//                       <p className="text-white font-medium">{order.orderNumber}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-400">Quantity</p>
//                       <p className="text-white font-medium">{order.quantity} units</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-400">Supplier</p>
//                       <p className="text-white font-medium">{order.supplier}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-400">Expected Delivery</p>
//                       <p className="text-white font-medium">{order.expectedDelivery}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="border-white/20 text-white hover:bg-white/10"
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     View Details
//                   </Button>
//                   {order.status === 'pending' && (
//                     <>
//                       <Button
//                         onClick={() => handleStatusUpdate(order.id, 'approved')}
//                         size="sm"
//                         className="bg-green-600 hover:bg-green-700"
//                       >
//                         <CheckCircle className="w-4 h-4 mr-2" />
//                         Approve
//                       </Button>
//                       <Button
//                         onClick={() => handleStatusUpdate(order.id, 'cancelled')}
//                         variant="destructive"
//                         size="sm"
//                         className="bg-red-600 hover:bg-red-700"
//                       >
//                         <XCircle className="w-4 h-4 mr-2" />
//                         Cancel
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {filteredOrders.length === 0 && (
//           <Card className="p-12 text-center">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
//             <p className="text-gray-400">No orders match your current filters.</p>
//           </Card>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default HospitalOrdersPage; 

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Clock, CheckCircle, XCircle, Eye, Search, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const HospitalOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibleStock, setVisibleStock] = useState({});

  const mockOrders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      medicineName: 'Paracetamol 500mg',
      quantity: 100,
      status: 'pending',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-20',
      supplier: 'MediCorp',
      totalAmount: 2500,
      priority: 'high'
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      medicineName: 'Amoxicillin 250mg',
      quantity: 50,
      status: 'approved',
      orderDate: '2024-01-14',
      expectedDelivery: '2024-01-18',
      supplier: 'PharmaPlus',
      totalAmount: 1800,
      priority: 'medium'
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      medicineName: 'Ibuprofen 400mg',
      quantity: 200,
      status: 'delivered',
      orderDate: '2024-01-10',
      expectedDelivery: '2024-01-15',
      supplier: 'HealthCare Ltd',
      totalAmount: 3200,
      priority: 'low'
    },
    {
      id: 4,
      orderNumber: 'ORD-004',
      medicineName: 'Omeprazole 20mg',
      quantity: 75,
      status: 'pending',
      orderDate: '2024-01-12',
      expectedDelivery: '2024-01-17',
      supplier: 'MediCorp',
      totalAmount: 1500,
      priority: 'high'
    }
  ];

  useEffect(() => {
    const initialDonations = [
      { medicineName: "Paracetamol 500mg", availableQuantity: 120 },
      { medicineName: "Amoxicillin 250mg", availableQuantity: 30 },
      { medicineName: "Ibuprofen 400mg", availableQuantity: 200 },
      { medicineName: "Omeprazole 20mg", availableQuantity: 75 }
    ];
    localStorage.setItem("donations", JSON.stringify(initialDonations));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleStockVisibility = (orderId) => {
    setVisibleStock(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const getAvailableQuantityFromLocalStorage = (medicineName) => {
    const donations = JSON.parse(localStorage.getItem("donations")) || [];
    const donation = donations.find(d => d.medicineName.toLowerCase() === medicineName.toLowerCase());
    return donation ? donation.availableQuantity : 0;
  };

  const checkDonationAvailabilityFromLocalStorage = (medicineName, requiredQty) => {
    const availableQty = getAvailableQuantityFromLocalStorage(medicineName);
    return {
      available: availableQty >= requiredQty,
      availableQuantity: availableQty
    };
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (newStatus === "completed") {
      const result = checkDonationAvailabilityFromLocalStorage(order.medicineName, order.quantity);

      if (!result.available) {
        alert(`Not enough stock. Only ${result.availableQuantity} units available in donations.`);
        return;
      }

      const updatedDonations = JSON.parse(localStorage.getItem("donations") || "[]").map(d => {
        if (d.medicineName.toLowerCase() === order.medicineName.toLowerCase()) {
          return {
            ...d,
            availableQuantity: d.availableQuantity - order.quantity
          };
        }
        return d;
      });

      localStorage.setItem("donations", JSON.stringify(updatedDonations));
    }

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Order Number,Medicine,Quantity,Status,Order Date,Expected Delivery,Supplier,Amount\n" +
      filteredOrders.map(order =>
        `${order.orderNumber},${order.medicineName},${order.quantity},${order.status},${order.orderDate},${order.expectedDelivery},${order.supplier},${order.totalAmount}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hospital_orders.csv");
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Hospital Orders</h1>
                <p className="text-gray-400">Manage and track your medicine orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleExportOrders}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                <Package className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="p-6 bg-slate-800/50 border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48 bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-white/10 rounded-xl p-6 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-white">{order.medicineName}</h3>
                      <Badge className={`px-2 py-1 text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <Badge className={`px-2 py-1 text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Order Number</p>
                      <p className="text-white font-medium">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Quantity</p>
                      <p className="text-white font-medium">{order.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Supplier</p>
                      <p className="text-white font-medium">{order.supplier}</p>
                      {visibleStock[order.id] && (
                        <p className="text-sm text-blue-400 font-semibold mt-1">
                          Available in donations: {getAvailableQuantityFromLocalStorage(order.medicineName)} units
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-400">Expected Delivery</p>
                      <p className="text-white font-medium">{order.expectedDelivery}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {order.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={() => toggleStockVisibility(order.id)}
                        variant="secondary"
                        size="sm"
                        className="bg-blue-800 text-white hover:bg-blue-900"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        View Stock
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalOrdersPage;
