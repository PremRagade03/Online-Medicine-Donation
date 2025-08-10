// NGO Service - ASP.NET Core Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const ngoService = {
  // Get all NGOs
  async getAllNgos() {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes`);
      if (!response.ok) {
        throw new Error('Failed to fetch NGOs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      throw error;
    }
  },

  // Get NGO by ID
  async getNgoById(ngoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/${ngoId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NGO');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NGO:', error);
      throw error;
    }
  },

  // Create new NGO - Fixed method
  async createNgo(ngoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ngoData),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create NGO: ${response.status} - ${errorData}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating NGO:', error);
      throw error;
    }
  },

  // Alias for backward compatibility
  async addNgo(ngoData) {
    return this.createNgo(ngoData);
  },

  // Update NGO
  async updateNgo(ngoId, ngoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/${ngoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ngoData),
      });
      if (!response.ok) {
        throw new Error('Failed to update NGO');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating NGO:', error);
      throw error;
    }
  },

  // Delete NGO
  async deleteNgo(ngoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/${ngoId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete NGO');
      }
      return true;
    } catch (error) {
      console.error('Error deleting NGO:', error);
      throw error;
    }
  },

  // NGO Login
  async ngoLogin(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in NGO login:', error);
      throw error;
    }
  },

  // NGO Registration
  async ngoRegistration(ngoData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ngoData),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in NGO registration:', error);
      throw error;
    }
  },

  // Get NGO profile
  async getNgoProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch NGO profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NGO profile:', error);
      throw error;
    }
  },

  // Update NGO profile
  async updateNgoProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update NGO profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating NGO profile:', error);
      throw error;
    }
  },

  // Search NGOs
  async searchNgos(searchTerm) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to search NGOs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching NGOs:', error);
      throw error;
    }
  },

  // Get NGOs by location
  async getNgosByLocation(location) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/location/${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NGOs by location');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NGOs by location:', error);
      throw error;
    }
  },

  // Get NGO statistics
  async getNgoStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch NGO statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching NGO statistics:', error);
      throw error;
    }
  },

  // Verify NGO
  async verifyNgo(ngoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/ngoes/${ngoId}/verify`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to verify NGO');
      }
      return await response.json();
    } catch (error) {
      console.error('Error verifying NGO:', error);
      throw error;
    }
  }
};