// Mock User Service for testing when backend is not available
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@test.com',
    password: 'admin@123',
    name: 'Admin User',
    role: 'Admin',
    phone: '1234567890',
    address: 'Admin Address'
  },
  {
    id: 2,
    email: 'donor@test.com',
    password: 'donor@123',
    name: 'Donor User',
    role: 'User',
    phone: '1234567891',
    address: 'Donor Address'
  },
  {
    id: 3,
    email: 'hospital@test.com',
    password: 'hospital@123',
    name: 'Hospital User',
    role: 'Hospital',
    phone: '1234567892',
    address: 'Hospital Address'
  },
  {
    id: 4,
    email: 'ngo@test.com',
    password: 'ngo@123',
    name: 'NGO User',
    role: 'Ngo',
    phone: '1234567893',
    address: 'NGO Address'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockUserService = {
  // Test API connection
  async testConnection() {
    await delay(500);
    return true; // Mock always returns true
  },

  // Get all users
  async getAllUsers() {
    await delay(800);
    return MOCK_USERS.map(user => ({ ...user, password: undefined })); // Don't return passwords
  },

  // Get user by ID
  async getUserById(userId) {
    await delay(500);
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return { ...user, password: undefined };
  },

  // Create user
  async createUser(userData) {
    await delay(1000);
    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    MOCK_USERS.push(newUser);
    return { ...newUser, password: undefined };
  },

  // Update user
  async updateUser(userId, userData) {
    await delay(800);
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData };
    return { ...MOCK_USERS[userIndex], password: undefined };
  },

  // Delete user
  async deleteUser(userId) {
    await delay(500);
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    
    MOCK_USERS.splice(userIndex, 1);
    return { success: true };
  },

  // Register user
  async register(userData) {
    await delay(1000);
    
    // Check if email already exists
    const existingUser = MOCK_USERS.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    MOCK_USERS.push(newUser);
    
    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      user: { ...newUser, password: undefined },
      token: token,
      message: 'User registered successfully'
    };
  },

  // Login user
  async loginUser(credentials) {
    await delay(800);
    
    const { email, password, role } = credentials;
    
    // Find user by email and password
    const user = MOCK_USERS.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (!user) {
      throw new Error('Invalid credentials. Please check your email, password, and role.');
    }
    
    // Generate mock token
    const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      user: { ...user, password: undefined },
      token: token,
      message: 'Login successful'
    };
  },

  // Get user profile
  async getUserProfile() {
    await delay(500);
    // For mock, return the first user as current user
    const user = MOCK_USERS[0];
    return { ...user, password: undefined };
  },

  // Update user profile
  async updateUserProfile(profileData) {
    await delay(800);
    const userIndex = MOCK_USERS.findIndex(u => u.id === profileData.id);
    if (userIndex === -1) throw new Error('User not found');
    
    MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...profileData };
    return { ...MOCK_USERS[userIndex], password: undefined };
  },

  // Search users
  async searchUsers(searchTerm) {
    await delay(600);
    const filteredUsers = MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredUsers.map(user => ({ ...user, password: undefined }));
  },

  // Get users by role
  async getUsersByRole(role) {
    await delay(500);
    const filteredUsers = MOCK_USERS.filter(user => user.role === role);
    return filteredUsers.map(user => ({ ...user, password: undefined }));
  }
}; 