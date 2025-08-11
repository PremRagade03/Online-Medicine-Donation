// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { requestService } from '@/services/requestService';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { useToast } from '@/components/ui/use-toast';
// // import { Search, Plus, Edit, Trash2, Eye, ClipboardList } from 'lucide-react';
// // import DashboardLayout from '@/components/DashboardLayout';

// // const RequestList = () => {
// //   const [requests, setRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filteredRequests, setFilteredRequests] = useState([]);
// //   const navigate = useNavigate();
// //   const { toast } = useToast();

// //   useEffect(() => {
// //     fetchRequests();
// //   }, []);

// //   useEffect(() => {
// //     const filtered = requests.filter(request =>
// //       request.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       request.status?.toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //     setFilteredRequests(filtered);
// //   }, [searchTerm, requests]);

// //   const fetchRequests = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await requestService.getAllRequests();
// //       setRequests(data);
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to fetch requests",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (requestId) => {
// //     if (window.confirm('Are you sure you want to delete this request?')) {
// //       try {
// //         await requestService.deleteRequest(requestId);
// //         setRequests(requests.filter(request => request.id !== requestId));
// //         toast({
// //           title: "Success",
// //           description: "Request deleted successfully",
// //         });
// //       } catch (error) {
// //         toast({
// //           title: "Error",
// //           description: "Failed to delete request",
// //           variant: "destructive",
// //         });
// //       }
// //     }
// //   };

// //   const getStatusBadgeColor = (status) => {
// //     switch (status?.toLowerCase()) {
// //       case 'pending':
// //         return 'bg-yellow-500';
// //       case 'approved':
// //         return 'bg-green-500';
// //       case 'rejected':
// //         return 'bg-red-500';
// //       case 'completed':
// //         return 'bg-blue-500';
// //       default:
// //         return 'bg-gray-500';
// //     }
// //   };

// //   const formatDate = (dateString) => {
// //     return new Date(dateString).toLocaleDateString();
// //   };

// //   if (loading) {
// //     return (
// //       <DashboardLayout>
// //         <div className="flex items-center justify-center h-64">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
// //         </div>
// //       </DashboardLayout>
// //     );
// //   }

// //   return (
// //     <DashboardLayout>
// //       <div className="space-y-6">
// //       <div className="flex justify-between items-center mb-6">
// //         <h1 className="text-3xl font-bold text-white">Requests Management</h1>
// //         <Button onClick={() => navigate('/requests/new')} className="bg-green-600 hover:bg-green-700">
// //           <Plus className="mr-2 h-4 w-4" />
// //           Add Request
// //         </Button>
// //       </div>

// //       <Card className="mb-6">
// //         <CardContent className="p-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
// //             <Input
// //               placeholder="Search requests..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="pl-10"
// //             />
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <div className="grid gap-4">
// //         {filteredRequests.map((request) => (
// //           <Card key={request.id} className="bg-white/10 backdrop-blur-sm border-white/20">
// //             <CardContent className="p-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-4">
// //                   <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
// //                     <ClipboardList className="h-6 w-6 text-white" />
// //                   </div>
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-white">{request.medicineName}</h3>
// //                     <p className="text-gray-300">Requester: {request.requesterName}</p>
// //                     <div className="flex items-center space-x-2 mt-1">
// //                       <Badge className={getStatusBadgeColor(request.status)}>
// //                         {request.status}
// //                       </Badge>
// //                       <span className="text-gray-400 text-sm">
// //                         {formatDate(request.createdAt)}
// //                       </span>
// //                     </div>
// //                     {request.quantity && (
// //                       <p className="text-gray-300 text-sm">Quantity: {request.quantity}</p>
// //                     )}
// //                     {request.reason && (
// //                       <p className="text-gray-300 text-sm">Reason: {request.reason}</p>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center space-x-2">
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => navigate(`/requests/${request.id}`)}
// //                   >
// //                     <Eye className="h-4 w-4" />
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => navigate(`/requests/${request.id}/edit`)}
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                   </Button>
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => handleDelete(request.id)}
// //                     className="text-red-500 hover:text-red-700"
// //                   >
// //                     <Trash2 className="h-4 w-4" />
// //                   </Button>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>

