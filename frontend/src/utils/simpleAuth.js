// Ultra-simple client-side authentication using localStorage
// This is the most basic/naive approach as requested

const SIMPLE_USERS_KEY = 'simple_wedding_users';
const CURRENT_USER_KEY = 'current_wedding_user';

// Initialize with some default users
const initializeUsers = () => {
  const existingUsers = localStorage.getItem(SIMPLE_USERS_KEY);
  if (!existingUsers) {
    const defaultUsers = {
      'prasanna': 'password123',
      'testuser': 'password123',
      'debuguser': 'test123'
    };
    localStorage.setItem(SIMPLE_USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Simple string comparison authentication
export const simpleAuth = {
  // Register a new user
  register: (username, password) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(SIMPLE_USERS_KEY) || '{}');
    
    // Check if user already exists
    if (users[username]) {
      throw new Error('Username already exists');
    }
    
    // Simple string storage - just username:password
    users[username] = password;
    localStorage.setItem(SIMPLE_USERS_KEY, JSON.stringify(users));
    
    // Auto-login after registration
    localStorage.setItem(CURRENT_USER_KEY, username);
    
    return {
      success: true,
      username: username,
      session_id: `simple_${Date.now()}_${Math.random()}`
    };
  },

  // Login with string comparison
  login: (username, password) => {
    initializeUsers();
    const users = JSON.parse(localStorage.getItem(SIMPLE_USERS_KEY) || '{}');
    
    // Simple string comparison
    if (users[username] && users[username] === password) {
      localStorage.setItem(CURRENT_USER_KEY, username);
      return {
        success: true,
        username: username,
        session_id: `simple_${Date.now()}_${Math.random()}`
      };
    } else {
      throw new Error('Invalid username or password');
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },

  // Get current user
  getCurrentUser: () => {
    return localStorage.getItem(CURRENT_USER_KEY);
  },

  // Logout
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get all users (for debugging)
  getAllUsers: () => {
    initializeUsers();
    return JSON.parse(localStorage.getItem(SIMPLE_USERS_KEY) || '{}');
  }
};