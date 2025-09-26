import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { Wand2, Sparkles, Heart, Star } from 'lucide-react';

const FloatingTemplateButton = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const navigate = useNavigate();
  const { isAuthenticated, setLeftSidebarOpen } = useUserData();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Auto-hide on scroll for mobile
    let scrollTimeout;
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        setIsVisible(false);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => setIsVisible(true), 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    if (isAuthenticated) {
      // If user is authenticated, toggle the left sidebar
      setLeftSidebarOpen(true);
    } else {
      // If not authenticated, navigate to login page
      navigate('/login');
    }
  };

  const buttonSize = isMobile ? 'w-14 h-14' : 'w-16 h-16';
  const expandedWidth = isMobile ? 'w-48' : 'w-52';

  return (
    <>
      {/* Floating Button with Animations */}
      <div 
        className={`fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-50'
        }`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={() => isMobile && setIsHovered(true)}
        onTouchEnd={() => isMobile && setTimeout(() => setIsHovered(false), 2000)}
      >
        {/* Magical particles around button */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 sm:w-2 sm:h-2 rounded-full transition-all duration-1000 ${
                isHovered ? 'animate-ping opacity-60' : 'opacity-0'
              }`}
              style={{
                background: theme.accent,
                top: `${10 + Math.sin(i * 45 * Math.PI / 180) * 40}px`,
                left: `${10 + Math.cos(i * 45 * Math.PI / 180) * 40}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1.5 + Math.random()}s`
              }}
            />
          ))}
        </div>

        {/* Tooltip */}
        {!isMobile && (
          <div 
            className={`absolute bottom-full right-0 mb-4 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{
              background: theme.gradientAccent,
              color: theme.primary,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            ✨ Use This Template
            <div 
              className="absolute top-full right-4 border-6 sm:border-8 border-transparent"
              style={{ borderTopColor: theme.accent }}
            />
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={handleClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className={`group relative ${buttonSize} rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${
            isHovered && !isMobile ? expandedWidth : ''
          }`}
          style={{
            background: theme.gradientAccent,
            boxShadow: `0 6px 25px ${theme.accent}40, 0 0 0 0 ${theme.accent}20`,
            touchAction: 'manipulation'
          }}
        >
          {/* Ripple effect on click */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-active:opacity-30 group-active:animate-ping"
              style={{ background: theme.accent }}
            />
          </div>

          {/* Icon container */}
          <div className="flex items-center gap-2 sm:gap-3 px-2">
            <div className="relative">
              <Wand2 
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${
                  isHovered ? 'rotate-12 scale-110' : ''
                }`}
                style={{ color: theme.primary }}
              />
              
              {/* Sparkle overlay */}
              <Sparkles 
                className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                  isHovered ? 'animate-pulse scale-125' : 'scale-0'
                }`}
                style={{ color: theme.primary }}
              />
            </div>
            
            {/* Text (visible on hover for desktop) */}
            {!isMobile && (
              <span 
                className={`font-semibold text-xs sm:text-sm transition-all duration-300 ${
                  isHovered ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
                }`}
                style={{ color: theme.primary }}
              >
                Use This Template
              </span>
            )}
          </div>

          {/* Floating hearts animation */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            <Heart 
              className={`absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500 ${
                isHovered ? 'animate-bounce scale-125' : 'scale-0'
              }`}
              style={{ color: theme.primary, animationDelay: '0.2s' }}
            />
            <Star 
              className={`absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 transition-all duration-700 ${
                isHovered ? 'animate-pulse scale-125' : 'scale-0'
              }`}
              style={{ color: theme.primary, animationDelay: '0.4s' }}
            />
          </div>

          {/* Glow effect */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-300 ${
              isHovered ? 'animate-pulse' : ''
            }`}
            style={{ 
              background: `radial-gradient(circle, ${theme.accent}20 0%, transparent 70%)`,
              transform: 'scale(1.5)'
            }}
          />
        </button>

        {/* Mobile tooltip */}
        {isMobile && (
          <div 
            className="absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap bg-black/80 text-white opacity-0 animate-pulse"
            style={{ 
              animation: 'fadeInOut 2s infinite',
              animationDelay: '3s'
            }}
          >
            Tap to customize!
          </div>
        )}
      </div>

      {/* Custom animations for mobile */}
      <style jsx>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateY(5px); }
          50% { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 767px) {
          .animate-fade-in {
            animation: slideInUp 0.3s ease-out;
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default FloatingTemplateButton;