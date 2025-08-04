import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/userService';

const TestConnection = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test basic connection
      const response = await fetch('https://localhost:44344/api/users');
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Connection successful! Found ${data.length || 0} users.`);
      } else {
        const errorText = await response.text();
        setTestResult(`❌ Connection failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setTestResult(`❌ Connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setTestResult('Testing registration...');
    
    try {
      const testData = {
        Name: 'Test User',
        Email: 'test@example.com',
        Password: 'testpass123',
        Role: 'donor'
      };
      
      const response = await userService.register(testData);
      setTestResult(`✅ Registration test successful! Response: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error('Registration test error:', error);
      setTestResult(`❌ Registration test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Backend Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBackendConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </Button>
        
        <Button 
          onClick={testRegistration} 
          disabled={loading}
          variant="outline"
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </Button>
        
        {testResult && (
          <div className="p-4 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestConnection; 