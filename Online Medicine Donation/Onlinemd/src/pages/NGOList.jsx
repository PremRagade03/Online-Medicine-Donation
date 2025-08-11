import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Eye, Trash2, Users, Shield, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { ngoService } from '@/services/ngoService';

// Replace your existing NGOList component with this
const NGOList = () => {
  const { user } = useAuth();
  const [ngos, setNgos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for adding new NGO
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    loadNgos();
  }, []);

  const loadNgos = async () => {
    try {
      setIsLoading(true);
      const data = await ngoService.getAllNgos();
      setNgos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading NGOs:', error);
      toast({
        title: "Error",
        description: "Failed to load NGOs",
        variant: "destructive"
      });
      setNgos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      organizationName: '',
      contactPerson: '',
      phone: '',
      address: '',
      email: '',
      password: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting NGO data:', formData);
      
      const result = await ngoService.addNgo(formData);
      console.log('NGO creation result:', result);
      
      toast({
        title: "Success!",
        description: "NGO added successfully",
      });

      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
      
      // Reload NGO list
      await loadNgos();
      
    } catch (error) {
      console.error('Error adding NGO:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add NGO. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ngoId) => {
    if (!confirm('Are you sure you want to delete this NGO?')) return;

    try {
      await ngoService.deleteNgo(ngoId);
      toast({
        title: "Success",
        description: "NGO deleted successfully"
      });
      await loadNgos();
    } catch (error) {
      console.error('Error deleting NGO:', error);
      toast({
        title: "Error",
        description: "Failed to delete NGO",
        variant: "destructive"
      });
    }
  };

  const filteredNgos = ngos.filter(ngo => 
    ngo.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>NGO Management - MediShare Admin</title>
        <meta name="description" content="Manage NGOs in the MediShare platform" />
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
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">NGO Management</h1>
                    <p className="text-lg text-gray-400">Manage and monitor registered NGOs</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="px-4 py-2 text-purple-400 border-purple-400">
                  <Shield className="w-4 h-4 mr-2" />
                  {ngos.length} NGOs
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Search and Add Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-white placeholder-gray-400 bg-white/10 border-white/20"
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add NGO
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl text-white bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white">Add New NGO</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Organization Name *
                      </label>
                      <Input
                        name="organizationName"
                        placeholder="Enter organization name"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        required
                        className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Contact Person *
                      </label>
                      <Input
                        name="contactPerson"
                        placeholder="Contact person name"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          Adding NGO...
                        </>
                      ) : (
                        'Add NGO'
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

          {/* NGO List */}
          <Card className="glass-effect border-purple-500/20">
            <div className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <span className="ml-2 text-white">Loading NGOs...</span>
                </div>
              ) : filteredNgos.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-xl font-medium text-white">
                    {searchTerm ? 'No NGOs found' : 'No NGOs registered yet'}
                  </h3>
                  <p className="text-gray-400">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Start by adding your first NGO to the platform'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNgos.map((ngo) => (
                    <motion.div
                      key={ngo.id || ngo.ngoId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 transition-colors rounded-lg bg-white/5 hover:bg-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20">
                              <Users className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {ngo.organizationName}
                              </h3>
                              <p className="text-sm text-gray-400">
                                Contact: {ngo.contactPerson}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{ngo.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{ngo.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-white truncate">{ngo.address}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Badge
                              variant={ngo.status === 'verified' ? 'default' : 'secondary'}
                              className={
                                ngo.status === 'verified'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              }
                            >
                              {ngo.status || 'Pending'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(ngo.id || ngo.ngoId)}
                            className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default NGOList;