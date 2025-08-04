import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { userService } from '@/services/userService';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await userService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <Alert className="mb-4">
        <Wifi className="h-4 w-4" />
        <AlertTitle>Checking connection...</AlertTitle>
        <AlertDescription>
          Verifying connection to the backend server.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isConnected) {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <WifiOff className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Connection Error</AlertTitle>
        <AlertDescription className="text-red-700">
          Unable to connect to the backend server. Please ensure:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>The backend server is running on https://localhost:44344</li>
            <li>Your internet connection is working</li>
            <li>The API endpoint is correct</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Connected</AlertTitle>
      <AlertDescription className="text-green-700">
        Successfully connected to the backend server.
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatus; 