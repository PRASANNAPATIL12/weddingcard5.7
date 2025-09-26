import React, { createContext, useContext, useState, useEffect } from 'react';

const UserDataContext = createContext();

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

// Default wedding data (what visitors see when not logged in)
const defaultWeddingData = {
  // Home section data
  couple_name_1: 'Sarah',
  couple_name_2: 'Michael',
  wedding_date: '2025-06-15',
  venue_name: 'Sunset Garden Estate',
  venue_location: 'Sunset Garden Estate • Napa Valley, California',
  their_story: 'We can\'t wait to celebrate our love story with the people who matter most to us. Join us for an unforgettable evening of joy, laughter, and new beginnings.',
  
  // Story section data
  story_timeline: [
    {
      year: "2019",
      title: "First Meeting",
      description: "We met at a coffee shop in downtown San Francisco on a rainy Tuesday morning. Sarah ordered a lavender latte, and Michael couldn't stop staring at her beautiful smile.",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop"
    },
    {
      year: "2020", 
      title: "First Date",
      description: "Our first official date was a sunset picnic in Golden Gate Park. We talked for hours about our dreams, travels, and favorite books under the stars.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop"
    },
    {
      year: "2021",
      title: "Moving In Together", 
      description: "After a year of long-distance dating, we decided to take the next step and move in together. Our first apartment was tiny but filled with so much love.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop"
    },
    {
      year: "2023",
      title: "The Proposal",
      description: "Michael proposed during our vacation in Santorini, Greece. As the sun set over the Aegean Sea, he got down on one knee with Sarah's grandmother's ring.",
      image: "https://images.unsplash.com/photo-1597248374161-426f3d6f1f6b?w=600&h=400&fit=crop"
    },
    {
      year: "2025",
      title: "Our Wedding Day",
      description: "And now, we're ready to say 'I do' surrounded by our family and friends. This is just the beginning of our beautiful journey together.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop"
    }
  ],
  
  // Schedule section data
  schedule_events: [
    {
      time: "2:00 PM",
      title: "Guests Arrival & Welcome",
      description: "Please arrive by 2:00 PM for welcome drinks and mingling before the ceremony begins.",
      location: "Sunset Garden Estate - Main Entrance",
      icon: "Users",
      duration: "30 minutes"
    },
    {
      time: "2:30 PM",
      title: "Pre-Ceremony Music",
      description: "Enjoy live acoustic music as guests are seated for the ceremony.",
      location: "Garden Ceremony Space",
      icon: "Music",
      duration: "30 minutes"
    },
    {
      time: "3:00 PM",
      title: "Wedding Ceremony",
      description: "The main event! Sarah and Michael exchange vows in our beautiful garden setting.",
      location: "Sunset Garden Estate - Ceremony Garden",
      icon: "Calendar",
      duration: "45 minutes",
      highlight: true
    },
    {
      time: "3:45 PM",
      title: "Cocktail Hour & Photos",
      description: "Celebrate with signature cocktails while the wedding party takes photos.",
      location: "Terrace & Garden Areas",
      icon: "Camera",
      duration: "1 hour 15 minutes"
    },
    {
      time: "5:00 PM",
      title: "Reception Dinner",
      description: "Join us for a three-course dinner featuring locally sourced ingredients.",
      location: "Grand Ballroom",
      icon: "Utensils",
      duration: "2 hours"
    },
    {
      time: "7:30 PM",
      title: "First Dance & Toasts",
      description: "Watch the newlyweds' first dance followed by heartfelt toasts from family and friends.",
      location: "Grand Ballroom",
      icon: "Music",
      duration: "30 minutes"
    },
    {
      time: "8:00 PM",
      title: "Dancing & Celebration",
      description: "Dance the night away with live music and DJ entertainment.",
      location: "Grand Ballroom & Terrace",
      icon: "Music",
      duration: "4 hours"
    }
  ],
  
  // Gallery section data
  gallery_photos: [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=600&fit=crop",
      category: "engagement",
      title: "Engagement Session"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
      category: "travel",
      title: "Paris Adventure"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      category: "engagement",
      title: "Golden Hour"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1597248374161-426f3d6f1f6b?w=800&h=600&fit=crop",
      category: "travel",
      title: "Santorini Sunset"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      category: "family",
      title: "Family Gathering"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
      category: "friends",
      title: "With Our Gang"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop",
      category: "engagement",
      title: "Candid Moments"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1594736797933-d0c4a30e71a0?w=800&h=600&fit=crop",
      category: "travel",
      title: "Beach Getaway"
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1606490194859-07c18c9f0968?w=800&h=600&fit=crop",
      category: "engagement",
      title: "The Proposal"
    }
  ],
  
  // Wedding party data
  bridal_party: [
    {
      name: "Emily Johnson",
      role: "Maid of Honor",
      relationship: "Sister & Best Friend",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=400&h=400&fit=crop&crop=face",
      description: "Sarah's older sister and lifelong confidante. Emily has been there through every milestone and couldn't be more excited to stand by Sarah's side."
    },
    {
      name: "Jessica Chen",
      role: "Bridesmaid",
      relationship: "College Roommate",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Met Sarah in freshman year and they've been inseparable ever since. Jessica brings laughter and adventure to every situation."
    },
    {
      name: "Amanda Rodriguez",
      role: "Bridesmaid",
      relationship: "Work Best Friend",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
      description: "Sarah's partner-in-crime at work who became family. Amanda is known for her infectious smile and unwavering loyalty."
    },
    {
      name: "Sophie Williams",
      role: "Bridesmaid",
      relationship: "Childhood Friend",
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face",
      description: "Friends since elementary school, Sophie knows all of Sarah's secrets and dreams. Their friendship has stood the test of time."
    }
  ],
  
  groom_party: [
    {
      name: "David Thompson",
      role: "Best Man",
      relationship: "Brother & Confidant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Michael's younger brother and best friend. David has always looked up to Michael and is honored to be his best man on this special day."
    },
    {
      name: "Ryan Mitchell",
      role: "Groomsman",
      relationship: "College Buddy",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      description: "Michael's college roommate and adventure partner. Ryan introduced Michael to rock climbing and they've been conquering peaks together ever since."
    },
    {
      name: "James Park",
      role: "Groomsman",
      relationship: "Work Colleague",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Started as colleagues but quickly became close friends. James is Michael's go-to person for both professional advice and weekend golf games."
    },
    {
      name: "Alex Turner",
      role: "Groomsman",
      relationship: "Childhood Friend",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
      description: "Friends since they were kids in the same neighborhood. Alex and Michael have shared countless memories and adventures growing up together."
    }
  ],
  
  // Registry data
  registry_items: [
    {
      store: "Williams Sonoma",
      description: "For all our kitchen and cooking needs as we start our married life together.",
      url: "https://www.williams-sonoma.com",
      icon: "Coffee",
      color: "#E8B4B8"
    },
    {
      store: "Crate & Barrel",
      description: "Home essentials and beautiful pieces to make our house a home.",
      url: "https://www.crateandbarrel.com",
      icon: "Home",
      color: "#A8C8EC"
    },
    {
      store: "Amazon",
      description: "Everything else we need for our new adventure together.",
      url: "https://www.amazon.com",
      icon: "Gift",
      color: "#F4C2A1"
    }
  ],
  
  honeymoon_fund: {
    title: "Honeymoon Fund",
    description: "Help us create unforgettable memories on our honeymoon to Japan. Every contribution, big or small, means the world to us!",
    destination: "Tokyo & Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop"
  },
  
  // FAQ data
  faqs: [
    {
      category: "Wedding Details",
      icon: "HelpCircle",
      questions: [
        {
          question: "What time should I arrive?",
          answer: "Please arrive by 2:30 PM. The ceremony will begin promptly at 3:00 PM. We recommend arriving 30 minutes early to find parking and get seated comfortably."
        },
        {
          question: "What is the dress code?",
          answer: "We've requested formal/black-tie optional attire. We encourage elegant wear in garden-friendly footwear as parts of our celebration will be outdoors on grass and pathways."
        },
        {
          question: "Will the ceremony be indoors or outdoors?",
          answer: "Our ceremony will be held outdoors in the beautiful garden setting at Sunset Garden Estate. Don't worry - we have a covered backup plan in case of inclement weather!"
        }
      ]
    }
  ],
  
  // Theme
  theme: 'classic'
};

