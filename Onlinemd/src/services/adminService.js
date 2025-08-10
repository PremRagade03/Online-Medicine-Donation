// adminService.js - Updated to match your AdminAuthController
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const adminService = {
  // Admin Signup - matches your AdminAuthController
  async adminSignup(adminData) {
    try {
      console.log('Making admin signup request to:', `${API_BASE_URL}/admin/signup`);
      
      const response = await fetch(`${API_BASE_URL}/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Name: adminData.name,
          Email: adminData.email,
          Password: adminData.password,
          Role: 'admin' // This gets set automatically in your backend
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Admin signup failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in admin signup:', error);
      throw error;
    }
  },

  // Admin Login - matches your AdminAuthController
  async adminLogin(credentials) {
    try {
      console.log('Making admin login request to:', `${API_BASE_URL}/admin/login`);
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Email: credentials.email,
          Password: credentials.password
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Admin login failed');
      }
      
      const data = await response.json();
      console.log('Admin login response:', data);
      return data;
    } catch (error) {
      console.error('Error in admin login:', error);
      throw error;
    }
  },

  // Note: The following methods are placeholders since they're not implemented in your backend yet
  // You can implement them in your AdminAuthController if needed

  // Forgot Password - Not implemented in your backend yet
  async forgotPassword(email) {
    try {
      throw new Error('Forgot password functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error in forgot password:', error);
      throw error;
    }
  },

  // Verify OTP - Not implemented in your backend yet
  async verifyOTP(email, otp) {
    try {
      throw new Error('OTP verification functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error in OTP verification:', error);
      throw error;
    }
  },

  // Reset Password - Not implemented in your backend yet
  async resetPassword(email, otp, newPassword) {
    try {
      throw new Error('Password reset functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error in password reset:', error);
      throw error;
    }
  },

  // Get all admins - Not implemented in your backend yet
  async getAllAdmins() {
    try {
      throw new Error('Get all admins functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  },

  // Get admin by ID - Not implemented in your backend yet
  async getAdminById(adminId) {
    try {
      throw new Error('Get admin by ID functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error fetching admin:', error);
      throw error;
    }
  },

  // Update admin - Not implemented in your backend yet
  async updateAdmin(adminId, adminData) {
    try {
      throw new Error('Update admin functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  },

  // Delete admin - Not implemented in your backend yet
  async deleteAdmin(adminId) {
    try {
      throw new Error('Delete admin functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  // Change password - Not implemented in your backend yet
  async changePassword(currentPassword, newPassword) {
    try {
      throw new Error('Change password functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Get admin profile - Not implemented in your backend yet
  async getAdminProfile() {
    try {
      throw new Error('Get admin profile functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update admin profile - Not implemented in your backend yet
  async updateAdminProfile(profileData) {
    try {
      throw new Error('Update admin profile functionality not implemented in backend yet');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};