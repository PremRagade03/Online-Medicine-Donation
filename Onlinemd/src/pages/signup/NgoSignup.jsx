import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { userService } from '@/services/userService';

const NgoSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    ngoName: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { ngoName, contactPerson, phone, email, password, confirmPassword } = formData;

    if (!ngoName || !contactPerson || !phone || !email || !password || !confirmPassword) {
      toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
      return false;
    }

    if (password !== confirmPassword) {
      toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Validation Error", description: "Invalid email format", variant: "destructive" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;

    const payload = {
      OrganizationName: formData.ngoName,
      ContactPerson: formData.contactPerson,
      Email: formData.email,
      Password: formData.password,
      Phone: formData.phone,
      Address: fullAddress,
      Role: 'ngo'
    };

    try {
      setLoading(true);
      await userService.register(payload);
      toast({ title: "Success", description: "NGO account created successfully!" });
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast({
        title: "Signup Failed",
        description: error.response?.data?.message || "Could not register NGO.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">NGO Registration</CardTitle>
          <CardDescription>Register your NGO to help distribute donated medicine</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="ngoName">NGO Name *</Label>
              <Input id="ngoName" name="ngoName" value={formData.ngoName} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Account...' : 'Register NGO'}
            </Button>

            <p className="text-sm text-center text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-500 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoSignup;