export const UserDataProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [weddingData, setWeddingData] = useState(defaultWeddingData);
  const [isLoading, setIsLoading] = useState(true);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

  // Check authentication status on load and reload wedding data if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const sessionId = localStorage.getItem('sessionId');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      
      if (sessionId && userId && username) {
        setIsAuthenticated(true);
        setUserInfo({ sessionId, userId, username });
        
        // CRITICAL FIX: Load user's wedding data from MongoDB backend on app startup
        try {
          let backendUrl = process.env.REACT_APP_BACKEND_URL;
          
          if (!backendUrl) {
            if (window.location.origin.includes('localhost')) {
              backendUrl = 'http://localhost:8001';
            } else {
              backendUrl = window.location.origin;
            }
          }
          
          console.log('Reloading user wedding data from backend on startup:', backendUrl);
          
          const response = await fetch(`${backendUrl}/api/wedding?session_id=${sessionId}`);
          
          if (response.ok) {
            const userWeddingData = await response.json();
            console.log('✅ Reloaded user wedding data from MongoDB on startup:', userWeddingData);
            setWeddingData(userWeddingData);
          } else if (response.status === 401 || response.status === 403) {
            console.log('Session expired during startup, logging out');
            // Session is invalid, clear localStorage and set as not authenticated
            localStorage.removeItem('sessionId');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            setIsAuthenticated(false);
            setUserInfo(null);
            setWeddingData(defaultWeddingData);
          } else if (response.status === 404) {
            console.log('No existing wedding data found, user starts with default template');
            setWeddingData(defaultWeddingData);
          } else {
            console.error('Error loading wedding data on startup:', response.status);
            setWeddingData(defaultWeddingData);
          }
        } catch (error) {
          console.error('❌ Error loading wedding data from MongoDB on startup:', error);
          setWeddingData(defaultWeddingData);
        }
      } else {
        // No session, show default data
        setWeddingData(defaultWeddingData);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Save wedding data to MongoDB backend ONLY (no localStorage)
  const saveWeddingData = async (newData) => {
    console.log('Saving wedding data to MongoDB:', newData);
    setWeddingData(newData);
    
    if (isAuthenticated && userInfo?.sessionId) {
      // CRITICAL: Save ONLY to MongoDB backend for public URL access
      try {
        // Fix the backend URL determination for production
        let backendUrl = process.env.REACT_APP_BACKEND_URL;
        
        // Check if we're in production environment
        if (!backendUrl || window.location.origin.includes('emergentagent.com')) {
          // Production environment - use relative URL
          backendUrl = '';
        } else if (!backendUrl && window.location.origin.includes('localhost')) {
          backendUrl = 'http://localhost:8001';
        }
        
        console.log('Using backend URL:', backendUrl);
        
        // Always use PUT method to update/create wedding data
        const response = await fetch(`${backendUrl}/api/wedding`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...newData,
            session_id: userInfo.sessionId
          })
        });
        
        if (response.ok) {
          const savedData = await response.json();
          console.log('✅ Wedding data successfully saved to MongoDB:', savedData);
          
          // Update local state with the saved data (including any server-generated fields)
          setWeddingData(savedData);
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to save wedding data to MongoDB:', response.status, errorText);
          throw new Error(`Failed to save data: ${response.status}`);
        }
      } catch (error) {
        console.error('❌ Error syncing wedding data to MongoDB backend:', error);
        throw error; // Don't fall back to localStorage - user explicitly said no
      }
    }
  };

  // Update specific field in wedding data
  const updateWeddingData = (field, value) => {
    const updatedData = { ...weddingData, [field]: value };
    saveWeddingData(updatedData);
  };

  // Login function - Load user data from MongoDB ONLY
  const login = async (sessionData) => {
    const { sessionId, userId, username } = sessionData;
    
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('userId', userId);  
    localStorage.setItem('username', username);
    
    setIsAuthenticated(true);
    setUserInfo({ sessionId, userId, username });
    setLeftSidebarOpen(true); // Open sidebar by default when user logs in
    
    // CRITICAL: Load user's wedding data from MongoDB backend ONLY
    try {
      // Fix the backend URL determination
      let backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // Check if we're in production environment without explicit backend URL
      if (!backendUrl) {
        if (window.location.origin.includes('localhost')) {
          backendUrl = 'http://localhost:8001';
        } else {
          // In production, use the same origin (unified architecture)
          backendUrl = window.location.origin;
        }
      }
      
      console.log('Loading wedding data from backend URL:', backendUrl);
      
      const response = await fetch(`${backendUrl}/api/wedding?session_id=${sessionId}`);
      
      if (response.ok) {
        const userWeddingData = await response.json();
        console.log('✅ Loaded user wedding data from MongoDB:', userWeddingData);
        setWeddingData(userWeddingData);
      } else if (response.status === 404) {
        console.log('No existing wedding data found in MongoDB, user starts with default template');
        // User starts with default template data which they can edit
        setWeddingData(defaultWeddingData);
      } else {
        console.error('Error loading wedding data:', response.status);
        setWeddingData(defaultWeddingData);
      }
    } catch (error) {
      console.error('❌ Error loading wedding data from MongoDB:', error);
      // No localStorage fallback - user explicitly said no
      setWeddingData(defaultWeddingData);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    
    setIsAuthenticated(false);
    setUserInfo(null);
    setWeddingData(defaultWeddingData); // Reset to default data
    setLeftSidebarOpen(false);
  };

  // Get current wedding data (user's data if authenticated, default if not)
  const getCurrentWeddingData = () => {
    return isAuthenticated ? weddingData : defaultWeddingData;
  };

  const value = {
    // Authentication state
    isAuthenticated,
    userInfo,
    isLoading,
    
    // Wedding data
    weddingData: getCurrentWeddingData(),
    defaultWeddingData,
    
    // Functions
    login,
    logout,
    saveWeddingData,
    updateWeddingData,
    
    // UI state
    leftSidebarOpen,
    setLeftSidebarOpen
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};