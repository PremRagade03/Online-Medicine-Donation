import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DebugPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const clearAuth = () => {
    localStorage.removeItem('medishare_user');
    localStorage.removeItem('token');
    window.location.reload();
  };

  const testRoutes = () => {
    const routes = ['/donor', '/admin', '/hospital', '/ngo'];
    routes.forEach(route => {
      console.log(`Testing route: ${route}`);
      navigate(route);
      setTimeout(() => navigate('/debug'), 1000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Information</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Authentication State</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-300">Loading:</span>
                <span className={`ml-2 ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {loading ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div>
                <span className="text-gray-300">Authenticated:</span>
                <span className={`ml-2 ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div>
                <span className="text-gray-300">User:</span>
                <pre className="mt-2 p-2 bg-slate-700 rounded text-xs text-green-400 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
            
            <div className="space-y-4">
              <Button onClick={clearAuth} variant="destructive" className="w-full">
                Clear Authentication
              </Button>
              
              <Button onClick={testRoutes} variant="outline" className="w-full">
                Test Routes
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => navigate('/donor')} variant="outline" size="sm">
                  Go to Donor
                </Button>
                <Button onClick={() => navigate('/admin')} variant="outline" size="sm">
                  Go to Admin
                </Button>
                <Button onClick={() => navigate('/hospital')} variant="outline" size="sm">
                  Go to Hospital
                </Button>
                <Button onClick={() => navigate('/ngo')} variant="outline" size="sm">
                  Go to NGO
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="mt-8 p-6 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Local Storage</h2>
          
          <div className="space-y-2">
            <div>
              <span className="text-gray-300">medishare_user:</span>
              <pre className="mt-1 p-2 bg-slate-700 rounded text-xs text-green-400 overflow-auto">
                {localStorage.getItem('medishare_user') || 'null'}
              </pre>
            </div>
            
            <div>
              <span className="text-gray-300">token:</span>
              <pre className="mt-1 p-2 bg-slate-700 rounded text-xs text-green-400 overflow-auto">
                {localStorage.getItem('token') || 'null'}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DebugPage; 