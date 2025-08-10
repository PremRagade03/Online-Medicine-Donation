import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Database, 
  Key, 
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Camera,
  Trash2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    darkMode: true,
    language: 'en',
    timezone: 'UTC'
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'system', name: 'System', icon: Database }
  ];

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile updated:', profileData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Handle password change
    console.log('Password changed');
  };

  const handlePreferencesChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600"
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.name}</h3>
                <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
                <Badge className="mt-1 bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-white">City</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-white">State</Label>
                <Input
                  id="state"
                  value={profileData.state}
                  onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white pr-10"
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
            <div>
              <Label htmlFor="newPassword" className="text-white">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white pr-10"
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
            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-white/5 border-white/20 text-white pr-10"
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Two-Factor Authentication</h4>
              <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Enable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Email Notifications</h4>
                <p className="text-gray-400 text-sm">Receive notifications via email</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferencesChange('emailNotifications', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-white/5 border-white/20 rounded focus:ring-green-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">SMS Notifications</h4>
                <p className="text-gray-400 text-sm">Receive notifications via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => handlePreferencesChange('smsNotifications', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-white/5 border-white/20 rounded focus:ring-green-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Push Notifications</h4>
                <p className="text-gray-400 text-sm">Receive push notifications in browser</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => handlePreferencesChange('pushNotifications', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-white/5 border-white/20 rounded focus:ring-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Appearance Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Dark Mode</h4>
                <p className="text-gray-400 text-sm">Use dark theme</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) => handlePreferencesChange('darkMode', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-white/5 border-white/20 rounded focus:ring-green-500"
              />
            </div>
            <div>
              <Label htmlFor="language" className="text-white">Language</Label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => handlePreferencesChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <Label htmlFor="timezone" className="text-white">Timezone</Label>
              <select
                id="timezone"
                value={preferences.timezone}
                onChange={(e) => handlePreferencesChange('timezone', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="CST">Central Time</option>
                <option value="MST">Mountain Time</option>
                <option value="PST">Pacific Time</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400 text-sm">Platform Version</Label>
                <p className="text-white">v1.0.0</p>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Last Updated</Label>
                <p className="text-white">2024-01-15</p>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Database Status</Label>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">API Status</Label>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trash2 className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">Delete Account</h4>
              <p className="text-gray-400 text-sm">Permanently delete your account and all associated data</p>
              <Button variant="outline" className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'system':
        return renderSystemTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account preferences and security settings</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default Settings; 