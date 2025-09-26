import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sparkles, Star, Zap, ChevronRight, Home, BookOpen, Calendar, Camera, Users, Gift, MessageCircle, HelpCircle } from 'lucide-react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';

const FloatingNavbar = ({ weddingData: propWeddingData, isPublicPage = false, activeSection, setActiveSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { currentTheme, setCurrentTheme, themes } = useAppTheme();
  const theme = themes[currentTheme];
  const { weddingData: contextWeddingData } = useUserData();
  const overlayRef = useRef(null);
  const menuRef = useRef(null);

  // Use prop wedding data if available (for public pages), otherwise use context data
  const weddingData = propWeddingData || contextWeddingData || {
    couple_name_1: 'Sarah',
    couple_name_2: 'Michael'
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Close mobile menu if window resized to desktop
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    const handleClickOutside = (event) => {
      if (mobileMenuOpen && overlayRef.current && event.target === overlayRef.current) {
        closeMobileMenu();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    // Set initial mobile state
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  const openMobileMenu = () => {
    setIsAnimating(true);
    setMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      document.body.style.overflow = 'unset';
      setIsAnimating(false);
    }, 300);
  };

  const handleMobileNavClick = (path) => {
    setTimeout(() => closeMobileMenu(), 100);
  };

  // Navigation items based on page type
  const navItems = isPublicPage ? [
    { path: 'home', label: 'Home', icon: Home },
    { path: 'story', label: 'Our Story', icon: BookOpen },
    { path: 'rsvp', label: 'RSVP', icon: Sparkles },
    { path: 'schedule', label: 'Schedule', icon: Calendar },
    { path: 'gallery', label: 'Gallery', icon: Camera },
    { path: 'party', label: 'Wedding Party', icon: Users },
    { path: 'registry', label: 'Registry', icon: Gift },
    { path: 'guestbook', label: 'Guestbook', icon: MessageCircle },
    { path: 'faq', label: 'FAQ', icon: HelpCircle }
  ] : [
    { path: '/', label: 'Home', icon: Heart },
    { path: '/story', label: 'Our Story', icon: Sparkles },
    { path: '/rsvp', label: 'RSVP', icon: Star },
    { path: '/schedule', label: 'Schedule', icon: Zap },
    { path: '/gallery', label: 'Gallery', icon: Heart },
    { path: '/party', label: 'Wedding Party', icon: Sparkles },
    { path: '/registry', label: 'Registry', icon: Star },
    { path: '/guestbook', label: 'Guestbook', icon: Zap },
    { path: '/faq', label: 'FAQ', icon: Heart }
  ];

  return (
    <>
      {/* Floating Navbar Container */}
      <nav 
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-700 ease-out ${
          scrolled 
            ? 'scale-95' 
            : 'scale-100'
        }`}
        style={{
          width: isMobile ? 'min(90vw, 400px)' : 'auto',
          transformOrigin: 'center top'
        }}
      >
        {/* Main Floating Rectangle - Optimized width */}
        <div 
          className={`relative px-4 py-3 transition-all duration-700 ease-out border ${
            scrolled 
              ? 'backdrop-blur-3xl bg-white/95' 
              : 'backdrop-blur-2xl bg-white/85'
          }`}
          style={{
            borderRadius: '16px', // Slightly smaller for compactness
            borderColor: `${theme.accent}30`,
            boxShadow: scrolled 
              ? `0 8px 24px ${theme.primary}12, 0 3px 12px ${theme.accent}10` 
              : `0 6px 20px ${theme.primary}10, 0 2px 10px ${theme.accent}08`,
            maxWidth: isMobile ? 'none' : 'calc(100vw - 40px)', // Ensure it never exceeds viewport
            width: isMobile ? '100%' : 'auto'
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              borderRadius: '20px', // Match parent border radius
              background: `linear-gradient(135deg, ${theme.accent}08 0%, ${theme.primary}04 100%)`
            }}
          />

          <div className="relative flex items-center">
            {/* Left Side: Couple Names with Heart - Optimized */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Heart 
                  className={`transition-all duration-500 ${
                    scrolled ? 'w-4 h-4' : 'w-5 h-5'
                  }`}
                  style={{ color: theme.accent }} 
                />
              </div>
              
              <div className="flex-shrink-0">
                <h1 
                  className={`font-bold leading-tight transition-all duration-500 whitespace-nowrap ${
                    scrolled ? 'text-sm' : 'text-base'
                  }`}
                  style={{ 
                    fontFamily: theme.fontPrimary,
                    color: theme.primary,
                    textShadow: `0 1px 2px ${theme.primary}15`
                  }}
                >
                  {weddingData?.couple_name_1} & {weddingData?.couple_name_2}
                </h1>
              </div>
            </div>

            {/* Desktop Navigation Items (hidden on mobile) - Optimized for screen width */}
            <div className="hidden lg:flex items-center ml-4 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isPublicPage 
                  ? (activeSection === item.path) 
                  : (location.pathname === item.path);

                const NavigationItem = isPublicPage ? 'button' : Link;
                const itemProps = isPublicPage 
                  ? { 
                      onClick: () => setActiveSection(item.path)
                    }
                  : { 
                      to: item.path 
                    };

                return (
                  <NavigationItem
                    key={item.path}
                    {...itemProps}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-500 group relative overflow-hidden ${
                      isActive ? 'scale-105' : 'hover:scale-102'
                    }`}
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, ${theme.accent}25, ${theme.accent}15)` 
                        : 'transparent',
                      color: isActive ? theme.primary : theme.textLight,
                      border: isActive ? `1px solid ${theme.accent}30` : '1px solid transparent'
                    }}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div 
                        className="absolute inset-0 rounded-lg animate-pulse"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.accent}10, ${theme.accent}05)`,
                          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                        }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div 
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `${theme.accent}08` }}
                    />
                    
                    <Icon 
                      className={`w-3.5 h-3.5 relative z-10 transition-all duration-300 flex-shrink-0 ${
                        isActive ? 'scale-110' : 'group-hover:scale-105'
                      }`}
                    />
                    <span 
                      className={`relative z-10 transition-all duration-300 whitespace-nowrap font-medium ${
                        scrolled ? 'text-xs' : 'text-xs'
                      }`}
                      style={{ 
                        fontFamily: theme.fontSecondary,
                        fontSize: '11px'
                      }}
                    >
                      {item.label}
                    </span>

                    {/* Premium active glow effect */}
                    {isActive && (
                      <div 
                        className="absolute -inset-0.5 rounded-lg opacity-30 -z-10"
                        style={{ 
                          background: `linear-gradient(45deg, ${theme.accent}, transparent, ${theme.accent})`,
                          filter: 'blur(1px)'
                        }}
                      />
                    )}
                  </NavigationItem>
                );
              })}

              {/* Compact Theme Selector for Desktop */}
              {!isPublicPage && (
                <div className="flex items-center ml-2 pl-2 border-l border-opacity-20" style={{ borderColor: theme.accent }}>
                  <select
                    value={currentTheme}
                    onChange={(e) => setCurrentTheme(e.target.value)}
                    className="bg-transparent rounded-md px-2 py-1 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-1"
                    style={{ 
                      color: theme.textLight,
                      border: `1px solid ${theme.accent}20`,
                      focusRing: `${theme.accent}40`,
                      fontSize: '10px'
                    }}
                  >
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="boho">Boho</option>
                  </select>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu (only visible on mobile) */}
            <div className="lg:hidden ml-6">
              <button
                onClick={() => mobileMenuOpen ? closeMobileMenu() : openMobileMenu()}
                className="relative p-2 rounded-xl transition-all duration-500 hover:scale-110 focus:outline-none group"
                style={{ 
                  backgroundColor: mobileMenuOpen ? `${theme.accent}20` : 'transparent'
                }}
                aria-label="Toggle mobile menu"
              >
                {/* Premium Hamburger Animation */}
                <div className="relative w-6 h-6">
                  {/* Top bar */}
                  <div 
                    className={`absolute top-1 left-0 w-6 h-0.5 rounded-full transition-all duration-500 ease-out ${
                      mobileMenuOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'
                    }`}
                    style={{ 
                      backgroundColor: theme.primary,
                      transformOrigin: 'center'
                    }}
                  />
                  {/* Middle bar */}
                  <div 
                    className={`absolute top-2.5 left-0 w-6 h-0.5 rounded-full transition-all duration-300 ease-out ${
                      mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}
                    style={{ backgroundColor: theme.primary }}
                  />
                  {/* Bottom bar */}
                  <div 
                    className={`absolute top-4 left-0 w-6 h-0.5 rounded-full transition-all duration-500 ease-out ${
                      mobileMenuOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'
                    }`}
                    style={{ 
                      backgroundColor: theme.primary,
                      transformOrigin: 'center'
                    }}
                  />
                </div>

                {/* Hover effect */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `${theme.accent}15` }}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Mobile Menu Overlay - Only for Mobile */}
      {mobileMenuOpen && (
        <div 
          ref={overlayRef}
          className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-10"
                style={{
                  background: `radial-gradient(circle, ${theme.accent}, ${theme.primary})`,
                  width: `${Math.random() * 80 + 40}px`,
                  height: `${Math.random() * 80 + 40}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>

          {/* Premium Dropdown Menu - Properly positioned and scrollable */}
          <div 
            ref={menuRef}
            className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-80 max-w-[90vw] transition-all duration-700 ease-out ${
              mobileMenuOpen 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-10 opacity-0 scale-95'
            }`}
            style={{
              transformOrigin: 'top center',
              maxHeight: 'calc(100vh - 100px)', // Ensure it fits in viewport
            }}
          >
            <div 
              className="rounded-3xl border overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.background}96, ${theme.secondary}88)`,
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderColor: `${theme.accent}25`,
                boxShadow: `0 25px 50px ${theme.primary}20, 0 10px 20px ${theme.accent}15`,
                borderRadius: '24px' // Fixed consistent border radius
              }}
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-opacity-10" style={{ borderColor: theme.accent }}>
                <div className="text-center">
                  <div className="flex justify-center items-center gap-3 mb-3">
                    <Heart className="w-8 h-8" style={{ color: theme.accent }} />
                  </div>
                  <h2 
                    className="text-xl font-bold mb-1"
                    style={{ 
                      fontFamily: theme.fontPrimary,
                      color: theme.primary 
                    }}
                  >
                    {weddingData?.couple_name_1} & {weddingData?.couple_name_2}
                  </h2>
                  <p className="text-sm opacity-70" style={{ color: theme.textLight }}>
                    Wedding Navigation
                  </p>
                </div>
              </div>

              {/* Scrollable Navigation Items Container */}
              <div 
                className="overflow-y-auto custom-scrollbar"
                style={{ 
                  maxHeight: 'calc(100vh - 300px)' // Leave space for header and theme selector
                }}
              >
                <div className="p-4 space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = isPublicPage 
                      ? (activeSection === item.path) 
                      : (location.pathname === item.path);
                    
                    const itemElement = isPublicPage ? (
                      <button
                        key={item.path}
                        onClick={() => {
                          setActiveSection(item.path);
                          handleMobileNavClick(item.path);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                          isActive ? 'scale-105' : 'hover:scale-102'
                        }`}
                        style={{ 
                          background: isActive 
                            ? `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)` 
                            : 'transparent',
                          animationDelay: `${index * 80}ms`,
                          color: isActive ? theme.accent : theme.text,
                          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                          opacity: mobileMenuOpen ? 1 : 0,
                          animation: mobileMenuOpen ? `slideInUp 0.6s ease-out ${index * 80}ms forwards` : 'none'
                        }}
                      >
                        <AnimatedMenuItem 
                          Icon={Icon}
                          label={item.label}
                          isActive={isActive}
                          theme={theme}
                        />
                      </button>
                    ) : (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => handleMobileNavClick(item.path)}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                          isActive ? 'scale-105' : 'hover:scale-102'
                        }`}
                        style={{ 
                          background: isActive 
                            ? `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)` 
                            : 'transparent',
                          animationDelay: `${index * 80}ms`,
                          color: isActive ? theme.accent : theme.text,
                          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                          opacity: mobileMenuOpen ? 1 : 0,
                          animation: mobileMenuOpen ? `slideInUp 0.6s ease-out ${index * 80}ms forwards` : 'none'
                        }}
                      >
                        <AnimatedMenuItem 
                          Icon={Icon}
                          label={item.label}
                          isActive={isActive}
                          theme={theme}
                        />
                      </Link>
                    );

                    return itemElement;
                  })}
                </div>
              </div>

              {/* Theme Selector - Fixed at bottom */}
              {!isPublicPage && (
                <div className="p-6 border-t border-opacity-10" style={{ borderColor: theme.accent }}>
                  <label className="text-sm font-medium opacity-70 mb-3 block" style={{ color: theme.text }}>
                    Theme
                  </label>
                  <select
                    value={currentTheme}
                    onChange={(e) => setCurrentTheme(e.target.value)}
                    className="w-full bg-white/10 rounded-2xl px-4 py-3 text-sm cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 backdrop-blur-sm"
                    style={{ 
                      color: theme.text,
                      border: `1px solid ${theme.accent}20`,
                      focusRing: `${theme.accent}40`,
                      borderRadius: '16px' // Fixed consistent border radius
                    }}
                  >
                    <option value="classic">🎭 Classic Elegance</option>
                    <option value="modern">🚀 Modern Minimalist</option>
                    <option value="boho">🌸 Boho Chic</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add required CSS animations and custom scrollbar */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${theme.accent}40 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme.accent}40;
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme.accent}60;
        }

        /* Smooth scroll behavior */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

