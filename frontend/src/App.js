import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Navigation from './components/Navigation';
import FloatingTemplateButton from './components/FloatingTemplateButton';
import LeftSidebar from './components/LeftSidebar';
import { UserDataProvider } from './contexts/UserDataContext';
import HomePage from './pages/HomePage';
import RSVPPage from './pages/RSVPPage';
import StoryPage from './pages/StoryPage';
import GalleryPage from './pages/GalleryPage';
import PartyPage from './pages/PartyPage';
import SchedulePage from './pages/SchedulePage';
import RegistryPage from './pages/RegistryPage';
import FAQPage from './pages/FAQPage';
import GuestbookPage from './pages/GuestbookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PublicWeddingPage from './pages/PublicWeddingPage';

// Theme context
const ThemeContext = createContext();

export const useAppTheme = () => useContext(ThemeContext);

// Theme configurations
const themes = {
  classic: {
    primary: '#1a1a1a',
    secondary: '#f8f6f0',
    accent: '#d4af37',
    text: '#333333',
    textLight: '#666666',
    background: '#ffffff',
    gradientPrimary: 'linear-gradient(135deg, #f8f6f0 0%, #ffffff 100%)',
    gradientAccent: 'linear-gradient(135deg, #d4af37 0%, #f4e4a6 100%)',
    fontPrimary: "'Playfair Display', serif",
    fontSecondary: "'Inter', sans-serif",
  },
  modern: {
    primary: '#2c2c2c',
    secondary: '#f5f5f5',
    accent: '#ff6b6b',
    text: '#2c2c2c',
    textLight: '#757575',
    background: '#ffffff',
    gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientAccent: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)',
    fontPrimary: "'Montserrat', sans-serif",
    fontSecondary: "'Inter', sans-serif",
  },
  boho: {
    primary: '#8b4513',
    secondary: '#f4f1e8',
    accent: '#cd853f',
    text: '#5d4037',
    textLight: '#8d6e63',
    background: '#fefefe',
    gradientPrimary: 'linear-gradient(135deg, #d7ccc8 0%, #f4f1e8 100%)',
    gradientAccent: 'linear-gradient(135deg, #cd853f 0%, #ddbf8a 100%)',
    fontPrimary: "'Dancing Script', cursive",
    fontSecondary: "'Lato', sans-serif",
  }
};

function App() {
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [rsvpData, setRsvpData] = useState(null);

  const themeContextValue = {
    currentTheme,
    setCurrentTheme,
    themes,
    rsvpData,
    setRsvpData
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div 
        className="min-h-screen"
        style={{
          background: themes[currentTheme].background,
          color: themes[currentTheme].text,
          fontFamily: themes[currentTheme].fontSecondary,
        }}
      >
        <Router>
          <UserDataProvider>
            <LeftSidebar />
            <Routes>
            {/* Auth Routes (without navigation) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Public Wedding Card by shareable ID */}
            <Route path="/share/:shareableId" element={<PublicWeddingPage />} />
            
            {/* Legacy support for wedding ID routes */}
            <Route path="/wedding/:weddingId" element={<PublicWeddingPage />} />
            
            {/* Public Routes (with navigation and floating button) */}
            <Route path="/" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <HomePage />
              </>
            } />
            <Route path="/rsvp" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <RSVPPage />
              </>
            } />
            <Route path="/story" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <StoryPage />
              </>  
            } />
            <Route path="/gallery" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <GalleryPage />
              </>
            } />
            <Route path="/party" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <PartyPage />
              </>
            } />
            <Route path="/schedule" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <SchedulePage />
              </>
            } />
            <Route path="/registry" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <RegistryPage />
              </>
            } />
            <Route path="/faq" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <FAQPage />
              </>
            } />
            <Route path="/guestbook" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <GuestbookPage isPrivate={false} isDashboard={false} />
              </>
            } />

            {/* Username-based routes - User's personalized wedding pages */}
            <Route path="/:username" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <HomePage isUserPage={true} />
              </>
            } />
            <Route path="/:username/rsvp" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <RSVPPage isUserPage={true} />
              </>
            } />
            <Route path="/:username/story" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <StoryPage isUserPage={true} />
              </>  
            } />
            <Route path="/:username/gallery" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <GalleryPage isUserPage={true} />
              </>
            } />
            <Route path="/:username/party" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <PartyPage isUserPage={true} />
              </>
            } />
            <Route path="/:username/schedule" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <SchedulePage isUserPage={true} />
              </>
            } />
            <Route path="/:username/registry" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <RegistryPage isUserPage={true} />
              </>
            } />
            <Route path="/:username/faq" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <FAQPage isUserPage={true} />
              </>
            } />
            <Route path="/:username/guestbook" element={
              <>
                <Navigation />
                <FloatingTemplateButton />
                <GuestbookPage isPrivate={true} isDashboard={false} />
              </>
            } />
          </Routes>
          </UserDataProvider>
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;