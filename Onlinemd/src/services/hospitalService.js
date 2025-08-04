// Hospital Service - MySQL Integration
// This file integrates with ASP.NET Core backend at https://localhost:44344/api

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }
  return response.json();
}

export const hospitalService = {
  async getAllHospitals() {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to fetch hospitals:', error.message);
      throw error;
    }
  },

  async getHospitalById(hospitalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to fetch hospital:', error.message);
      throw error;
    }
  },

  async createHospital(hospitalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospitalData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to create hospital:', error.message);
      throw error;
    }
  },

  async updateHospital(hospitalId, hospitalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hospitalData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to update hospital:', error.message);
      throw error;
    }
  },

  async deleteHospital(hospitalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to delete hospital:', error.message);
      throw error;
    }
  },

  async getHospitalsByCity(city) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/city/${encodeURIComponent(city)}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to fetch hospitals by city:', error.message);
      throw error;
    }
  },

  async getHospitalsByState(state) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/state/${encodeURIComponent(state)}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to fetch hospitals by state:', error.message);
      throw error;
    }
  },

  async searchHospitals(searchTerm) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/search?q=${encodeURIComponent(searchTerm)}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to search hospitals:', error.message);
      throw error;
    }
  },

  async getHospitalStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/stats`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to fetch hospital stats:', error.message);
      throw error;
    }
  },

  async getHospitalProfile(hospitalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}/profile`);
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to fetch hospital profile:', error.message);
      throw error;
    }
  },

  async updateHospitalProfile(hospitalId, profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/hospitals/${hospitalId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('🔴 Failed to update hospital profile:', error.message);
      throw error;
    }
  }
};
