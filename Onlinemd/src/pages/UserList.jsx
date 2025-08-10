// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { userService } from '@/services/userService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/components/ui/use-toast';
// import { Search, Plus, Edit, Trash2, Eye, UserPlus } from 'lucide-react';
// import DashboardLayout from '@/components/DashboardLayout';

// const UserList = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const filtered = users.filter(user =>
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.role?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await userService.getAllUsers();
//       setUsers(data);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to fetch users",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       try {
//         await userService.deleteUser(userId);
//         setUsers(prev => prev.filter(user => user.userId !== userId)); // Fixed here
//         toast({
//           title: "Success",
//           description: "User deleted successfully",
//         });
//       } catch (error) {
//         console.error("Delete error:", error);
//         toast({
//           title: "Error",
//           description: error.message || "Failed to delete user",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const getRoleBadgeColor = (role) => {
//     switch (role?.toLowerCase()) {
//       case 'admin':
//         return 'bg-red-500';
//       case 'donor':
//         return 'bg-green-500';
//       case 'hospital':
//         return 'bg-blue-500';
//       case 'ngo':
//         return 'bg-purple-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

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
//       <div className="space-y-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-white">Users Management</h1>
//           <Button onClick={() => navigate('/users/new')} className="bg-green-600 hover:bg-green-700">
//             <UserPlus className="mr-2 h-4 w-4" />
//             Add User
//           </Button>
//         </div>

//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid gap-4">
//           {filteredUsers.map((user) => (
//             <Card key={user.userId} className="bg-white/10 backdrop-blur-sm border-white/20">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-lg">
//                         {user.name?.charAt(0)?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-white">{user.name}</h3>
//                       <p className="text-gray-300">{user.email}</p>
//                       <div className="flex items-center space-x-2 mt-1">
//                         <Badge className={getRoleBadgeColor(user.role)}>
//                           {user.role}
//                         </Badge>
//                         {user.isActive !== undefined && (
//                           <Badge variant={user.isActive ? "default" : "secondary"}>
//                             {user.isActive ? 'Active' : 'Inactive'}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/users/${user.userId}`)} // fixed
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>

//                     {/* <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => navigate(`/users/${user.userId}/edit`)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button> */}

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleDelete(user.userId)} // fixed
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

