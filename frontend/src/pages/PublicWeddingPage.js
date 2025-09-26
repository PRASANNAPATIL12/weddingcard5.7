import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppTheme } from '../App';
import { Calendar, MapPin, Heart, Clock, User, MessageCircle, Camera, ArrowLeft, Home, BookOpen, Mail, Users, Gift, HelpCircle, Star, Menu, X } from 'lucide-react';
import FloatingNavbar from '../components/FloatingNavbar';

// Default wedding data for fallback
const defaultWeddingData = {
  couple_name_1: 'Sarah',
  couple_name_2: 'Michael',
  wedding_date: '2025-06-15',
  venue_name: 'Sunset Garden Estate',
  venue_location: 'Sunset Garden Estate • Napa Valley, California',
  their_story: 'We can\'t wait to celebrate our love story with the people who matter most to us. Join us for an unforgettable evening of joy, laughter, and new beginnings.',
  theme: 'classic'
};

const PublicWeddingPage = () => {
  const { weddingId, shareableId } = useParams();
  const { themes } = useAppTheme();
  const [currentTheme, setTheme] = useState('classic');
  const theme = themes[currentTheme];
  const navigate = useNavigate();
  
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Navigation items for public view
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'story', label: 'Our Story', icon: BookOpen },
    { id: 'rsvp', label: 'RSVP', icon: Mail },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'party', label: 'Wedding Party', icon: Users },
    { id: 'registry', label: 'Registry', icon: Gift },
    { id: 'guestbook', label: 'Guestbook', icon: MessageCircle },
    { id: 'faq', label: 'FAQ', icon: HelpCircle }
  ];

  useEffect(() => {
    loadWeddingData();
  }, [weddingId, shareableId]);

  useEffect(() => {
    if (weddingData && weddingData.wedding_date) {
      const timer = setInterval(() => {
        const weddingDate = new Date(weddingData.wedding_date + 'T15:00:00');
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;

        if (distance > 0) {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [weddingData]);

  useEffect(() => {
    if (weddingData && weddingData.theme) {
      setTheme(weddingData.theme);
    }
  }, [weddingData]);

  const loadWeddingData = async () => {
    try {
      setLoading(true);
      console.log('PublicWeddingPage - Parameters:', { weddingId, shareableId });
      
      // Determine which identifier to use (prioritize shareableId)
      const identifier = shareableId || weddingId;
      
      if (identifier) {
        try {
          // Use REACT_APP_BACKEND_URL environment variable or fallback to localhost:8001
          let backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
          console.log('PublicWeddingPage - Using backend URL:', backendUrl);
          
          // Use different endpoints based on identifier type
          let apiUrl;
          if (shareableId) {
            // For shareable links: /api/wedding/share/{shareableId}
            apiUrl = `${backendUrl}/api/wedding/share/${shareableId}`;
            console.log('PublicWeddingPage - Using shareable ID:', shareableId);
          } else {
            // For legacy wedding IDs: /api/wedding/public/{weddingId}
            apiUrl = `${backendUrl}/api/wedding/public/${weddingId}`;
            console.log('PublicWeddingPage - Using wedding ID:', weddingId);
          }
          
          console.log('PublicWeddingPage - Fetching from:', apiUrl);
          
          const response = await fetch(apiUrl);
          console.log('PublicWeddingPage - Response status:', response.status);
          
          if (response.ok) {
            const foundWeddingData = await response.json();
            console.log('Found wedding data from backend:', foundWeddingData);
            setWeddingData(foundWeddingData);
          } else if (response.status === 404) {
            // Wedding not found - set error state
            const errorData = await response.json();
            console.log('Wedding not found:', errorData.detail);
            setError(`Wedding not found. The URL "${weddingId}" doesn't exist. Please check the URL or create your wedding first.`);
            setLoading(false);
            return;
          } else {
            const errorText = await response.text();
            console.log('Backend response error:', response.status, errorText);
            setError(`Unable to load wedding data. Please check your internet connection and try again.`);
            setLoading(false);
            return;
          }
        } catch (backendError) {
          console.error('❌ Backend API error:', backendError);
          setError(`Unable to load wedding data. Please check your internet connection and try again.`);
          setLoading(false);
          return;
        }
      } else {
        setError(`No wedding ID provided in the URL.`);
        setLoading(false);
        return;
      }
      
    } catch (error) {
      console.error('❌ Error loading wedding data:', error);
      console.error('❌ Error details:', error.message);
      
      // Only use default data for network/connection errors, not API errors
      if (error.message && error.message.includes('fetch')) {
        console.log('Network error - using default data as fallback');
        setWeddingData(defaultWeddingData);
      } else {
        setError(`Failed to load wedding data: ${error.message || 'Unknown error'}`);
      }
    } finally {
      console.log('PublicWeddingPage - Setting loading to false');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: theme.gradientPrimary,
          fontFamily: theme.fontSecondary 
        }}
      >
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 animate-pulse" style={{ color: theme.accent }} />
          <p className="text-xl" style={{ color: theme.text }}>Loading your wedding card...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: theme.gradientPrimary,
          fontFamily: theme.fontSecondary 
        }}
      >
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto mb-4" style={{ color: theme.textLight }} />
          <h1 className="text-2xl font-semibold mb-2" style={{ color: theme.primary }}>
            Oops! Wedding Card Not Found
          </h1>
          <p className="text-lg" style={{ color: theme.textLight }}>{error}</p>
        </div>
      </div>
    );
  }

  // Navigation component - using FloatingNavbar
  const Navigation = () => (
    <FloatingNavbar 
      weddingData={weddingData} 
      isPublicPage={true}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    />
  );

  // Home Section Component
  const HomeSection = () => (
    <div className="pt-24 pb-16">
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <Heart className="w-20 h-20 mx-auto mb-6 animate-pulse" style={{ color: theme.accent }} />
            <h1 
              className="text-6xl md:text-8xl font-light mb-4"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary,
                background: theme.gradientAccent,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {weddingData?.couple_name_1} & {weddingData?.couple_name_2}
            </h1>
            
            {weddingData?.wedding_date && (
              <p className="text-2xl md:text-3xl mb-4" style={{ color: theme.textLight }}>
                {formatDate(weddingData.wedding_date)}
              </p>
            )}
            
            {weddingData?.venue_location && (
              <p className="text-lg flex items-center justify-center space-x-2" style={{ color: theme.text }}>
                <MapPin className="w-5 h-5" />
                <span>{weddingData.venue_location}</span>
              </p>
            )}
          </div>

          {/* Countdown */}
          {timeLeft.days > 0 && (
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30 mb-12">
              <h2 className="text-2xl font-semibold mb-6" style={{ color: theme.primary }}>
                Counting Down to Our Special Day
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} className="text-center">
                    <div 
                      className="text-4xl md:text-5xl font-bold"
                      style={{ color: theme.accent }}
                    >
                      {value}
                    </div>
                    <div 
                      className="text-sm uppercase tracking-wide font-medium"
                      style={{ color: theme.textLight }}
                    >
                      {unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RSVP and Event Details Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => setActiveSection('rsvp')}
              className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ background: theme.gradientAccent }}
            >
              <Heart className="w-5 h-5 inline-block mr-2" />
              RSVP Now
            </button>
            <button
              className="px-8 py-4 rounded-full border-2 font-semibold transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: theme.accent,
                color: theme.accent,
                backgroundColor: 'transparent'
              }}
            >
              <Calendar className="w-5 h-5 inline-block mr-2" />
              Event Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Our Story Section Component
  const StorySection = () => (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
        <h2 
          className="text-3xl font-light mb-6 text-center"
          style={{ 
            fontFamily: theme.fontPrimary,
            color: theme.primary 
          }}
        >
          Our Love Story
        </h2>
        {weddingData?.their_story && (
          <p 
            className="text-lg leading-relaxed text-center max-w-3xl mx-auto"
            style={{ color: theme.text }}
          >
            {weddingData.their_story}
          </p>
        )}
        
        {/* Timeline */}
        {weddingData?.story_timeline && weddingData.story_timeline.length > 0 && (
          <div className="mt-12 space-y-8">
            {weddingData.story_timeline.map((stage, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div 
                  className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ background: theme.gradientAccent }}
                >
                  {stage.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: theme.primary }}>
                    {stage.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: theme.text }}>
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

      {/* Schedule */}
      {weddingData?.schedule_events && weddingData.schedule_events.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Wedding Day Schedule
            </h2>
            <div className="space-y-6">
              {weddingData.schedule_events.map((event, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/30 backdrop-blur-lg rounded-2xl">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: theme.gradientAccent }}
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: theme.primary }}>
                        {event.title}
                      </h3>
                      <span className="text-sm font-medium" style={{ color: theme.accent }}>
                        {event.time}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm mb-2" style={{ color: theme.text }}>
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm flex items-center space-x-1" style={{ color: theme.textLight }}>
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {weddingData?.gallery_photos && weddingData.gallery_photos.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Our Memories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {weddingData.gallery_photos.map((photo, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-lg rounded-2xl p-2 border border-white/40">
                  <img
                    src={photo.url}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wedding Party */}
      {((weddingData?.bridal_party && weddingData.bridal_party.length > 0) || 
        (weddingData?.groom_party && weddingData.groom_party.length > 0)) && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Our Wedding Party
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bridal Party */}
              {weddingData.bridal_party && weddingData.bridal_party.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: theme.accent }}>
                    Bridal Party
                  </h3>
                  <div className="space-y-4">
                    {weddingData.bridal_party.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white/30 backdrop-blur-lg rounded-2xl">
                        {member.photo && (
                          <img
                            src={typeof member.photo === 'string' ? member.photo : member.photo.url}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold" style={{ color: theme.primary }}>
                            {member.name}
                          </h4>
                          <p className="text-sm" style={{ color: theme.accent }}>
                            {member.role}
                          </p>
                          {member.description && (
                            <p className="text-sm mt-1" style={{ color: theme.text }}>
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Groom Party */}
              {weddingData.groom_party && weddingData.groom_party.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: theme.accent }}>
                    Groom's Party
                  </h3>
                  <div className="space-y-4">
                    {weddingData.groom_party.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white/30 backdrop-blur-lg rounded-2xl">
                        {member.photo && (
                          <img
                            src={typeof member.photo === 'string' ? member.photo : member.photo.url}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold" style={{ color: theme.primary }}>
                            {member.name}
                          </h4>
                          <p className="text-sm" style={{ color: theme.accent }}>
                            {member.role}
                          </p>
                          {member.description && (
                            <p className="text-sm mt-1" style={{ color: theme.text }}>
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

  // RSVP Section Component - Import RSVPPage
  const RSVPSection = () => {
    const RSVPPage = React.lazy(() => import('./RSVPPage'));
    
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <React.Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full" style={{ color: theme.accent }}></div>
              <span className="ml-3 text-lg" style={{ color: theme.text }}>Loading RSVP form...</span>
            </div>
          }>
            <RSVPPage />
          </React.Suspense>
        </div>
      </div>
    );
  };

  // Guestbook Section Component  
  const GuestbookSection = () => {
    const GuestbookPage = React.lazy(() => import('./GuestbookPage'));
    
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <React.Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-current border-t-transparent rounded-full" style={{ color: theme.accent }}></div>
              <span className="ml-3 text-lg" style={{ color: theme.text }}>Loading guestbook...</span>
            </div>
          }>
            <GuestbookPage isPrivate={true} isDashboard={false} />
          </React.Suspense>
        </div>
      </div>
    );
  };

  // Render content based on active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'story':
        return <StorySection />;
      case 'rsvp':
        return <RSVPSection />;
      case 'schedule':
        return <ScheduleSection />;
      case 'gallery':
        return <GallerySection />;
      case 'party':
        return <PartySection />;
      case 'guestbook':
        return <GuestbookSection />;
      case 'faq':
        return <FAQSection />;
      default:
        return <HomeSection />;
    }
  };

  // Schedule Section Component  
  const ScheduleSection = () => (
    <div className="pt-24 pb-16">
      {weddingData?.schedule_events && weddingData.schedule_events.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Wedding Day Schedule
            </h2>
            <div className="space-y-6">
              {weddingData.schedule_events.map((event, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white/30 backdrop-blur-lg rounded-2xl">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: theme.gradientAccent }}
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold" style={{ color: theme.primary }}>
                        {event.title}
                      </h3>
                      <span className="text-sm font-medium" style={{ color: theme.accent }}>
                        {event.time}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm mb-2" style={{ color: theme.text }}>
                        {event.description}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm flex items-center space-x-1" style={{ color: theme.textLight }}>
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Gallery Section Component
  const GallerySection = () => (
    <div className="pt-24 pb-16">
      {weddingData?.gallery_photos && weddingData.gallery_photos.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Our Memories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {weddingData.gallery_photos.map((photo, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-lg rounded-2xl p-2 border border-white/40">
                  <img
                    src={photo.url}
                    alt={`Memory ${index + 1}`}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Wedding Party Section Component
  const PartySection = () => (
    <div className="pt-24 pb-16">
      {((weddingData?.bridal_party && weddingData.bridal_party.length > 0) || 
        (weddingData?.groom_party && weddingData.groom_party.length > 0)) && (
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Our Wedding Party
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bridal Party */}
              {weddingData.bridal_party && weddingData.bridal_party.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: theme.accent }}>
                    Bridal Party
                  </h3>
                  <div className="space-y-4">
                    {weddingData.bridal_party.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white/30 backdrop-blur-lg rounded-2xl">
                        {member.photo && (
                          <img
                            src={typeof member.photo === 'string' ? member.photo : member.photo.url}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold" style={{ color: theme.primary }}>
                            {member.name}
                          </h4>
                          <p className="text-sm" style={{ color: theme.accent }}>
                            {member.role}
                          </p>
                          {member.description && (
                            <p className="text-sm mt-1" style={{ color: theme.text }}>
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Groom Party */}
              {weddingData.groom_party && weddingData.groom_party.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: theme.accent }}>
                    Groom's Party
                  </h3>
                  <div className="space-y-4">
                    {weddingData.groom_party.map((member, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white/30 backdrop-blur-lg rounded-2xl">
                        {member.photo && (
                          <img
                            src={typeof member.photo === 'string' ? member.photo : member.photo.url}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold" style={{ color: theme.primary }}>
                            {member.name}
                          </h4>
                          <p className="text-sm" style={{ color: theme.accent }}>
                            {member.role}
                          </p>
                          {member.description && (
                            <p className="text-sm mt-1" style={{ color: theme.text }}>
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // FAQ Section Component
  const FAQSection = () => (
    <div className="pt-24 pb-16">
      {weddingData?.faqs && weddingData.faqs.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30">
            <h2 
              className="text-3xl font-light mb-8 text-center"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {weddingData.faqs.map((faq, index) => (
                <div key={index} className="p-6 bg-white/30 backdrop-blur-lg rounded-2xl">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: theme.primary }}>
                    {faq.question}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Floating Template Button Component
  const FloatingTemplateButton = () => (
    <button
      onClick={() => navigate('/login')}
      className="fixed bottom-6 right-6 z-40 flex items-center space-x-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
      style={{
        background: theme.gradientAccent,
        color: 'white'
      }}
    >
      <Star className="w-6 h-6" />
      <span className="font-semibold hidden sm:inline">Use This Template</span>
      <span className="font-semibold sm:hidden">Get Template</span>
    </button>
  );

  return (
    <div 
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${theme.secondary}80 0%, ${theme.background}90 50%, ${theme.accent}10 100%)`,
        fontFamily: theme.fontSecondary
      }}
    >
      <Navigation />
      
      {/* Main Content */}
      <div className="relative">
        {renderActiveSection()}
      </div>

      {/* Footer */}
      <div className="text-center py-16">
        <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: theme.accent }} />
        <p className="text-lg" style={{ color: theme.textLight }}>
          Thank you for celebrating with us!
        </p>
        <p className="text-sm mt-2" style={{ color: theme.textLight }}>
          {weddingData?.couple_name_1} & {weddingData?.couple_name_2}
        </p>
      </div>

      {/* Floating Template Button */}
      <FloatingTemplateButton />
    </div>
  );
};

export default PublicWeddingPage;