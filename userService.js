// User Service - ASP.NET Core Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:44344/api';

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = 'Request failed';

    switch (response.status) {
      case 400: errorMessage = 'Bad request: Please check your input data'; break;
      case 401: errorMessage = 'Unauthorized: Please check your credentials'; break;
      case 403: errorMessage = 'Forbidden'; break;
      case 404: errorMessage = 'Not found'; break;
      case 409: errorMessage = 'Conflict: Email may already be in use'; break;
      case 422: errorMessage = 'Validation error'; break;
      case 500: errorMessage = 'Internal server error'; break;
      default:  errorMessage = `Error ${response.status}`;
    }

    try {
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        errorMessage = data?.message || data?.error || errorMessage;
      } else {
        const text = await response.text();
        if (text) errorMessage = text;
      }
    } catch (err) {
      console.warn('Unable to parse error body:', err);
    }

    console.error('API Error:', {
      status: response.status,
      url: response.url,
      message: errorMessage
    });

    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return await response.text(); // fallback
};



export const userService = {
  // Test API connection
  async testConnection() {
    try {
      console.log('Testing connection to:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      });
      console.log('Connection test response:', response.status);
      // If we get a 401 (Unauthorized), it means the server is running but credentials are wrong
      // If we get a 400 (Bad Request), it means the server is running
      return response.status === 401 || response.status === 400;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  //Delete user
  // async deleteUser(userId) {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
  //       method: 'DELETE',
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to delete user');
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     throw error;
  //   }
  // }

  //Delete user
async deleteUser(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Use handleApiResponse for consistent error handling
    await handleApiResponse(response);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


  
  
  
  
  ,


  // User registration
  async register(userData) {
    try {
      console.log('Original registration data:', userData);
  
      // Clean up data based on role
      let cleanedData = {};
  
      switch (userData.role?.toLowerCase()) {
        case 'admin':
          cleanedData = {
            role: 'Admin',
            name: userData.name,
            email: userData.email,
            password: userData.password,
          };
          break;
  
        case 'hospital':
          cleanedData = {
            role: 'Hospital',
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            address: userData.address,
          };
          break;
  
        case 'ngo':
          cleanedData = {
            role: 'Ngo',
            organizationName: userData.organizationName,
            contactPerson: userData.contactPerson,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            address: userData.address,
          };
          break;
  
        case 'user':
        default:
          cleanedData = {
            role: 'User',
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            address: userData.address,
          };
          break;
      }
  
      console.log('Cleaned registration data:', cleanedData);
  
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
  
      console.log('Response status:', response.status);
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error in user registration:', error);
  
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Make sure the backend is running.');
      }
  
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Connection failed: Please ensure the backend server is running on https://localhost:44344');
      }
  
      throw error;
    }
  },
  
  


  // User registration (legacy method)
  async registerUser(userData) {
    return this.register(userData);
  },

  // User login
  async loginUser(credentials) {
    try {
      console.log('Sending login data:', credentials);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await handleApiResponse(response);
  
      // Ensure token exists
      if (!data || !data.token) {
        throw new Error('No token received from server');
      }
  
      // Decode the token to extract user info
      let user = null;
      try {
        const tokenParts = data.token.split('.');
        if (tokenParts.length === 3) {
          const base64Url = tokenParts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
          const payload = JSON.parse(jsonPayload);
          user = {
            email: payload.email,
            role: payload.role,
            name: payload.name || payload.email.split('@')[0], // Fallback name
          };
        } else {
          // Non-JWT token or invalid format, use credentials as fallback
          user = {
            email: credentials.email,
            role: credentials.role || 'User',
            name: credentials.email.split('@')[0],
          };
        }
      } catch (decodeError) {
        console.warn('Token decoding failed, using credentials as fallback:', decodeError);
        user = {
          email: credentials.email,
          role: credentials.role || 'User',
          name: credentials.email.split('@')[0],
        };
      }
  
      // Return token and user object
      return { token: data.token, user };
    } catch (error) {
      console.error('Error in user login:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Search users
  async searchUsers(searchTerm) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Get users by role
  async getUsersByRole(role) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/role/${role}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users by role');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
};       