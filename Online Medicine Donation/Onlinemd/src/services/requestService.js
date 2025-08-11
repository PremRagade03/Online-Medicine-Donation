// Request Service - ASP.NET Core Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

export const requestService = {
  // Get all requests
  async getAllRequests() {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching requests:', error);
      throw error;
    }
  },

  // Get request by ID
  async getRequestById(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching request:', error);
      throw error;
    }
  },

  // Create new request
  async createRequest(requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error('Failed to create request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  // Update request
  async updateRequest(requestId, requestData) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        throw new Error('Failed to update request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  },

  // Delete request
  async deleteRequest(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete request');
      }
      return true;
    } catch (error) {
      console.error('Error deleting request:', error);
      throw error;
    }
  },

  // Get requests by requester
  async getRequestsByRequester(requesterId) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/requester/${requesterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests by requester');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching requests by requester:', error);
      throw error;
    }
  },

  // Get requests by status
  async getRequestsByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/status/${status}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests by status');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching requests by status:', error);
      throw error;
    }
  },

  // Search requests
  async searchRequests(searchTerm) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to search requests');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching requests:', error);
      throw error;
    }
  },

  // Get request statistics
  async getRequestStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch request statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching request statistics:', error);
      throw error;
    }
  },

  // Approve request
  async approveRequest(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/approve`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to approve request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error approving request:', error);
      throw error;
    }
  },

  // Reject request
  async rejectRequest(requestId, reason) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      if (!response.ok) {
        throw new Error('Failed to reject request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  },

  // Complete request
  async completeRequest(requestId) {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/complete`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error('Failed to complete request');
      }
      return await response.json();
    } catch (error) {
      console.error('Error completing request:', error);
      throw error;
    }
  }
}; 