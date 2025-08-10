import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

const TestAPIPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [donorId, setDonorId] = useState('1');

  const addTestResult = (endpoint, success, data, error) => {
    setTestResults(prev => [...prev, {
      endpoint,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testEndpoint = async (endpoint, method = 'GET', body = null) => {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      if (response.ok) {
        addTestResult(endpoint, true, data, null);
        toast({
          title: "Success",
          description: `${endpoint} - Status: ${response.status}`,
        });
      } else {
        addTestResult(endpoint, false, null, `Status: ${response.status}, Response: ${responseText}`);
        toast({
          title: "Error",
          description: `${endpoint} - Status: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      addTestResult(endpoint, false, null, error.message);
      toast({
        title: "Error",
        description: `${endpoint} - ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    // Test medicines endpoints
    await testEndpoint('/medicines');
    await testEndpoint('/medicines/stats');
    await testEndpoint(`/medicines/donor/${donorId}`);
    
    // Test donations endpoints
    await testEndpoint('/donations');
    await testEndpoint('/donations/stats');
    await testEndpoint(`/donations/donor/${donorId}`);

    setLoading(false);
  };

  const testCreateMedicine = async () => {
    const medicineData = {
      Name: "Test Medicine",
      Description: "Test medicine for API testing",
      ExpiryDate: "2026-12-31",
      Quantity: 10,
      DonorID: parseInt(donorId),
      Status: "available"
    };

    await testEndpoint('/medicines', 'POST', medicineData);
  };

  const testCreateDonation = async () => {
    const donationData = {
      MedicineId: 1,
      DonatedToNgoId: null,
      QuantityDonated: 5,
      Status: "available"
    };

    await testEndpoint('/donations', 'POST', donationData);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">API Testing Page</h1>
      
      <Card className="p-6 bg-slate-800/50 border-white/10">
        <div className="space-y-4">
          <div>
            <Label htmlFor="donorId" className="text-white">Donor ID for testing:</Label>
            <Input
              id="donorId"
              value={donorId}
              onChange={(e) => setDonorId(e.target.value)}
              className="mt-2 bg-white/5 border-white/20 text-white"
              placeholder="Enter donor ID"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={runAllTests} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button onClick={testCreateMedicine} className="bg-blue-600 hover:bg-blue-700">
              Test Create Medicine
            </Button>
            <Button onClick={testCreateDonation} className="bg-purple-600 hover:bg-purple-700">
              Test Create Donation
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-slate-800/50 border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Test Results</h2>
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                result.success 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border-red-500/30 text-red-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{result.endpoint}</span>
                <span className="text-sm">{result.timestamp}</span>
              </div>
              <div className="mt-2">
                {result.success ? (
                  <div>
                    <span className="text-green-300">✓ Success</span>
                    {result.data && (
                      <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-red-300">✗ Failed</span>
                    <p className="mt-1 text-sm">{result.error}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {testResults.length === 0 && (
            <p className="text-gray-400 text-center py-8">No tests run yet. Click "Run All Tests" to start.</p>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-slate-800/50 border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">API Endpoints to Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Medicines</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• GET /medicines - Get all medicines</li>
              <li>• GET /medicines/stats - Get medicine statistics</li>
              <li>• GET /medicines/donor/{donorId} - Get medicines by donor</li>
              <li>• POST /medicines - Create new medicine</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Donations</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• GET /donations - Get all donations</li>
              <li>• GET /donations/stats - Get donation statistics</li>
              <li>• GET /donations/donor/{donorId} - Get donations by donor</li>
              <li>• POST /donations - Create new donation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestAPIPage;
