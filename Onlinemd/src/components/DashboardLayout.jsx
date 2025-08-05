import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Package, 
  ClipboardList, 
  Building2, 
  Pill, 
  Building, 
  Settings, 
  LogOut,
  Menu,
  X,
  Home,
  Search,
  BarChart3
} from 'lucide-react';

function getDashboardRoute(role) {
  const dashboardRouteMap = {
    'User': '/donor',
    'Admin': '/admin',
    'Hospital': '/hospital',
    'Ngo': '/ngo'
  };
  return dashboardRouteMap[role] || '/donor';
}

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', href: getDashboardRoute(user?.role), icon: Home, roles: ['Admin', 'User', 'Hospital', 'Ngo'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['Admin'] },
    { name: 'NGOs', href: '/ngos', icon: Building2, roles: ['Admin'] },
    { name: 'Hospitals', href: '/hospitals', icon: Building, roles: ['Admin'] },
    { name: 'Medicines', href: '/medicines', icon: Pill, roles: ['Admin'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['Admin'] },
    { name: 'Donations', href: '/donations', icon: Package, roles: ['Admin', 'User'] },
    { name: 'Requests', href: '/requests', icon: ClipboardList, roles: ['Admin', 'Hospital', 'Ngo'] }
  ];

  const filteredNavigation = navigationItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar - No gaps, tight layout */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-800/90 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header - Reduced height */}
        <div className="flex items-center justify-between h-12 px-4 bg-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Online Medicine Donation</h1>
              <p className="text-xs text-gray-400">Healthcare Platform</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation - Reduced spacing */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-4 px-3">
            <div className="space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-10 px-3 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => {
                      navigate(item.href);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Sidebar Footer - Reduced padding */}
        <div className="p-3 bg-slate-700/30">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 h-8 text-xs"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-3 w-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content Area - No top gap */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar - Reduced height */}
        <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl pt-0">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {filteredNavigation.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
                </h2>
                <p className="text-xs text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/search')}
                className="border-white/20 text-white hover:bg-white/10 h-8"
              >
                <Search className="h-3 w-3 mr-1" />
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
                className="border-white/20 text-white hover:bg-white/10 h-8"
              >
                <Settings className="h-3 w-3 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - No top padding, tight spacing */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