// //       {filteredRequests.length === 0 && !loading && (
// //         <Card className="bg-white/10 backdrop-blur-sm border-white/20">
// //           <CardContent className="p-8 text-center">
// //             <p className="text-gray-300 text-lg">No requests found</p>
// //             <Button 
// //               onClick={() => navigate('/requests/new')}
// //               className="mt-4 bg-green-600 hover:bg-green-700"
// //             >
// //               <Plus className="mr-2 h-4 w-4" />
// //               Add First Request
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       )}
// //       </div>
// //     </DashboardLayout>
// //   );
// // };

// // export default RequestList; 

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { requestService } from '@/services/requestService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/components/ui/use-toast';
// import { Search, Plus, Edit, Trash2, Eye, ClipboardList } from 'lucide-react';
// import DashboardLayout from '@/components/DashboardLayout';

// const RequestList = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   useEffect(() => {
//     const filtered = requests.filter(request =>
//       request.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       request.status?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredRequests(filtered);
//   }, [searchTerm, requests]);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const data = await requestService.getAllRequests();
//       setRequests(data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch requests",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (requestId) => {
//     if (window.confirm('Are you sure you want to delete this request?')) {
//       try {
//         await requestService.deleteRequest(requestId);
//         setRequests(requests.filter(request => request.id !== requestId));
//         toast({
//           title: "Success",
//           description: "Request deleted successfully",
//         });
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to delete request",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const getStatusBadgeColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending': return 'bg-yellow-500';
//       case 'approved': return 'bg-green-500';
//       case 'rejected': return 'bg-red-500';
//       case 'completed': return 'bg-blue-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6 px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <h1 className="text-2xl sm:text-3xl font-bold text-white">Requests Management</h1>
//           <Button onClick={() => navigate('/requests/new')} className="bg-green-600 hover:bg-green-700">
//             <Plus className="mr-2 h-4 w-4" />
//             Add Request
//           </Button>
//         </div>

//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search requests..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredRequests.map((request) => (
//             <Card key={request.id} className="bg-white/10 backdrop-blur-sm border-white/20">
//               <CardContent className="p-4 sm:p-6">
//                 <div className="flex flex-col gap-4">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
//                       <ClipboardList className="h-6 w-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-white">{request.medicineName}</h3>
//                       <p className="text-gray-300">Requester: {request.requesterName}</p>
//                       <div className="flex items-center space-x-2 mt-1 flex-wrap">
//                         <Badge className={getStatusBadgeColor(request.status)}>
//                           {request.status}
//                         </Badge>
//                         <span className="text-gray-400 text-sm">
//                           {formatDate(request.createdAt)}
//                         </span>
//                       </div>
//                       {request.quantity && (
//                         <p className="text-gray-300 text-sm">Quantity: {request.quantity}</p>
//                       )}
//                       {request.reason && (
//                         <p className="text-gray-300 text-sm">Reason: {request.reason}</p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap justify-end gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/requests/${request.id}`)}
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/requests/${request.id}/edit`)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDelete(request.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {filteredRequests.length === 0 && !loading && (
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20">
//             <CardContent className="p-8 text-center">
//               <p className="text-gray-300 text-lg">No requests found</p>
//               <Button
//                 onClick={() => navigate('/requests/new')}
//                 className="mt-4 bg-green-600 hover:bg-green-700"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add First Request
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default RequestList;


// src/pages/RequestList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '@/services/requestService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash2, Eye, ClipboardList } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getAllRequests();
      setRequests(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await requestService.deleteRequest(id);
      setRequests(requests.filter((req) => req.id !== id));
      toast({ title: 'Deleted', description: 'Request removed.' });
    } catch {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-white font-bold">Requests Management</h1>
          <Button onClick={() => navigate('/requests/new')} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Request
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests
            .filter((r) =>
              [r.medicineName, r.requesterName, r.status]
                .join(' ')
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((request) => (
              <Card key={request.id} className="bg-white/10 text-white">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-500 rounded-full p-2">
                      <ClipboardList className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold">{request.medicineName}</p>
                      <p className="text-sm text-gray-300">By: {request.requesterName}</p>
                      <Badge>{request.status}</Badge>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button onClick={() => navigate(`/requests/${request.requestId}`)} size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => navigate(`/requests/${request.requestId}/edit`)} size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(request.requestId)} size="sm" className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RequestList;
