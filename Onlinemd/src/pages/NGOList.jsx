import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '@/services/ngoService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const NGOList = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNgos, setFilteredNgos] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchNgos();
  }, []);

  useEffect(() => {
    const filtered = ngos.filter(ngo =>
      ngo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNgos(filtered);
  }, [searchTerm, ngos]);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const data = await ngoService.getAllNgos();
      setNgos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch NGOs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ngoId) => {
    if (window.confirm('Are you sure you want to delete this NGO?')) {
      try {
        await ngoService.deleteNgo(ngoId);
        setNgos(ngos.filter(ngo => ngo.id !== ngoId));
        toast({
          title: "Success",
          description: "NGO deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete NGO",
          variant: "destructive",
        });
      }
    }
  };

  const getVerificationBadgeColor = (isVerified) => {
    return isVerified ? 'bg-green-500' : 'bg-yellow-500';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">NGOs Management</h1>
        <Button onClick={() => navigate('/ngos/new')} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add NGO
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search NGOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredNgos.map((ngo) => (
          <Card key={ngo.id} className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{ngo.name}</h3>
                    <p className="text-gray-300">{ngo.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getVerificationBadgeColor(ngo.isVerified)}>
                        {ngo.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                      {ngo.location && (
                        <span className="text-gray-400 text-sm">{ngo.location}</span>
                      )}
                    </div>
                    {ngo.phone && (
                      <p className="text-gray-300 text-sm">Phone: {ngo.phone}</p>
                    )}
                    {ngo.createdAt && (
                      <p className="text-gray-400 text-sm">Joined: {formatDate(ngo.createdAt)}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/ngos/${ngo.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/ngos/${ngo.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ngo.id)}
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

      {filteredNgos.length === 0 && !loading && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <p className="text-gray-300 text-lg">No NGOs found</p>
            <Button 
              onClick={() => navigate('/ngos/new')}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First NGO
            </Button>
          </CardContent>
        </Card>
      )}
      </div>
    </DashboardLayout>
  );
};

export default NGOList; 