// Animated Menu Item Component
const AnimatedMenuItem = ({ Icon, label, isActive, theme }) => (
  <>
    {/* Premium hover background effect */}
    <div 
      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
      style={{ background: `linear-gradient(135deg, ${theme.accent}08, ${theme.accent}03)` }}
    />
    
    {/* Icon with subtle animation */}
    <div className="relative z-10 flex-shrink-0">
      <Icon 
        className={`w-5 h-5 transition-all duration-500 ${
          isActive ? 'scale-110' : 'group-hover:scale-105'
        }`}
      />
    </div>
    
    {/* Label */}
    <span 
      className="relative z-10 font-medium text-base flex-1"
      style={{ fontFamily: theme.fontSecondary }}
    >
      {label}
    </span>
    
    {/* Premium arrow indicator */}
    <ChevronRight 
      className={`w-4 h-4 transition-all duration-500 ${
        isActive 
          ? 'opacity-100 translate-x-0' 
          : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
      }`}
    />
    
    {/* Active indicator */}
    {isActive && (
      <div 
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full"
        style={{ 
          background: `linear-gradient(to bottom, ${theme.accent}, ${theme.primary})`,
          animation: 'scaleIn 0.3s ease-out'
        }}
      />
    )}
  </>
);

export default FloatingNavbar;