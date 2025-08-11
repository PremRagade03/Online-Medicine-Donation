import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const RoleTest = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState([]);

  const addResult = (message, isError = false) => {
    setTestResults(prev => [...prev, { message, isError, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testRoleRouting = () => {
    setTestResults([]);
    
    addResult('Testing role-based routing...');
    addResult(`Current user: ${JSON.stringify(user, null, 2)}`);
    addResult(`Is authenticated: ${isAuthenticated}`);
    
    if (!user) {
      addResult('❌ No user data available', true);
      return;
    }
    
    const roleRouteMap = {
      'User': '/donor',
      'Admin': '/admin',
      'Hospital': '/hospital',
      'Ngo': '/ngo'
    };
    
    const expectedRoute = roleRouteMap[user.role];
    addResult(`Expected route for role '${user.role}': ${expectedRoute}`);
    
    if (expectedRoute) {
      addResult(`✅ Role routing configured correctly`);
      navigate(expectedRoute);
    } else {
      addResult(`❌ No route configured for role '${user.role}'`, true);
    }
  };

  const testAllRoles = () => {
    setTestResults([]);
    const roles = ['User', 'Admin', 'Hospital', 'Ngo'];
    
    roles.forEach(role => {
      addResult(`Testing role: ${role}`);
      // Simulate what would happen with this role
      const roleRouteMap = {
        'User': '/donor',
        'Admin': '/admin',
        'Hospital': '/hospital',
        'Ngo': '/ngo'
      };
      const route = roleRouteMap[role];
      addResult(`  → Would navigate to: ${route}`);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Role Routing Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Current State</h2>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-300">User Role:</span>
                <span className="ml-2 text-green-400 font-bold">{user?.role || 'None'}</span>
              </div>
              
              <div>
                <span className="text-gray-300">User Name:</span>
                <span className="ml-2 text-green-400">{user?.name || 'None'}</span>
              </div>
              
              <div>
                <span className="text-gray-300">User Email:</span>
                <span className="ml-2 text-green-400">{user?.email || 'None'}</span>
              </div>
              
              <div>
                <span className="text-gray-300">Authenticated:</span>
                <span className={`ml-2 ${isAuthenticated ? 'text-green-400' : 'text-red-400'}`}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
            
            <div className="space-y-4">
              <Button onClick={testRoleRouting} className="w-full">
                Test Current Role Routing
              </Button>
              
              <Button onClick={testAllRoles} variant="outline" className="w-full">
                Test All Role Configurations
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
          <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-400 text-sm">No test results yet. Run a test to see results here.</p>
            ) : (
              testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg text-sm ${
                    result.isError 
                      ? 'bg-red-900/20 border border-red-700 text-red-300' 
                      : 'bg-green-900/20 border border-green-700 text-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono">{result.message}</span>
                    <span className="text-xs text-gray-500 ml-2">{result.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoleTest; 