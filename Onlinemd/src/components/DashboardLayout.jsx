
import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
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
  const [searchQuery, setSearchQuery] = useState('');

  //   Mobile detection state
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mobile detection with cleanup
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [sidebarOpen]);

  const navigationItems = [
    { name: 'Dashboard', href: getDashboardRoute(user?.role), icon: Home, roles: ['Admin', 'User', 'Hospital', 'Ngo'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['Admin'] },
    { name: 'NGOs', href: '/ngos', icon: Building2, roles: ['Admin'] },
    { name: 'Hospitals', href: '/hospitals', icon: Building, roles: ['Admin'] },
    { name: 'Medicines', href: '/medicines', icon: Pill, roles: ['Admin'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['Admin'] },
    { name: 'Donations', href: '/donations', icon: Package, roles: [/*'Admin', 'User'*/] },  
    { name: 'Requests', href: '/requests', icon: ClipboardList, roles: ['Admin', 'Hospital', 'Ngo', 'User'] }
  ];

  const filteredNavigation = navigationItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"> 
    
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${isMobile ? 'fixed' : 'static'} lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-slate-800/90 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}> 
       
        <div className="flex items-center justify-between h-12 px-4 bg-slate-700/50" >
          <div className="flex items-center flex-1 min-w-0 space-x-2 sm:space-x-3"> 
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500"> 
              <span className="text-sm font-bold text-white">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-white truncate sm:text-lg" > 
                {isMobile ? 'Med Donation' : 'Online Medicine Donation'} 
              </h1>
              <p className="hidden text-xs text-gray-400 truncate sm:block">Healthcare Platform</p> 
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="flex-shrink-0 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

      
        <div className="flex-1 overflow-y-auto">
          <nav className="px-3 mt-4">
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
                      if (isMobile) setSidebarOpen(false);
                    }}
                  >
                    <Icon className="flex-shrink-0 w-4 h-4 mr-2" />
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="p-3 bg-slate-700/30">
          <div className="flex items-center mb-3 space-x-2">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="justify-start w-full h-8 text-xs text-gray-300 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="flex-shrink-0 w-3 h-3 mr-2" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </div>


      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="sticky top-0 z-30 pt-0 bg-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6"> 
            <div className="flex items-center flex-1 min-w-0 space-x-3 sm:space-x-4">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="flex-shrink-0 text-white hover:bg-white/10"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white truncate sm:text-xl">
                  {filteredNavigation.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
                </h2>
                <p className="hidden text-xs text-gray-400 truncate sm:block">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center flex-shrink-0 space-x-2">
            
              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/search')}
                className="hidden h-8 text-white border-white/20 hover:bg-white/10 sm:inline-flex"
              >
                <Search className="w-3 h-3 mr-1" />
                <span className="hidden md:inline">Search</span>
              </Button> */}

              
              
              {/* <div className="items-center hidden space-x-2 sm:flex">
                  <Input
                    type="text"
                    placeholder="Search by medicine name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-sm text-white border bg-white/5 border-white/20 placeholder:text-gray-400"
                  />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/search?query=${encodeURIComponent(searchQuery)}`)}
                  
                  className="h-8 text-white border-white/20 hover:bg-white/10"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div> */}

              

           
            
             
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
                className="hidden h-8 text-white border-white/20 hover:bg-white/10 sm:inline-flex"
              >
                <Settings className="w-3 h-3 mr-1" />
                <span className="hidden md:inline">Settings</span>
              </Button>
           
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/settings')}
                className="h-8 text-white border-white/20 hover:bg-white/10 sm:hidden"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

      
        <main className="flex-1 px-4 py-4 overflow-y-auto sm:px-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;




// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { useAuth } from '@/contexts/AuthContext';
// import { 
//   Users, 
//   Package, 
//   ClipboardList, 
//   Building2, 
//   Pill, 
//   Building, 
//   Settings, 
//   LogOut,
//   Menu,
//   X,
//   Home,
//   Search,
//   BarChart3
// } from 'lucide-react';

// function getDashboardRoute(role) {
//   const dashboardRouteMap = {
//     'User': '/donor',
//     'Admin': '/admin',
//     'Hospital': '/hospital',
//     'Ngo': '/ngo'
//   };
//   return dashboardRouteMap[role] || '/donor';
// }

