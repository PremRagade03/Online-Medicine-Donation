import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '@/services/ngoService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { Loader2 } from 'lucide-react';

const NGOForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting NGO data:', formData);
      
      // Call the service method
      const result = await ngoService.addNgo(formData);
      
      console.log('NGO creation result:', result);
      
      toast({ 
        title: "Success", 
        description: "NGO added successfully",
        variant: "default"
      });
      
      // Navigate back to NGO list
      navigate('/ngos');
      
    } catch (error) {
      console.error('Error adding NGO:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to add NGO. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Add New NGO</CardTitle>
            <p className="text-gray-400">Fill in the details to add a new NGO to the system</p>
          </CardHeader>
          <CardContent>
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
                    onChange={handleChange} 
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
                    onChange={handleChange} 
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
                    onChange={handleChange} 
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
                    onChange={handleChange} 
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
                  onChange={handleChange} 
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
                  onChange={handleChange} 
                  required 
                  className="text-white placeholder-gray-400 bg-white/10 border-white/20"
                  minLength={6}
                />
                <p className="mt-1 text-xs text-gray-400">Password must be at least 6 characters long</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 text-white bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
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
                  onClick={() => navigate('/ngos')}
                  disabled={isLoading}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NGOForm;