
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
// import { userService } from '@/services/userService'; // Comment out real service
import { mockUserService as userService } from '@/services/mockUserService'; // Use mock service

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('medishare_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Found stored user:', userData);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('medishare_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await userService.loginUser(credentials);
      
      console.log('Login response:', response);
      
      if (response && response.user && response.token) {
        const user = response.user;
        console.log('Setting user:', user);
        setUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('medishare_user', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${user.name}`,
        });
        
        return { success: true, user };
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('medishare_user');
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };



  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
