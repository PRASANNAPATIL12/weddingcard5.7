import React from 'react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { Heart, Calendar, MapPin, Star } from 'lucide-react';

const StoryPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const { weddingData } = useUserData();
  const theme = themes[currentTheme];

  // Use dynamic timeline from wedding data, fallback to default if not available
  const timeline = weddingData.story_timeline || [];

  // If timeline is empty or story is disabled, show a message
  if (!timeline.length || weddingData.story_enabled === false) {
    return (
      <div 
        className="min-h-screen pt-20 pb-16 px-8 flex items-center justify-center"
        style={{ background: theme.gradientPrimary }}
      >
        <div className="text-center">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Our Love Story
          </h1>
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            {weddingData.story_enabled === false 
              ? "This section is currently disabled."
              : "No story timeline has been created yet. Please check back soon!"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-20 pb-16 px-8"
      style={{ background: theme.gradientPrimary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Our Love Story
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            Every love story is beautiful, but ours is our favorite. Here's how our journey began and the milestones that brought us to this magical moment.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full hidden md:block"
            style={{ background: `linear-gradient(to bottom, ${theme.accent}, transparent)` }}
          />

          {timeline.map((item, index) => (
            <div key={index} className="relative mb-16 md:mb-24">
              <div className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Content */}
                <div className="flex-1 md:w-1/2">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl"
                        style={{ 
                          background: theme.gradientAccent,
                          color: theme.primary
                        }}
                      >
                        {item.year}
                      </div>
                      <Heart 
                        className="w-6 h-6"
                        style={{ color: theme.accent }}
                      />
                    </div>
                    
                    <h3 
                      className="text-2xl font-semibold mb-4"
                      style={{ 
                        fontFamily: theme.fontPrimary,
                        color: theme.primary 
                      }}
                    >
                      {item.title}
                    </h3>
                    
                    <p 
                      className="text-lg leading-relaxed"
                      style={{ color: theme.textLight }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div 
                    className="w-6 h-6 rounded-full border-4 border-white"
                    style={{ background: theme.accent }}
                  />
                </div>

                {/* Image */}
                <div className="flex-1 md:w-1/2">
                  <div className="relative overflow-hidden rounded-3xl aspect-[4/3] group">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="text-center mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <Star 
              className="w-12 h-12 mx-auto mb-6"
              style={{ color: theme.accent }}
            />
            <blockquote 
              className="text-3xl font-light italic mb-6 max-w-4xl mx-auto leading-relaxed"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage."
            </blockquote>
            <cite 
              className="text-lg font-medium"
              style={{ color: theme.textLight }}
            >
              — Lao Tzu
            </cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;