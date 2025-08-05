import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Eye, EyeOff, User, Building2, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('User');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'User', label: 'Donor/User', icon: User, color: 'green' },
    { value: 'Hospital', label: 'Hospital', icon: Building2, color: 'blue' },
    { value: 'Ngo', label: 'NGO', icon: Users, color: 'purple' },
    { value: 'Admin', label: 'Admin', icon: Shield, color: 'orange' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Add role to credentials for backend processing
    const loginData = {
      ...credentials,
      role: selectedRole
    };

    const result = await login(loginData);
    if (result.success) {
      // Map backend roles to frontend routes
      const roleRouteMap = {
        'User': '/donor',
        'Admin': '/admin',
        'Hospital': '/hospital',
        'Ngo': '/ngo'
      };
      
      const route = roleRouteMap[result.user.role] || '/donor';
      console.log('Navigating to:', route, 'for role:', result.user.role);
      navigate(route);
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Login - MediShare Platform</title>
        <meta name="description" content="Access your MediShare account to donate medicines, request supplies, or manage the platform." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl floating-animation"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 items-center relative z-10">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 text-4xl font-bold"
              >
                <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl pulse-glow">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <span className="gradient-text">Online Medicine Donation</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl lg:text-5xl font-bold text-white leading-tight"
              >
                Connecting Hearts,
                <br />
                <span className="gradient-text">Saving Lives</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 max-w-lg"
              >
                Join our mission to reduce medical waste and ensure life-saving medicines reach those who need them most.
              </motion.p>
            </div>

            {/* Registration Buttons */}
            <motion.div className="pt-1 space-y-2">
              <h3 className="text-lg font-semibold text-white">Register As:</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => navigate('/register/donor')} 
                  className="text-black bg-green-400 hover:bg-green-500 hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Donor
                </Button>
                <Button 
                  onClick={() => navigate('/register/hospital')} 
                  className="text-black bg-blue-400 hover:bg-blue-500 hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Hospital
                </Button>
                <Button 
                  onClick={() => navigate('/register/ngo')} 
                  className="text-black bg-purple-400 hover:bg-purple-500 hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  NGO
                </Button>
                <Button 
                  onClick={() => navigate('/admin-signup')} 
                  className="text-black bg-orange-400 hover:bg-orange-500 hover:scale-105 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Admin
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <Card className="glass-effect p-8 border-green-500/20">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                  <p className="text-gray-400">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label className="text-white">Sign in as:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {roleOptions.map((role) => {
                        const IconComponent = role.icon;
                        const isSelected = selectedRole === role.value;
                        const getButtonClasses = () => {
                          if (isSelected) {
                            switch (role.color) {
                              case 'green': return 'border-green-400 bg-green-500/20 text-green-300';
                              case 'blue': return 'border-blue-400 bg-blue-500/20 text-blue-300';
                              case 'purple': return 'border-purple-400 bg-purple-500/20 text-purple-300';
                              case 'orange': return 'border-orange-400 bg-orange-500/20 text-orange-300';
                              default: return 'border-green-400 bg-green-500/20 text-green-300';
                            }
                          }
                          return 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10';
                        };
                        
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => setSelectedRole(role.value)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${getButtonClasses()}`}
                          >
                            <IconComponent className="w-4 h-4" />
                            <span className="text-sm font-medium">{role.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
