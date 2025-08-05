import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'newPassword'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    Email: '',
    OTP: '',
    NewPassword: '',
    ConfirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!emailRegex.test(formData.Email)) {
      newErrors.Email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors = {};
    
    if (!formData.OTP.trim()) {
      newErrors.OTP = 'OTP is required';
    } else if (formData.OTP.length !== 6) {
      newErrors.OTP = 'OTP must be 6 digits';
    } else if (!/^\d{6}$/.test(formData.OTP)) {
      newErrors.OTP = 'OTP must contain only numbers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNewPassword = () => {
    const newErrors = {};

    if (!formData.NewPassword) {
      newErrors.NewPassword = 'Password is required';
    } else if (formData.NewPassword.length < 8) {
      newErrors.NewPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.NewPassword)) {
      newErrors.NewPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.ConfirmPassword) {
      newErrors.ConfirmPassword = 'Please confirm your password';
    } else if (formData.NewPassword !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual MySQL API call
      // const response = await fetch('/api/admin/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ Email: formData.Email }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send OTP');
      // }

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "OTP Sent!",
        description: `A 6-digit OTP has been sent to ${formData.Email}`,
      });

      setStep('otp');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual MySQL API call
      // const response = await fetch('/api/admin/verify-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     Email: formData.Email,
      //     OTP: formData.OTP 
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Invalid OTP');
      // }

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "OTP Verified!",
        description: "Please enter your new password",
      });

      setStep('newPassword');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid OTP",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateNewPassword()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual MySQL API call
      // const response = await fetch('/api/admin/reset-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     Email: formData.Email,
      //     OTP: formData.OTP,
      //     NewPassword: formData.NewPassword 
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to reset password');
      // }

      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success!",
        description: "Your password has been reset successfully. You can now login with your new password.",
      });

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email': return 'Forgot Password';
      case 'otp': return 'Enter OTP';
      case 'newPassword': return 'Reset Password';
      default: return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email': return 'Enter your email to receive a reset code';
      case 'otp': return 'Enter the 6-digit code sent to your email';
      case 'newPassword': return 'Create a new password for your account';
      default: return 'Enter your email to receive a reset code';
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4" />
            Email Address
          </div>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.Email}
          onChange={(e) => handleInputChange('Email', e.target.value)}
          className={`bg-white/5 border-white/10 text-white placeholder-gray-400 ${
            errors.Email ? 'border-red-500' : ''
          }`}
          placeholder="Enter your email address"
        />
        {errors.Email && (
          <p className="text-red-400 text-sm mt-1">{errors.Email}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Sending OTP...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send Reset Code
          </div>
        )}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-4">
      <div>
        <Label htmlFor="otp" className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" />
            6-Digit OTP
          </div>
        </Label>
        <Input
          id="otp"
          type="text"
          value={formData.OTP}
          onChange={(e) => handleInputChange('OTP', e.target.value)}
          className={`bg-white/5 border-white/10 text-white placeholder-gray-400 ${
            errors.OTP ? 'border-red-500' : ''
          }`}
          placeholder="Enter 6-digit code"
          maxLength={6}
        />
        {errors.OTP && (
          <p className="text-red-400 text-sm mt-1">{errors.OTP}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Code sent to {formData.Email}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('email')}
          className="flex-1 border-white/20 text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Verifying...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Verify OTP
            </div>
          )}
        </Button>
      </div>
    </form>
  );

  const renderNewPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div>
        <Label htmlFor="newPassword" className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            New Password
          </div>
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.NewPassword}
            onChange={(e) => handleInputChange('NewPassword', e.target.value)}
            className={`bg-white/5 border-white/10 text-white placeholder-gray-400 pr-10 ${
              errors.NewPassword ? 'border-red-500' : ''
            }`}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.NewPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.NewPassword}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="text-white">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4" />
            Confirm New Password
          </div>
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.ConfirmPassword}
            onChange={(e) => handleInputChange('ConfirmPassword', e.target.value)}
            className={`bg-white/5 border-white/10 text-white placeholder-gray-400 pr-10 ${
              errors.ConfirmPassword ? 'border-red-500' : ''
            }`}
            placeholder="Confirm new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.ConfirmPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.ConfirmPassword}</p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('otp')}
          className="flex-1 border-white/20 text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Resetting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Reset Password
            </div>
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <Helmet>
        <title>Forgot Password - MediShare</title>
        <meta name="description" content="Reset your admin password for MediShare platform." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back to Login Link */}
          <div className="mb-6">
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{getStepTitle()}</h1>
            <p className="text-gray-400">{getStepDescription()}</p>
          </div>

          {/* Form Card */}
          <Card className="glass-effect border-orange-500/20">
            <div className="p-6">
              {step === 'email' && renderEmailStep()}
              {step === 'otp' && renderOTPStep()}
              {step === 'newPassword' && renderNewPasswordStep()}
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword; 