//         {filteredUsers.length === 0 && !loading && (
//           <Card className="bg-white/10 backdrop-blur-sm border-white/20">
//             <CardContent className="p-8 text-center">
//               <p className="text-gray-300 text-lg">No users found</p>
//               <Button 
//                 onClick={() => navigate('/users/new')}
//                 className="mt-4 bg-green-600 hover:bg-green-700"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add First User
//               </Button>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default UserList;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Trash2,
  Eye,
  UserPlus
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(prev => prev.filter(user => user.userId !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500';
      case 'donor':
        return 'bg-green-500';
      case 'hospital':
        return 'bg-blue-500';
      case 'ngo':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
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
    // <DashboardLayout>
    //   <div className="space-y-6">
    //     <div className="flex justify-between items-center mb-6">
    //       <h1 className="text-3xl font-bold text-white">Users Management</h1>
    //       <Button onClick={() => navigate('/users/new')} className="bg-green-600 hover:bg-green-700">
    //         <UserPlus className="mr-2 h-4 w-4" />
    //         Add User
    //       </Button>
    //     </div>

    //     <Card className="mb-6">
    //       <CardContent className="p-4">
    //         <div className="relative">
    //           <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    //           <Input
    //             placeholder="Search users..."
    //             value={searchTerm}
    //             onChange={(e) => setSearchTerm(e.target.value)}
    //             className="pl-10"
    //           />
    //         </div>
    //       </CardContent>
    //     </Card>

    //     <div className="grid gap-4">
    //       {filteredUsers.map((user) => (
    //         <Card key={user.userId} className="bg-white/10 backdrop-blur-sm border-white/20">
    //           <CardContent className="p-6">
    //             <div className="flex items-center justify-between">
    //               <div className="flex items-center space-x-4">
    //                 <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
    //                   <span className="text-white font-bold text-lg">
    //                     {user.name?.charAt(0)?.toUpperCase() || 'U'}
    //                   </span>
    //                 </div>
    //                 <div>
    //                   <h3 className="text-lg font-semibold text-white">{user.name}</h3>
    //                   <p className="text-gray-300">{user.email}</p>
    //                   <div className="flex items-center space-x-2 mt-1">
    //                     <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
    //                     {user.isActive !== undefined && (
    //                       <Badge variant={user.isActive ? "default" : "secondary"}>
    //                         {user.isActive ? 'Active' : 'Inactive'}
    //                       </Badge>
    //                     )}
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="flex items-center space-x-2">
    //                 <Button
    //                   variant="outline"
    //                   size="sm"
    //                   onClick={() => {
    //                     setSelectedUser(user);
    //                     setShowViewDialog(true);
    //                   }}
    //                 >
    //                   <Eye className="h-4 w-4" />
    //                 </Button>
    //                 <Button
    //                   variant="outline"
    //                   size="sm"
    //                   onClick={() => handleDelete(user.userId)}
    //                   className="text-red-500 hover:text-red-700"
    //                 >
    //                   <Trash2 className="h-4 w-4" />
    //                 </Button>
    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       ))}
    //     </div>

    //     {filteredUsers.length === 0 && !loading && (
    //       <Card className="bg-white/10 backdrop-blur-sm border-white/20">
    //         <CardContent className="p-8 text-center">
    //           <p className="text-gray-300 text-lg">No users found</p>
    //           <Button
    //             onClick={() => navigate('/users/new')}
    //             className="mt-4 bg-green-600 hover:bg-green-700"
    //           >
    //             <Plus className="mr-2 h-4 w-4" />
    //             Add First User
    //           </Button>
    //         </CardContent>
    //       </Card>
    //     )}

    //     {/* View User Dialog */}
    //     <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
    //       <DialogContent className="bg-slate-800 text-white border-blue-500/20 max-w-md">
    //         <DialogHeader>
    //           <DialogTitle className="text-white">User Details</DialogTitle>
    //         </DialogHeader>
    //         {selectedUser && (
    //           <div className="space-y-2 pt-2">
    //             <p><strong>Name:</strong> {selectedUser.name}</p>
    //             <p><strong>Email:</strong> {selectedUser.email}</p>
    //             <p><strong>Role:</strong> {selectedUser.role}</p>
    //             <p><strong>User ID:</strong> {selectedUser.userId}</p>
    //             <p>
    //               <strong>Status:</strong>{' '}
    //               {selectedUser.isActive ? (
    //                 <span className="text-green-400">Active</span>
    //               ) : (
    //                 <span className="text-red-400">Inactive</span>
    //               )}
    //             </p>
    //             {/* Optional: Donor details if available */}
    //             {selectedUser.role === 'donor' && selectedUser.phone && (
    //               <>
    //                 <hr className="my-3 border-white/10" />
    //                 <p><strong>Phone:</strong> {selectedUser.phone}</p>
    //                 {selectedUser.address && <p><strong>Address:</strong> {selectedUser.address}</p>}
    //               </>
    //             )}
    //           </div>
    //         )}
    //       </DialogContent>
    //     </Dialog>
    //   </div>
    // </DashboardLayout>
    <DashboardLayout>
  <div className="space-y-6 px-4 md:px-6 lg:px-8">
    {/* Header + Add Button */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Users Management</h1>
      <Button
        onClick={() => navigate('/users/new')}
        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </div>

    {/* Search Input */}
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </CardContent>
    </Card>

    {/* User List */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredUsers.map((user) => (
        <Card
          key={user.userId}
          className="bg-white/10 backdrop-blur-sm border-white/20"
        >
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Avatar + Info */}
              <div className="flex items-start sm:items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-gray-300 break-all">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    {user.isActive !== undefined && (
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowViewDialog(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(user.userId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* No users */}
    {filteredUsers.length === 0 && !loading && (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8 text-center">
          <p className="text-gray-300 text-lg">No users found</p>
          <Button
            onClick={() => navigate('/users/new')}
            className="mt-4 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First User
          </Button>
        </CardContent>
      </Card>
    )}

    {/* View Dialog */}
    <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
      <DialogContent className="bg-slate-800 text-white border-blue-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">User Details</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-2 pt-2">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>User ID:</strong> {selectedUser.userId}</p>
            <p>
              <strong>Status:</strong>{' '}
              {selectedUser.isActive ? (
                <span className="text-green-400">Active</span>
              ) : (
                <span className="text-red-400">Inactive</span>
              )}
            </p>
            {selectedUser.role === 'donor' && selectedUser.phone && (
              <>
                <hr className="my-3 border-white/10" />
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                {selectedUser.address && (
                  <p><strong>Address:</strong> {selectedUser.address}</p>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
</DashboardLayout>

  );
};

export default UserList;