// const DashboardLayout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navigationItems = [
//     { name: 'Dashboard', href: getDashboardRoute(user?.role), icon: Home, roles: ['Admin', 'User', 'Hospital', 'Ngo'] },
//     { name: 'Users', href: '/users', icon: Users, roles: ['Admin'] },
//     { name: 'NGOs', href: '/ngos', icon: Building2, roles: ['Admin'] },
//     { name: 'Hospitals', href: '/hospitals', icon: Building, roles: ['Admin'] },
//     { name: 'Medicines', href: '/medicines', icon: Pill, roles: ['Admin'] },
//     { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['Admin'] },
//     { name: 'Donations', href: '/donations', icon: Package, roles: ['Admin', 'User'] },
//     { name: 'Requests', href: '/requests', icon: ClipboardList, roles: ['Admin', 'Hospital', 'Ngo'] }
//   ];

//   const filteredNavigation = navigationItems.filter(item => item.roles.includes(user?.role));

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const isActiveRoute = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

//   return (
//     <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Fixed Sidebar - No gaps, tight layout */}
//       <div className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-800/90 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
//         sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         {/* Sidebar Header - Reduced height */}
//         <div className="flex items-center justify-between h-12 px-4 bg-slate-700/50" >
//           <div className="flex items-center space-x-3">
//             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500">
//               <span className="text-sm font-bold text-white">M</span>
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-white" >Online Medicine Donation</h1>
//               <p className="text-xs text-gray-400">Healthcare Platform</p>
//             </div>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setSidebarOpen(false)}
//             className="text-white lg:hidden hover:bg-white/10"
//           >
//             <X className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Sidebar Navigation - Reduced spacing */}
//         <div className="flex-1 overflow-y-auto">
//           <nav className="px-3 mt-4">
//             <div className="space-y-1">
//               {filteredNavigation.map((item) => {
//                 const Icon = item.icon;
//                 const isActive = isActiveRoute(item.href);
//                 return (
//                   <Button
//                     key={item.name}
//                     variant={isActive ? "default" : "ghost"}
//                     className={`w-full justify-start h-10 px-3 rounded-md transition-all duration-200 ${
//                       isActive 
//                         ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg' 
//                         : 'text-gray-300 hover:text-white hover:bg-white/10'
//                     }`}
//                     onClick={() => {
//                       navigate(item.href);
//                       setSidebarOpen(false);
//                     }}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     <span className="text-sm font-medium">{item.name}</span>
//                   </Button>
//                 );
//               })}
//             </div>
//           </nav>
//         </div>

//         {/* Sidebar Footer - Reduced padding */}
//         <div className="p-3 bg-slate-700/30">
//           <div className="flex items-center mb-3 space-x-2">
//             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500">
//               <span className="text-xs font-bold text-white">
//                 {user?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-medium text-white truncate">{user?.name}</p>
//               <p className="text-xs text-gray-400 capitalize truncate">{user?.role}</p>
//             </div>
//           </div>
//           <Button
//             variant="ghost"
//             className="justify-start w-full h-8 text-xs text-gray-300 hover:text-white hover:bg-white/10"
//             onClick={handleLogout}
//           >
//             <LogOut className="w-3 h-3 mr-2" />
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Main Content Area - No top gap */}
//       <div className="flex flex-col flex-1 min-w-0">
//         {/* Top Navigation Bar - Reduced height */}
//         <div className="sticky top-0 z-30 pt-0 bg-white/10 backdrop-blur-xl">
//           <div className="flex items-center justify-between px-6 py-3">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-white lg:hidden hover:bg-white/10"
//               >
//                 <Menu className="w-5 h-5" />
//               </Button>
//               <div>
//                 <h2 className="text-xl font-bold text-white">
//                   {filteredNavigation.find(item => isActiveRoute(item.href))?.name || 'Dashboard'}
//                 </h2>
//                 <p className="text-xs text-gray-400">
//                   Welcome back, {user?.name}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => navigate('/search')}
//                 className="h-8 text-white border-white/20 hover:bg-white/10"
//               >
//                 <Search className="w-3 h-3 mr-1" />
//                 Search
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => navigate('/settings')}
//                 className="h-8 text-white border-white/20 hover:bg-white/10"
//               >
//                 <Settings className="w-3 h-3 mr-1" />
//                 Settings
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content - No top padding, tight spacing */}
//         <main className="flex-1 px-6 py-4 overflow-y-auto">
//           <div className="mx-auto max-w-7xl">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;