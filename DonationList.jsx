import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { donationService } from '@/services/donationService';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationService.getAllDonations();
      setDonations(response.data || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      await donationService.updateDonationStatus(donationId, newStatus);
      toast({
        title: "Success",
        description: "Donation status updated successfully",
      });
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation status:', error);
      toast({
        title: "Error",
        description: "Failed to update donation status",
        variant: "destructive",
      });
    }
  };

  const filteredDonations = donations.filter(donation =>
    donation.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'secondary', text: 'Pending' },
      'approved': { variant: 'default', text: 'Approved' },
      'rejected': { variant: 'destructive', text: 'Rejected' },
      'delivered': { variant: 'default', text: 'Delivered' },
      'expired': { variant: 'destructive', text: 'Expired' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const DonationCard = ({ donation }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{donation.medicineName}</CardTitle>
            <CardDescription>Donated by {donation.donorName}</CardDescription>
          </div>
          {getStatusBadge(donation.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">Quantity</Label>
            <p className="text-sm">{donation.quantity} units</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Expiry Date</Label>
            <p className="text-sm">{new Date(donation.expiryDate).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Donation Date</Label>
            <p className="text-sm">{new Date(donation.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Category</Label>
            <p className="text-sm">{donation.category}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedDonation(donation);
              setIsDialogOpen(true);
            }}
          >
            View Details
          </Button>
          {donation.status === 'pending' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusUpdate(donation.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusUpdate(donation.id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const DonationDetails = ({ donation }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Medicine Name</Label>
          <p className="text-sm">{donation.medicineName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Donor</Label>
          <p className="text-sm">{donation.donorName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Quantity</Label>
          <p className="text-sm">{donation.quantity} units</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Status</Label>
          <div className="mt-1">{getStatusBadge(donation.status)}</div>
        </div>
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <p className="text-sm">{donation.category}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Manufacturer</Label>
          <p className="text-sm">{donation.manufacturer}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Expiry Date</Label>
          <p className="text-sm">{new Date(donation.expiryDate).toLocaleDateString()}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Donation Date</Label>
          <p className="text-sm">{new Date(donation.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium">Description</Label>
        <p className="text-sm text-gray-600 mt-1">{donation.description || 'No description provided'}</p>
      </div>
      
      {donation.notes && (
        <div>
          <Label className="text-sm font-medium">Notes</Label>
          <p className="text-sm text-gray-600 mt-1">{donation.notes}</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Donation Management</h1>
        <p className="text-gray-300">Manage and track all medicine donations</p>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search donations by medicine name, donor, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Button onClick={fetchDonations} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({donations.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({donations.filter(d => d.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({donations.filter(d => d.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({donations.filter(d => d.status === 'delivered').length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({donations.filter(d => d.status === 'expired').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.filter(d => d.status === 'pending').map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.filter(d => d.status === 'approved').map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.filter(d => d.status === 'delivered').map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expired" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDonations.filter(d => d.status === 'expired').map((donation) => (
              <DonationCard key={donation.id} donation={donation} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredDonations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No donations found</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected donation
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && <DonationDetails donation={selectedDonation} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationList; 