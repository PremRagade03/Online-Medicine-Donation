// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
// import { userService } from '@/services/userService';

// const AdminSignup = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.name || !formData.email || !formData.password) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       toast({
//         title: "Validation Error",
//         description: "Passwords do not match",
//         variant: "destructive",
//       });
//       return false;
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
// if (!emailRegex.test(formData.email)) {
//   toast({
//     title: "Validation Error",
//     description: "Email must be a valid @gmail.com address",
//     variant: "destructive",
//   });
//   return false;
// }
//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
//   if (!passwordRegex.test(formData.password)) {
//     toast({
//       title: "Validation Error",
//       description: "Password must contain at least one uppercase letter and one special character",
//       variant: "destructive",
//     });
//     return false;
//   }


//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       setLoading(true);
//       const signupData = {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         role: 'admin'
//       };
//       await userService.register(signupData);
//       toast({
//         title: "Success",
//         description: "Admin account created successfully! Please login."
//       });
//       navigate('/login');
//     } catch (error) {
//       console.error('Signup error:', error);
//       toast({
//         title: "Error",
//         description: error.message || "Signup failed.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center">
//           <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
//           <CardDescription>Register a new admin account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <Label htmlFor="name">Full Name *</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="email">Email Address *</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="password">Password *</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="confirmPassword">Confirm Password *</Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full" disabled={loading}>
//               {loading ? 'Registering...' : 'Register'}
//             </Button>
//             <p className="text-sm text-center text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="font-medium text-green-500 hover:text-green-600">
//                 Log in
//               </Link>
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminSignup;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react'; // 👈 icons
import { userService } from '@/services/userService';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 👀 Toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Email must be a valid @gmail.com address",
        variant: "destructive",
      });
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
    if (!passwordRegex.test(formData.password)) {
      toast({
        title: "Validation Error",
        description: "Password must contain at least one uppercase letter and one special character",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin'
      };
      await userService.register(signupData);
      toast({
        title: "Success",
        description: "Admin account created successfully! Please login."
      });
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Signup failed.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
          <CardDescription>Register a new admin account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-500 right-2 top-8 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute text-gray-500 right-2 top-8 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-500 hover:text-green-600">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;