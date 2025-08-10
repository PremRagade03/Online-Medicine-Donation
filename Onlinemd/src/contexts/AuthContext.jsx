import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { userService } from '@/services/userService'; // Changed to named import

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
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
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

  const register = async (userData) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await userService.registerUser(userData);
      
      console.log('Registration response:', response);
      
      if (response && response.user) {
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        
        return { success: true, user: response.user };
      } else {
        console.error('Invalid registration response format:', response);
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout if needed
      await userService.logoutUser();
    } catch (error) {
      console.error('Backend logout error:', error);
      // Continue with local logout even if backend fails
    } finally {
      // Always perform local cleanup
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('medishare_user');
      localStorage.removeItem('token');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      if (!user || !user.id) {
        throw new Error('No user logged in');
      }

      const response = await userService.updateUserProfile(user.id, userData);
      
      if (response && response.user) {
        const updatedUser = response.user;
        setUser(updatedUser);
        localStorage.setItem('medishare_user', JSON.stringify(updatedUser));
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('medishare_user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Storage cleared",
      description: "Please log in again.",
    });
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    clearStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};