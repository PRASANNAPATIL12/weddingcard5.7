import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Heart, Edit2, Upload, Save, X } from 'lucide-react';
import LiquidBackground from './LiquidBackground';

const EditableWeddingCard = ({ weddingData, onDataChange, previewMode, theme }) => {
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Get wedding date for countdown
  const weddingDate = new Date(weddingData.wedding_date + 'T15:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
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
  }, [weddingDate]);

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = () => {
    onDataChange(editingField, tempValue);
    setEditingField(null);
    setTempValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onDataChange('background_image', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const EditableText = ({ field, value, className, style, placeholder, multiline = false }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="relative group">
        {isEditing ? (
          <div className="inline-flex items-center space-x-2">
            {multiline ? (
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-white/90 backdrop-blur-lg rounded-lg px-3 py-2 border-2 border-blue-300 focus:outline-none focus:border-blue-500 resize-none"
                style={style}
                autoFocus
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="bg-white/90 backdrop-blur-lg rounded-lg px-3 py-2 border-2 border-blue-300 focus:outline-none focus:border-blue-500"
                style={style}
                autoFocus
              />
            )}
            <button
              onClick={saveEdit}
              className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            className={`${className} cursor-pointer relative`}
            style={style}
            onClick={() => startEditing(field, value || placeholder)}
          >
            {value || placeholder}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-blue-500 text-white rounded-full p-1">
                <Edit2 className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const EditableDate = ({ field, value, className, style }) => {
    const isEditing = editingField === field;
    
    return (
      <div className="relative group">
        {isEditing ? (
          <div className="inline-flex items-center space-x-2">
            <input
              type="date"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="bg-white/90 backdrop-blur-lg rounded-lg px-3 py-2 border-2 border-blue-300 focus:outline-none focus:border-blue-500"
              style={style}
              autoFocus
            />
            <button
              onClick={saveEdit}
              className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            className={`${className} cursor-pointer relative`}
            style={style}
            onClick={() => startEditing(field, value)}
          >
            {formatDate(value)}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-blue-500 text-white rounded-full p-1">
                <Edit2 className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Hero Section */}
      <section className="relative min-h-screen text-center overflow-hidden pt-28 md:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0 group cursor-pointer" onClick={() => document.getElementById('bg-upload').click()}>
          <div 
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{
              backgroundImage: weddingData.background_image ? 
                `url(${weddingData.background_image})` : 
                'url(https://images.unsplash.com/photo-1606490194859-07c18c9f0968?w=1920&h=1080&fit=crop)',
              zIndex: -2
            }}
          />
          
          {/* Upload overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <div className="bg-white/90 backdrop-blur-lg rounded-lg p-4 flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Click to change background</span>
            </div>
          </div>
          
          <input
            type="file"
            id="bg-upload"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            className="hidden"
          />
        </div>
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(248, 246, 240, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
            zIndex: -2
          }}
        />
        
        <LiquidBackground />

        <div className="relative z-10 max-w-4xl px-8 animate-fade-in mx-auto mt-8 md:mt-48">
          {/* Names */}
          <h1 
            className="text-6xl md:text-8xl font-light tracking-wider mb-8 animate-slide-up"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            <EditableText
              field="couple_name_1"
              value={weddingData.couple_name_1}
              placeholder="Partner 1"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary,
                background: 'transparent',
                border: 'none'
              }}
            /> & <EditableText
              field="couple_name_2"
              value={weddingData.couple_name_2}
              placeholder="Partner 2"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary,
                background: 'transparent',
                border: 'none'
              }}
            />
          </h1>

          {/* Separator */}
          <div 
            className="w-24 h-0.5 mx-auto mb-8 animate-scale-in"
            style={{ background: theme.accent }}
          />

          {/* Wedding Date */}
          <h2 
            className="text-2xl md:text-3xl font-normal tracking-widest mb-4 animate-slide-up"
            style={{ 
              fontFamily: theme.fontSecondary,
              color: theme.text,
              animationDelay: '0.2s'
            }}
          >
            <EditableDate
              field="wedding_date"
              value={weddingData.wedding_date}
              style={{ 
                fontFamily: theme.fontSecondary,
                color: theme.text,
                background: 'transparent',
                border: 'none'
              }}
            />
          </h2>

          {/* Venue */}
          <p 
            className="text-lg md:text-xl font-light tracking-wide mb-12 animate-slide-up"
            style={{ 
              color: theme.textLight,
              animationDelay: '0.4s'
            }}
          >
            <EditableText
              field="venue_location"
              value={weddingData.venue_location}
              placeholder="Wedding Venue • Location"
              style={{ 
                color: theme.textLight,
                background: 'transparent',
                border: 'none'
              }}
            />
          </p>

          {/* Countdown */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-lg mx-auto">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="text-center p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 transition-transform duration-300 hover:-translate-y-2"
                >
                  <span 
                    className="block text-3xl md:text-4xl font-semibold mb-2"
                    style={{ color: theme.accent }}
                  >
                    {item.value}
                  </span>
                  <span 
                    className="text-sm uppercase tracking-wider opacity-80"
                    style={{ color: theme.text }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Link
              to="/rsvp"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: theme.gradientAccent,
                color: theme.primary,
                boxShadow: `0 10px 30px ${theme.accent}30`
              }}
            >
              <Heart className="w-5 h-5" />
              RSVP Now
            </Link>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                borderColor: theme.accent,
                color: theme.text,
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.accent;
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = theme.text;
              }}
            >
              <Calendar className="w-5 h-5" />
              Event Details
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section 
        className="py-24 px-8"
        style={{ background: theme.gradientPrimary }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 
            className="text-5xl font-light mb-8"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Join Us for Our Special Day
          </h2>

          <div className="mb-16">
            <EditableText
              field="their_story"
              value={weddingData.their_story}
              placeholder="Tell your love story here. Share what makes your relationship special and why you're excited to celebrate with your loved ones."
              className="text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: theme.textLight }}
              multiline={true}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Save the Date',
                text: `Mark your calendars for ${formatDate(weddingData.wedding_date)}. Ceremony begins at 3:00 PM, followed by cocktails and dinner reception.`
              },
              {
                icon: MapPin,
                title: 'Beautiful Venue',
                text: `${weddingData.venue_name || 'Our chosen venue'} provides the perfect romantic backdrop for our celebration.`
              },
              {
                icon: Heart,
                title: 'Love & Joy',
                text: 'Come celebrate love, laughter, and the beginning of our forever. Your presence will make our day complete.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl"
                >
                  <div 
                    className="text-5xl mb-6"
                    style={{ color: theme.accent }}
                  >
                    <Icon className="w-12 h-12 mx-auto" />
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
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditableWeddingCard;