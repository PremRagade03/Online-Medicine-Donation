// // Updated Donation Service - Matches your ASP.NET Core Backend
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

// export const donationService = {
//   // Get all donations (Admin view)
//   async getAllDonations() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch donations');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching donations:', error);
//       throw error;
//     }
//   },

//   // Get donation by ID
//   async getDonationById(donationId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/${donationId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch donation');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching donation:', error);
//       throw error;
//     }
//   },

//   // Create new donation (Donor creates donation - immediately creates medicine)
//   async createDonation(donationData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           DonorId: donationData.DonorId,
//           MedicineName: donationData.MedicineName,
//           Description: donationData.Description || '',
//           ExpiryDate: donationData.ExpiryDate,
//           Quantity: donationData.Quantity,
//           DonorNotes: donationData.DonorNotes || ''
//         }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create donation');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating donation:', error);
//       throw error;
//     }
//   },

//   // Get donations by donor (Donor view)
//   async getDonationsByDonor(donorId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/donor/${donorId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch donations by donor');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching donations by donor:', error);
//       throw error;
//     }
//   },

//   // Update donation status (Admin action)
//   async updateDonationStatus(donationId, status, adminNotes = '') {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/${donationId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           Status: status,
//           AdminNotes: adminNotes 
//         }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update donation status');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating donation status:', error);
//       throw error;
//     }
//   },

//   // Delete donation (Admin action)
//   async deleteDonation(donationId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to delete donation');
//       }
      
//       return { success: true, message: 'Donation deleted successfully' };
//     } catch (error) {
//       console.error('Error deleting donation:', error);
//       throw error;
//     }
//   },

//   // Search donations (if you implement search endpoint later)
//   async searchDonations(searchTerm) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/search?q=${encodeURIComponent(searchTerm)}`);
//       if (!response.ok) {
//         throw new Error('Failed to search donations');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error searching donations:', error);
//       // Fallback to getting all and filtering client-side
//       const allDonations = await this.getAllDonations();
//       return allDonations.filter(donation => 
//         donation.MedicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         donation.DonorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         donation.Status?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//   },

//   // Get donation statistics (if you implement stats endpoint later)
//   async getDonationStats() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/donations/stats`);
//       if (!response.ok) {
//         // Fallback to calculating stats from all donations
//         const allDonations = await this.getAllDonations();
//         return this.calculateStatsFromDonations(allDonations);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching donation statistics:', error);
//       // Fallback to calculating stats from all donations
//       const allDonations = await this.getAllDonations();
//       return this.calculateStatsFromDonations(allDonations);
//     }
//   },

//   // Helper function to calculate stats from donations array
//   calculateStatsFromDonations(donations) {
//     const stats = {
//       total: donations.length,
//       completed: donations.filter(d => d.Status?.toLowerCase() === 'completed').length,
//       pending: donations.filter(d => d.Status?.toLowerCase() === 'pending').length,
//       delivered: donations.filter(d => d.Status?.toLowerCase() === 'delivered').length,
//       cancelled: donations.filter(d => d.Status?.toLowerCase() === 'cancelled').length,
//       availableMedicines: donations.filter(d => d.MedicineStatus?.toLowerCase() === 'available').length,
//       donatedMedicines: donations.filter(d => d.MedicineStatus?.toLowerCase() === 'donated').length,
//       totalQuantity: donations.reduce((sum, d) => sum + (d.Quantity || 0), 0)
//     };
    
//     return stats;
//   }
// };

// // Medicine Service for related medicine operations
// export const medicineService = {
//   // Get medicines by donor
//   async getMedicinesByDonor(donorId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch medicines');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching medicines:', error);
//       throw error;
//     }
//   },

//   // Get available medicines
//   async getAvailableMedicines() {
//     try {
//       const response = await fetch(`${API_BASE_URL}/medicines/available`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch available medicines');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching available medicines:', error);
//       throw error;
//     }
//   },

//   // Update medicine status
//   async updateMedicineStatus(medicineId, status) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/medicines/${medicineId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ Status: status }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update medicine status');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating medicine status:', error);
//       throw error;
//     }
//   }
// };

// // User Service for donor-related operations
// export const userService = {
//   // User login
//   async loginUser(credentials) {
//     try {
//       console.log('Sending login data:', credentials);
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Login failed');
//       }

//       const data = await response.json();
//       console.log('Backend login response:', data);

//       // Ensure token exists
//       if (!data || !data.token) {
//         throw new Error('No token received from server');
//       }

//       // Use the complete user object from the response
//       if (data.user) {
//         console.log('Using complete user object from response:', data.user);
//         return {
//           token: data.token,
//           user: data.user
//         };
//       }

//       // Fallback: Create user object from credentials if backend doesn't return user
//       const user = {
//         email: credentials.email,
//         role: credentials.role || 'User',
//         name: credentials.email.split('@')[0],
//       };

//       return {
//         token: data.token,
//         user: user
//       };
//     } catch (error) {
//       console.error('Error in user login:', error);
//       throw error;
//     }
//   },

//   // Get user by ID
//   async getUserById(userId) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${userId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch user');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       throw error;
//     }
//   },

//   // Update user profile
//   async updateUserProfile(userId, profileData) {
//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(profileData),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update profile');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating user profile:', error);
//       throw error;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const donationService = {
  // Get all donations (Admin view)
  async getAllDonations() {
    try {
      const response = await fetch(`${API_BASE_URL}/donations`);
      if (!response.ok) {
        throw new Error('Failed to fetch donations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
  },

  // Get donation by ID
  async getDonationById(donationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch donation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching donation:', error);
      throw error;
    }
  },

  // Create new donation - Fixed to work with your backend
  async createDonation(donationData) {
    try {
      console.log('Creating donation with data:', donationData);
      
      const response = await fetch(`${API_BASE_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DonorId: donationData.donorId,
          MedicineName: donationData.medicineName,
          Description: donationData.description || '',
          ExpiryDate: donationData.expiryDate, // Make sure this is in YYYY-MM-DD format
          Quantity: parseInt(donationData.quantity),
          DonorNotes: donationData.donorNotes || ''
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create donation');
      }
      
      const result = await response.json();
      console.log('Donation created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Get donations by donor (Donor view)
  async getDonationsByDonor(donorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/donor/${donorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch donations by donor');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching donations by donor:', error);
      throw error;
    }
  },

  // Update donation status
  async updateDonationStatus(donationId, status, adminNotes = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          Status: status,
          AdminNotes: adminNotes 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update donation status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  },

  // Delete donation (Admin action)
  async deleteDonation(donationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/${donationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete donation');
      }
      
      return { success: true, message: 'Donation deleted successfully' };
    } catch (error) {
      console.error('Error deleting donation:', error);
      throw error;
    }
  }
};

// Medicine Service for related medicine operations
export const medicineService = {
  // Get all medicines
  async getAllMedicines() {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },

  // Get medicines by donor
  async getMedicinesByDonor(donorId) {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/donor/${donorId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  },

  // Get available medicines
  async getAvailableMedicines() {
    try {
      const response = await fetch(`${API_BASE_URL}/medicines/available`);
      if (!response.ok) {
        throw new Error('Failed to fetch available medicines');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching available medicines:', error);
      throw error;
    }
  }
};

// User Service for authentication and user operations
export const userService = {
  // User login
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
          Email: credentials.email,
          Password: credentials.password
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
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running on https://localhost:44344');
      }
      
      throw error;
    }
  },

  // Register user
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
          Role: userData.role || 'user',
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
      
      const data = await response.text();
      return { message: data };
    } catch (error) {
      console.error('Error registering user:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }
};

// Export all services
export default {
  donation: donationService,
  medicine: medicineService,
  user: userService
};