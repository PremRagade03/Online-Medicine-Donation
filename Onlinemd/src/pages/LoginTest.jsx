import React, { useState } from 'react';
import { userService } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const LoginTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, isError = false) => {
    setTestResults(prev => [...prev, { message, isError, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testConnection = async () => {
    setLoading(true);
    addResult('Testing API connection...');
    
    try {
      const isConnected = await userService.testConnection();
      if (isConnected) {
        addResult('✅ API connection successful');
      } else {
        addResult('❌ API connection failed', true);
      }
    } catch (error) {
      addResult(`❌ Connection error: ${error.message}`, true);
    }
    
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    addResult('Testing login with test credentials...');
    
    try {
      const result = await userService.loginUser({
        email: 'test@test.com',
        password: 'test123',
        role: 'User'
      });
      addResult(`✅ Login test completed: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      addResult(`❌ Login test failed: ${error.message}`, true);
    }
    
    setLoading(false);
  };

  const testLoginWithRole = async (role) => {
    setLoading(true);
    addResult(`Testing login as ${role}...`);
    
    try {
      const result = await userService.loginUser({
        email: 'test@test.com',
        password: 'test123',
        role: role
      });
      addResult(`✅ Login test as ${role} completed: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      addResult(`❌ Login test as ${role} failed: ${error.message}`, true);
    }
    
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Login Debug Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-slate-800 border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <Button 
                onClick={testConnection} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test API Connection'}
              </Button>
              
              <Button 
                onClick={testLogin} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Testing...' : 'Test Login (User)'}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => testLoginWithRole('User')} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  User
                </Button>
                <Button 
                  onClick={() => testLoginWithRole('Admin')} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  Admin
                </Button>
                <Button 
                  onClick={() => testLoginWithRole('Hospital')} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  Hospital
                </Button>
                <Button 
                  onClick={() => testLoginWithRole('Ngo')} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  NGO
                </Button>
              </div>
              
              <Button 
                onClick={clearResults} 
                variant="destructive"
                className="w-full"
              >
                Clear Results
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-300 mb-2">API Base URL:</h3>
              <code className="text-green-400 text-sm">
                {import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api'}
              </code>
            </div>
          </Card>
          
          <Card className="p-6 bg-slate-800 border-slate-700">
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
    </div>
  );
};

export default LoginTest; 