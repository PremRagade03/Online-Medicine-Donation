import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Palette, 
  Globe, 
  Clock, 
  Monitor, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Appearance State
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  
  // System State
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [apiStatus, setApiStatus] = useState('online');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'EST', label: 'EST (Eastern Standard Time)' },
    { value: 'PST', label: 'PST (Pacific Standard Time)' },
    { value: 'IST', label: 'IST (Indian Standard Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' }
  ];

  useEffect(() => {
    // Update last updated time every minute
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would call your API to change password
      // await userService.changePassword(currentPassword, newPassword);
      
      toast({
        title: "Success",
        description: "Password changed successfully",
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive"
      }); 
    }
    
  };
  

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // Apply theme to document
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    toast({
      title: "Language Updated",
      description: `Switched to ${languages.find(l => l.code === newLanguage)?.name}`,
    });
  };

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    localStorage.setItem('timezone', newTimezone);
    toast({
      title: "Timezone Updated",
      description: `Timezone set to ${newTimezone}`,
    });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Here you would call your API to delete account
      // await userService.deleteAccount();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });
      
      logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatLastUpdated = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-white/10"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Manage your account preferences and security</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                apiStatus === 'online' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full inline-block mr-2 ${
                  apiStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
                }`}></span>
                {apiStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs defaultValue="security" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
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
                </div>

                <Button onClick={handlePasswordChange} className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Theme Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Dark Mode</Label>
                    <p className="text-sm text-gray-400">Switch between light and dark themes</p>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => handleThemeChange(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language" className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Language & Region</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Language</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Timezone</Label>
                  <Select value={timezone} onValueChange={handleTimezoneChange}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Last Updated</Label>
                    <p className="text-gray-400">{formatLastUpdated(lastUpdated)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">API Status</Label>
                    <p className={`${apiStatus === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                      {apiStatus === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Current Language</Label>
                    <p className="text-gray-400">{languages.find(l => l.code === language)?.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Current Timezone</Label>
                    <p className="text-gray-400">{timezone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Account Management</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className="text-red-400 font-semibold">Danger Zone</h4>
                      <p className="text-red-300 text-sm mt-1">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                    </div>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <Button 
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-yellow-400 text-sm">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <Button 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                      </Button>
                      <Button 
                        onClick={() => setShowDeleteConfirm(false)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage; 