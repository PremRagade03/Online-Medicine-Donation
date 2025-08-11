
// userService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const userService = {
  // Test connection to backend
  async testConnection() {
    try {
      console.log('Testing connection to:', `${API_BASE_URL}/auth/login`);
      
      // Try a simple OPTIONS request to test if server is reachable
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to avoid hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      // Even if OPTIONS returns an error, if we get a response, server is reachable
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      
      // If it's a timeout or network error, server is not reachable
      if (error.name === 'AbortError' || error.name === 'TypeError') {
        return false;
      }
      
      // If it's any other error, server might still be reachable
      return true;
    }
  },

  // Alternative connection test - just try to reach the base URL
  async testConnectionSimple() {
    try {
      const baseUrl = API_BASE_URL.replace('/api', '');
      const response = await fetch(baseUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });
      
      return true; // If we get any response, server is reachable
    } catch (error) {
      console.error('Simple connection test failed:', error);
      return false;
    }
  },

  // Legacy method name for backward compatibility
  async register(userData) {
    return this.registerUser(userData);
  },

  // Login user - matches your AuthController login endpoint
  async loginUser(credentials) {
    try {
      console.log('Making login request to:', `${API_BASE_URL}/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Email: credentials.email, // Your backend expects Email (capital E)
          Password: credentials.password // Your backend expects Password (capital P)
        }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Login response data:', data);
      return data;
    } catch (error) {
      console.error('Error logging in user:', error);
      
      // More specific error messages
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running on https://localhost:44344');
      } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
        throw new Error('Connection refused. Please ensure the backend server is running on port 44344.');
      }
      
      throw error;
    }
  },

  // Register user - matches your AuthController register endpoint
  async registerUser(userData) {
    try {
      console.log('Making register request to:', `${API_BASE_URL}/auth/register`);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Name: userData.name,
          Email: userData.email,
          Password: userData.password,
          Phone: userData.phone,
          Address: userData.address,
          Role: userData.role || 'user', // Default to 'user' role
          // NGO specific fields if role is 'ngo'
          OrganizationName: userData.organizationName,
          ContactPerson: userData.contactPerson
        }),
      });
      
      console.log('Register response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration error response:', errorText);
        throw new Error(errorText || `HTTP ${response.status}: Registration failed`);
      }
      
      const data = await response.text(); // Your register endpoint returns just a string message
      return { message: data };
    } catch (error) {
      console.error('Error registering user:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  },

  // Get user profile - uses Users controller
  async getUserProfile(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch user profile');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile - uses Users controller
  async updateUserProfile(userId, userData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          UserId: parseInt(userId),
          Name: userData.name,
          Email: userData.email,
          Phone: userData.phone,
          Address: userData.address,
          // Don't include password in updates unless specifically changing it
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update profile');
      }
      
      // PUT endpoint returns NoContent (204), so no JSON to parse
      return { message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Get all users - uses Users controller (admin only)
  async getAllUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch users');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Change password - uses your AuthController change-password endpoint
  async changePassword(currentPassword, newPassword) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          CurrentPassword: currentPassword,
          NewPassword: newPassword
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Delete user account - uses your AuthController delete endpoint
  async deleteUserAccount(userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    }
  },

  // Logout user (client-side only since your backend doesn't have logout endpoint)
  async logoutUser() {
    try {
      // No backend logout endpoint, so just return success
      return true;
    } catch (error) {
      console.error('Error logging out user:', error);
      // Don't throw error for logout - continue with local cleanup
      return true;
    }
  },

  // Verify email (placeholder - implement if you add email verification)
  async verifyEmail(token) {
    try {
      // Placeholder implementation
      throw new Error('Email verification not implemented in backend yet');
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  },

  // Reset password request (placeholder - implement if you add password reset)
  async requestPasswordReset(email) {
    try {
      // Placeholder implementation
      throw new Error('Password reset not implemented in backend yet');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  },

  // Reset password (placeholder - implement if you add password reset)
  async resetPassword(token, newPassword) {
    try {
      // Placeholder implementation
      throw new Error('Password reset not implemented in backend yet');
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
};