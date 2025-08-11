

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '@/services/requestService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const NewRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    medicineName: '',
    quantity: '',
    requesterName: '',
    requesterType: 'User', 
    status: 'Pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting:", form);
      await requestService.createRequest(form);
      toast({ title: 'Success', description: 'Request created successfully!' });
      navigate('/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create request. Check form inputs.',
        variant: 'destructive'
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Create New Request</h1>
        <Card>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="medicineName"
                placeholder="Medicine Name"
                value={form.medicineName}
                onChange={handleChange}
                required
              />
              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
              <Input
                name="requesterName"
                placeholder="Requester Name"
                value={form.requesterName}
                onChange={handleChange}
                required
              />

              {/* Requester Type Dropdown */}
              <div className="flex flex-col">
                <label htmlFor="requesterType" className="text-sm font-medium text-white mb-1">
                  Requester Type
                </label>
                <select
                  id="requesterType"
                  name="requesterType"
                  value={form.requesterType}
                  onChange={handleChange}
                  className="bg-white/10 text-white p-2 rounded"
                  required
                >
                 
                  <option value="RequestedByHospitalId">Hospital</option>
                  <option value="RequestedByNgoId">NGO</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NewRequest;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { requestService } from '@/services/requestService';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { useToast } from '@/components/ui/use-toast';
// import DashboardLayout from '@/components/DashboardLayout';

// const NewRequest = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [form, setForm] = useState({
//     medicineName: '',
//     quantity: '',
//     requesterName: '',
//     requesterType: '',
//     requesterId: '',
//     status: 'Pending'
//   });

//   // Auto-fill requester data from localStorage on component mount
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       setForm((prev) => ({
//         ...prev,
//         requesterType: storedUser.role,
//         requesterId: storedUser.id,
//         requesterName: storedUser.name
//       }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         medicineName: form.medicineName,
//         quantity: form.quantity,
//         requesterName: form.requesterName,
//         status: form.status
//       };

//       // Dynamically set requester type
//       if (form.requesterType === 'Hospital') {
//         payload.RequestedByHospitalId = form.requesterId;
//       } else if (form.requesterType === 'NGO') {
//         payload.RequestedByNgoId = form.requesterId;
//       }

//       console.log("Submitting:", payload);
//       await requestService.createRequest(payload);
//       toast({ title: 'Success', description: 'Request created successfully!' });
//       navigate('/requests');
//     } catch (error) {
//       console.error('Error creating request:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to create request. Check form inputs.',
//         variant: 'destructive'
//       });
//     }
//   };

//   return (
//     <DashboardLayout>
//       <div className="p-6 max-w-xl mx-auto space-y-6">
//         <h1 className="text-2xl font-bold text-white">Create New Request</h1>
//         <Card>
//           <CardContent className="p-6 space-y-4">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <Input
//                 name="medicineName"
//                 placeholder="Medicine Name"
//                 value={form.medicineName}
//                 onChange={handleChange}
//                 required
//               />
//               <Input
//                 type="number"
//                 name="quantity"
//                 placeholder="Quantity"
//                 value={form.quantity}
//                 onChange={handleChange}
//                 required
//               />
//               <Input
//                 name="requesterName"
//                 placeholder="Requester Name"
//                 value={form.requesterName}
//                 onChange={handleChange}
//                 readOnly // Optional: prevent changes since it's auto-filled
//               />
//               <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
//                 Submit Request
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default NewRequest;
