// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { 
//   Search, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Building2, 
//   MapPin, 
//   Phone, 
//   Mail,
//   Filter,
//   MoreHorizontal
// } from 'lucide-react';
// import DashboardLayout from '@/components/DashboardLayout';

// const HospitalList = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [filteredHospitals, setFilteredHospitals] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const navigate = useNavigate();

//   // Dummy data for hospitals
//   const dummyHospitals = [
//     {
//       id: 1,
//       name: 'City General Hospital',
//       address: '123 Main Street, Downtown',
//       city: 'New York',
//       state: 'NY',
//       phone: '+1 (555) 123-4567',
//       email: 'contact@citygeneral.com',
//       status: 'active',
//       type: 'General',
//       beds: 500,
//       rating: 4.5,
//       joinedDate: '2023-01-15'
//     },
//     {
//       id: 2,
//       name: 'Memorial Medical Center',
//       address: '456 Oak Avenue, Midtown',
//       city: 'Los Angeles',
//       state: 'CA',
//       phone: '+1 (555) 234-5678',
//       email: 'info@memorialmc.com',
//       status: 'active',
//       type: 'Specialized',
//       beds: 300,
//       rating: 4.8,
//       joinedDate: '2023-02-20'
//     },
//     {
//       id: 3,
//       name: 'Community Health Center',
//       address: '789 Pine Street, Suburb',
//       city: 'Chicago',
//       state: 'IL',
//       phone: '+1 (555) 345-6789',
//       email: 'hello@communityhealth.com',
//       status: 'pending',
//       type: 'Community',
//       beds: 150,
//       rating: 4.2,
//       joinedDate: '2023-03-10'
//     },
//     {
//       id: 4,
//       name: 'Regional Medical Hospital',
//       address: '321 Elm Street, Downtown',
//       city: 'Houston',
//       state: 'TX',
//       phone: '+1 (555) 456-7890',
//       email: 'contact@regionalmed.com',
//       status: 'active',
//       type: 'General',
//       beds: 400,
//       rating: 4.6,
//       joinedDate: '2023-01-30'
//     },
//     {
//       id: 5,
//       name: 'University Medical Center',
//       address: '654 College Blvd, Campus',
//       city: 'Boston',
//       state: 'MA',
//       phone: '+1 (555) 567-8901',
//       email: 'info@universitymed.com',
//       status: 'active',
//       type: 'Academic',
//       beds: 600,
//       rating: 4.9,
//       joinedDate: '2023-02-15'
//     }
//   ];

//   useEffect(() => {
//     // Simulate API call
//     setTimeout(() => {
//       setHospitals(dummyHospitals);
//       setFilteredHospitals(dummyHospitals);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     let filtered = hospitals;

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(hospital =>
//         hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         hospital.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by status
//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter(hospital => hospital.status === selectedStatus);
//     }

//     setFilteredHospitals(filtered);
//   }, [searchTerm, selectedStatus, hospitals]);

//   const handleDelete = (hospitalId) => {
//     if (window.confirm('Are you sure you want to delete this hospital?')) {
//       setHospitals(hospitals.filter(hospital => hospital.id !== hospitalId));
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'inactive':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case 'General':
//         return 'bg-blue-100 text-blue-800';
//       case 'Specialized':
//         return 'bg-purple-100 text-purple-800';
//       case 'Community':
//         return 'bg-green-100 text-green-800';
//       case 'Academic':
//         return 'bg-orange-100 text-orange-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="w-12 h-12 border-b-2 border-green-500 rounded-full animate-spin"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Hospitals</h1>
//             <p className="mt-1 text-gray-400">Manage hospital registrations and information</p>
//           </div>
//           <Button
//             onClick={() => navigate('/hospitals/new')}
//             className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Hospital
//           </Button>
//         </div>

//         {/* Search and Filters */}
//         <Card className="bg-white/5 border-white/20">
//           <CardContent className="p-6">
//             <div className="flex flex-col gap-4 lg:flex-row">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
//                   <Input
//                     placeholder="Search hospitals..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 text-white bg-white/5 border-white/20 placeholder:text-gray-400"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="px-3 py-2 text-white border rounded-md bg-white/5 border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="pending">Pending</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//                 <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
//                   <Filter className="w-4 h-4 mr-2" />
//                   More Filters
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Total Hospitals</p>
//                   <p className="text-2xl font-bold text-white">{hospitals.length}</p>
//                 </div>
//                 <Building2 className="w-8 h-8 text-green-400" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Active</p>
//                   <p className="text-2xl font-bold text-white">
//                     {hospitals.filter(h => h.status === 'active').length}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Pending</p>
//                   <p className="text-2xl font-bold text-white">
//                     {hospitals.filter(h => h.status === 'pending').length}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
//                   <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Total Beds</p>
//                   <p className="text-2xl font-bold text-white">
//                     {hospitals.reduce((sum, h) => sum + h.beds, 0).toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Hospitals List */}
//         <Card className="bg-white/5 border-white/20">
//           <CardHeader>
//             <CardTitle className="text-white">Hospital Directory</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {filteredHospitals.map((hospital) => (
//                 <div
//                   key={hospital.id}
//                   className="flex flex-col justify-between p-4 transition-all border rounded-lg lg:flex-row lg:items-center bg-white/5 border-white/10 hover:bg-white/10"
//                 >
//                   <div className="flex-1 space-y-3">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//                           <Building2 className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-white">{hospital.name}</h3>
//                           <div className="flex items-center space-x-4 text-sm text-gray-400">
//                             <span className="flex items-center">
//                               <MapPin className="w-4 h-4 mr-1" />
//                               {hospital.city}, {hospital.state}
//                             </span>
//                             <span className="flex items-center">
//                               <Phone className="w-4 h-4 mr-1" />
//                               {hospital.phone}
//                             </span>
//                             <span className="flex items-center">
//                               <Mail className="w-4 h-4 mr-1" />
//                               {hospital.email}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Badge className={getStatusColor(hospital.status)}>
//                           {hospital.status}
//                         </Badge>
//                         <Badge className={getTypeColor(hospital.type)}>
//                           {hospital.type}
//                         </Badge>
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
//                       <div>
//                         <span className="text-gray-400">Beds:</span>
//                         <span className="ml-2 text-white">{hospital.beds}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Rating:</span>
//                         <span className="ml-2 text-white">{hospital.rating}/5</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Joined:</span>
//                         <span className="ml-2 text-white">
//                           {new Date(hospital.joinedDate).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-400">ID:</span>
//                         <span className="ml-2 text-white">#{hospital.id}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center mt-4 space-x-2 lg:mt-0">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/hospitals/${hospital.id}`)}
//                       className="text-white border-white/20 hover:bg-white/10"
//                     >
//                       <Eye className="w-4 h-4 mr-1" />
//                       View
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/hospitals/${hospital.id}/edit`)}
//                       className="text-white border-white/20 hover:bg-white/10"
//                     >
//                       <Edit className="w-4 h-4 mr-1" />
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDelete(hospital.id)}
//                       className="text-red-400 border-red-500/30 hover:bg-red-500/10"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {filteredHospitals.length === 0 && (
//               <div className="py-8 text-center">
//                 <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//                 <h3 className="mb-2 text-lg font-medium text-white">No hospitals found</h3>
//                 <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default HospitalList; 

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { hospitalService } from '@/services/hospitalService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Search,
//   Plus,
//   Edit,
//   Trash2,
//   Eye,
//   Building2,
//   MapPin,
//   Phone,
//   Mail,
//   Filter,
// } from 'lucide-react';
// import DashboardLayout from '@/components/DashboardLayout';
// import { toast } from '@/components/ui/use-toast';

// const HospitalList = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [filteredHospitals, setFilteredHospitals] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const fetchHospitals = async () => {
//     try {
//       setLoading(true);
//       const data = await hospitalService.getAllHospitals();
//       setHospitals(data);
//       setFilteredHospitals(data);
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to load hospitals.',
//         variant: 'destructive',
//       });
//       console.error('Fetch error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     let filtered = hospitals;

//     if (searchTerm) {
//       filtered = filtered.filter((hospital) =>
//         [hospital.name, hospital.city, hospital.email]
//           .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     }

//     if (selectedStatus !== 'all') {
//       filtered = filtered.filter(hospital => hospital.status === selectedStatus);
//     }

//     setFilteredHospitals(filtered);
//   }, [searchTerm, selectedStatus, hospitals]);

//   const handleDelete = async (hospitalId) => {
//     if (!window.confirm('Are you sure you want to delete this hospital?')) return;
//     try {
//       await hospitalService.deleteHospital(hospitalId);
//       toast({ title: 'Deleted', description: 'Hospital removed successfully.' });
//       fetchHospitals();
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'Failed to delete hospital.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case 'General': return 'bg-blue-100 text-blue-800';
//       case 'Specialized': return 'bg-purple-100 text-purple-800';
//       case 'Community': return 'bg-green-100 text-green-800';
//       case 'Academic': return 'bg-orange-100 text-orange-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="w-12 h-12 border-b-2 border-green-500 rounded-full animate-spin"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Hospitals</h1>
//             <p className="mt-1 text-gray-400">Manage hospital registrations and information</p>
//           </div>
//           <Button
//             onClick={() => navigate('/hospitals/new')}
//             className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Hospital
//           </Button>
//         </div>

//         {/* Search and Filters */}
//         <Card className="bg-white/5 border-white/20">
//           <CardContent className="p-6">
//             <div className="flex flex-col gap-4 lg:flex-row">
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
//                   <Input
//                     placeholder="Search hospitals..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 text-white bg-white/5 border-white/20 placeholder:text-gray-400"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="px-3 py-2 text-white border rounded-md bg-white/5 border-white/20 focus:outline-none focus:ring-2 focus:ring-green-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="active">Active</option>
//                   <option value="pending">Pending</option>
//                   <option value="inactive">Inactive</option>
//                 </select>
//                 <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
//                   <Filter className="w-4 h-4 mr-2" />
//                   More Filters
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Total Hospitals</p>
//                   <p className="text-2xl font-bold text-white">{hospitals.length}</p>
//                 </div>
//                 <Building2 className="w-8 h-8 text-green-400" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Active</p>
//                   <p className="text-2xl font-bold text-white">
//                     {hospitals.filter(h => h.status === 'active').length}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Pending</p>
//                   <p className="text-2xl font-bold text-white">
//                     {hospitals.filter(h => h.status === 'pending').length}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
//                   <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="bg-white/5 border-white/20">
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-400">Total Beds</p>
//                   <p className="text-2xl font-bold text-white">
//                     {hospitals.reduce((sum, h) => sum + (h.beds || 0), 0).toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Hospitals List */}
//         <Card className="bg-white/5 border-white/20">
//           <CardHeader>
//             <CardTitle className="text-white">Hospital Directory</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {filteredHospitals.map((hospital) => (
//                 <div
//                   key={hospital.id}
//                   className="flex flex-col justify-between p-4 transition-all border rounded-lg lg:flex-row lg:items-center bg-white/5 border-white/10 hover:bg-white/10"
//                 >
//                   <div className="flex-1 space-y-3">
//                     <div className="flex items-start justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
//                           <Building2 className="w-5 h-5 text-white" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-white">{hospital.name}</h3>
//                           <div className="flex items-center space-x-4 text-sm text-gray-400">
//                             <span className="flex items-center">
//                               <MapPin className="w-4 h-4 mr-1" />
//                               {hospital.city}, {hospital.state}
//                             </span>
//                             <span className="flex items-center">
//                               <Phone className="w-4 h-4 mr-1" />
//                               {hospital.phone}
//                             </span>
//                             <span className="flex items-center">
//                               <Mail className="w-4 h-4 mr-1" />
//                               {hospital.email}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {/* <Badge className={getStatusColor(hospital.status)}>
//                           {hospital.status}
//                         </Badge>
//                         <Badge className={getTypeColor(hospital.type)}>
//                           {hospital.type}
//                         </Badge> */}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
//                       {/* <div>
//                         <span className="text-gray-400">Beds:</span>
//                         <span className="ml-2 text-white">{hospital.beds}</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Rating:</span>
//                         <span className="ml-2 text-white">{hospital.rating}/5</span>
//                       </div>
//                       <div>
//                         <span className="text-gray-400">Joined:</span>
//                         <span className="ml-2 text-white">
//                           {hospital.joinedDate ? new Date(hospital.joinedDate).toLocaleDateString() : 'N/A'}
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-gray-400">ID:</span>
//                         <span className="ml-2 text-white">#{hospital.id}</span>
//                       </div> */}
//                     </div>
//                   </div>

//                   <div className="flex items-center mt-4 space-x-2 lg:mt-0">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/hospitals/${hospital.id}`)}
//                       className="text-white border-white/20 hover:bg-white/10"
//                     >
//                       <Eye className="w-4 h-4 mr-1" />
//                       View
//                     </Button>
//                     {/* <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/hospitals/${hospital.id}/edit`)}
//                       className="text-white border-white/20 hover:bg-white/10"
//                     >
//                       <Edit className="w-4 h-4 mr-1" />
//                       Edit
//                     </Button> */}
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDelete(hospital.id)}
//                       className="text-red-400 border-red-500/30 hover:bg-red-500/10"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" />
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               ))}

//               {filteredHospitals.length === 0 && (
//                 <div className="py-8 text-center">
//                   <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
//                   <h3 className="mb-2 text-lg font-medium text-white">No hospitals found</h3>
//                   <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default HospitalList;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Eye, Trash2, Building2, Shield, Phone, Mail, MapPin, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { hospitalService } from '@/services/hospitalService';

const HospitalList = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Form state for adding new hospital
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    password: '',
    licenseNumber: '',
  });

  useEffect(() => {
    loadHospitals();
  }, []);

  useEffect(() => {
    filterHospitals();
  }, [searchTerm, selectedStatus, hospitals]);

  const loadHospitals = async () => {
    try {
      setIsLoading(true);
      const data = await hospitalService.getAllHospitals();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to load hospitals",
        variant: "destructive"
      });
      setHospitals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHospitals = () => {
    let filtered = hospitals;

    if (searchTerm) {
      filtered = filtered.filter(hospital =>
        [hospital.name, hospital.city, hospital.email, hospital.phone]
          .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(hospital => hospital.status === selectedStatus);
    }

    setFilteredHospitals(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      password: '',
      licenseNumber: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting hospital data:', formData);
      
      const result = await hospitalService.createHospital(formData);

      console.log('Hospital creation result:', result);
      
      toast({
        title: "Success!",
        description: "Hospital added successfully",
      });

      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
      
      // Reload hospital list
      await loadHospitals();
      
    } catch (error) {
      console.error('Error adding hospital:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add hospital. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (hospitalId) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;

    try {
      await hospitalService.deleteHospital(hospitalId);
      toast({
        title: "Success",
        description: "Hospital deleted successfully"
      });
      await loadHospitals();
    } catch (error) {
      console.error('Error deleting hospital:', error);
      toast({
        title: "Error",
        description: "Failed to delete hospital",
        variant: "destructive"
      });
    }
  };

  const openViewModal = (hospital) => {
    setSelectedHospital(hospital);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setSelectedHospital(null);
    setViewModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': 
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': 
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive': 
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <>
      <Helmet>
        <title>Hospital Management - MediShare Admin</title>
        <meta name="description" content="Manage hospitals in the MediShare platform" />
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
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Hospital Management</h1>
                    <p className="text-lg text-gray-400">Manage and monitor registered hospitals</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-4 py-2 text-blue-400 border-blue-400">
                  <Shield className="w-4 h-4 mr-2" />
                  {hospitals.length} Hospitals
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Search and Add Section */}
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    placeholder="Search hospitals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-white placeholder-gray-400 bg-white/10 border-white/20"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 text-white border rounded-md bg-white/5 border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                  
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="text-white bg-green-600 hover:bg-green-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Hospital
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white">Add New Hospital</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                              Hospital Name *
                            </label>
                            <Input
                              name="name"
                              placeholder="Enter hospital name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                              License Number
                            </label>
                            <Input
                              name="licenseNumber"
                              placeholder="Hospital license number"
                              value={formData.licenseNumber}
                              onChange={handleInputChange}
                              className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                              Email Address *
                            </label>
                            <Input
                              name="email"
                              type="email"
                              placeholder="Enter email address"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                              Phone Number *
                            </label>
                            <Input
                              name="phone"
                              placeholder="Enter phone number"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-300">
                            Address *
                          </label>
                          <Input
                            name="address"
                            placeholder="Enter complete address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                              City *
                            </label>
                            <Input
                              name="city"
                              placeholder="Enter city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                            />
                          </div>
                          
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">
                              State *
                            </label>
                            <Input
                              name="state"
                              placeholder="Enter state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                              className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-300">
                            Password *
                          </label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Create a secure password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                          />
                          <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters long</p>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 text-white bg-green-600 hover:bg-green-700"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding Hospital...
                              </>
                            ) : (
                              'Add Hospital'
                            )}
                          </Button>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              resetForm();
                              setIsAddDialogOpen(false);
                            }}
                            disabled={isSubmitting}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hospital List */}
          <Card className="glass-effect border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">Hospital Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <span className="ml-2 text-white">Loading hospitals...</span>
                </div>
              ) : filteredHospitals.length === 0 ? (
                <div className="py-12 text-center">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-xl font-medium text-white">
                    {searchTerm ? 'No hospitals found' : 'No hospitals registered yet'}
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Start by adding your first hospital to the platform'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHospitals.map((hospital) => (
                    <motion.div
                      key={hospital.id || hospital.hospitalId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col justify-between p-4 transition-all border rounded-lg lg:flex-row lg:items-center bg-white/5 border-white/10 hover:bg-white/10"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
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
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getStatusColor(hospital.status || 'pending')}
                          >
                            {hospital.status || 'Pending'}
                          </Badge>
                          {hospital.licenseNumber && (
                            <Badge variant="outline" className="text-xs text-gray-400 border-gray-500/30">
                              License: {hospital.licenseNumber}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 space-x-2 lg:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewModal(hospital)}
                          className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(hospital.id || hospital.hospitalId)}
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Modal */}
          <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
            <DialogContent className="max-w-md text-white bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-white">
                  Hospital Details
                </DialogTitle>
              </DialogHeader>
              {selectedHospital && (
                <div className="space-y-4 text-sm text-white">
                  <div>
                    <span className="font-medium text-gray-300">Hospital ID:</span> 
                    <span className="ml-2">{selectedHospital.hospitalId || selectedHospital.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Name:</span> 
                    <span className="ml-2">{selectedHospital.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Email:</span> 
                    <span className="ml-2">{selectedHospital.email}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Phone:</span> 
                    <span className="ml-2">{selectedHospital.phone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Address:</span> 
                    <span className="ml-2">{selectedHospital.address || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">City, State:</span> 
                    <span className="ml-2">{selectedHospital.city}, {selectedHospital.state}</span>
                  </div>
                  {selectedHospital.licenseNumber && (
                    <div>
                      <span className="font-medium text-gray-300">License Number:</span> 
                      <span className="ml-2">{selectedHospital.licenseNumber}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-300">Status:</span> 
                    <Badge
                      variant="outline"
                      className={`ml-2 ${getStatusColor(selectedHospital.status || 'pending')}`}
                    >
                      {selectedHospital.status || 'Pending'}
                    </Badge>
                  </div>
                  {selectedHospital.requests && (
                    <div>
                      <span className="font-medium text-gray-300">Total Requests:</span> 
                      <span className="ml-2">{selectedHospital.requests.length}</span>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </>
  );
};

export default HospitalList;