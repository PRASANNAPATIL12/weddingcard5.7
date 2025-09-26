import React, { useState, useRef } from 'react';
import { useAppTheme } from '../App';
import { 
  X, Upload, Crop, Save, Heart, Calendar, MapPin, User, Phone, Mail, 
  Camera, Scissors, RotateCcw, Plus, Trash2, ChevronLeft, ChevronRight,
  Palette, Type, Image as ImageIcon, Clock, Star, Gift, MessageCircle
} from 'lucide-react';

const TemplateCustomizer = ({ isOpen, onClose, onSave }) => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    brideName: '',
    groomName: '',
    weddingDate: '',
    ceremonyTime: '',
    venue: '',
    venueAddress: '',
    
    // Contact Info
    contactEmail: '',
    contactPhone: '',
    rsvpDeadline: '',
    
    // Story
    howWeMet: '',
    firstDate: '',
    proposalStory: '',
    favoriteMemory: '',
    
    // Images
    heroImage: null,
    couplePhotos: [],
    galleryPhotos: [],
    
    // Theme
    selectedTheme: currentTheme,
    customColors: {
      primary: theme.primary,
      accent: theme.accent,
      background: theme.background
    },
    
    // Additional Details
    dresscode: '',
    specialInstructions: '',
    hashtag: '',
    registryLinks: [],
    
    // Schedule
    schedule: [
      { time: '3:00 PM', event: 'Ceremony', location: '', description: '' },
      { time: '4:00 PM', event: 'Cocktail Hour', location: '', description: '' },
      { time: '6:00 PM', event: 'Reception Dinner', location: '', description: '' },
      { time: '8:00 PM', event: 'Dancing', location: '', description: '' }
    ],
    
    // Wedding Party
    brideParty: [],
    groomParty: [],
    
    // Registry
    registries: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [currentImageField, setCurrentImageField] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (field, subfield, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, subfield, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [subfield]: value } : item
      )
    }));
  };

  const addArrayItem = (field, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      setCurrentImageField(field);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setCropData({
          src: e.target.result,
          crop: { x: 0, y: 0, width: 100, height: 100 }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const applyCrop = () => {
    if (cropData && currentImageField) {
      setFormData(prev => ({
        ...prev,
        [currentImageField]: cropData.src
      }));
      setImagePreview(null);
      setCropData(null);
      setCurrentImageField(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving customization:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: User, color: '#3B82F6' },
    { id: 2, title: 'Wedding Details', icon: Calendar, color: '#8B5CF6' },
    { id: 3, title: 'Your Story', icon: Heart, color: '#EF4444' },
    { id: 4, title: 'Photos & Images', icon: Camera, color: '#F59E0B' },
    { id: 5, title: 'Schedule & Events', icon: Clock, color: '#10B981' },
    { id: 6, title: 'Customization', icon: Palette, color: '#F97316' }
  ];

  const currentStep = steps.find(s => s.id === step);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl"
        style={{ color: theme.text }}
      >
        {/* Header */}
        <div 
          className="p-4 sm:p-8 border-b border-gray-200 relative overflow-hidden"
          style={{ background: theme.gradientPrimary }}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  background: theme.accent,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1 min-w-0">
              <h2 
                className="text-2xl sm:text-4xl font-light mb-2 truncate"
                style={{ 
                  fontFamily: theme.fontPrimary,
                  color: theme.primary 
                }}
              >
                Customize Your Wedding Invitation
              </h2>
              <div className="flex items-center gap-2 text-sm sm:text-base">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: currentStep?.color }}
                >
                  {React.createElement(currentStep?.icon, { 
                    className: "w-4 h-4 text-white" 
                  })}
                </div>
                <span style={{ color: theme.textLight }}>
                  Step {step} of {steps.length}: {currentStep?.title}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-black/10 transition-all duration-200 ml-4"
              style={{ color: theme.text }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between mb-4 overflow-x-auto pb-2">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = stepItem.id === step;
                const isCompleted = stepItem.id < step;
                
                return (
                  <div 
                    key={stepItem.id}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 min-w-0 flex-1 ${
                      isActive ? 'scale-110' : isCompleted ? 'opacity-100' : 'opacity-50'
                    }`}
                    onClick={() => setStep(stepItem.id)}
                  >
                    <div 
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive || isCompleted ? 'shadow-lg transform -translate-y-1' : ''
                      }`}
                      style={{ 
                        background: isActive || isCompleted ? stepItem.color : 'rgba(255,255,255,0.2)',
                        color: 'white'
                      }}
                    >
                      <Icon className="w-3 h-3 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-center px-1 leading-tight">
                      {stepItem.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ 
                  width: `${(step / steps.length) * 100}%`,
                  background: currentStep?.color 
                }}
              >
                <div className="absolute inset-0 bg-white/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Bride's Name *
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                    <input
                      type="text"
                      value={formData.brideName}
                      onChange={(e) => handleInputChange('brideName', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                      style={{ borderColor: theme.accent + '40', focusBorderColor: theme.accent }}
                      placeholder="Enter bride's name"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Groom's Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                    <input
                      type="text"
                      value={formData.groomName}
                      onChange={(e) => handleInputChange('groomName', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                      style={{ borderColor: theme.accent + '40' }}
                      placeholder="Enter groom's name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                      style={{ borderColor: theme.accent + '40' }}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                      style={{ borderColor: theme.accent + '40' }}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Wedding Hashtag
                </label>
                <div className="relative">
                  <Star className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                  <input
                    type="text"
                    value={formData.hashtag}
                    onChange={(e) => handleInputChange('hashtag', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                    style={{ borderColor: theme.accent + '40' }}
                    placeholder="#YourWeddingHashtag"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Wedding Details */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Wedding Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                    <input
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                      style={{ borderColor: theme.accent + '40' }}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Ceremony Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                    <input
                      type="time"
                      value={formData.ceremonyTime}
                      onChange={(e) => handleInputChange('ceremonyTime', e.target.value)}
                      className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                      style={{ borderColor: theme.accent + '40' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Venue Name *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                    style={{ borderColor: theme.accent + '40' }}
                    placeholder="Beautiful Garden Estate"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Venue Address *
                </label>
                <textarea
                  value={formData.venueAddress}
                  onChange={(e) => handleInputChange('venueAddress', e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none"
                  style={{ borderColor: theme.accent + '40' }}
                  rows={3}
                  placeholder="123 Wedding Lane, City, State 12345"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    RSVP Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.rsvpDeadline}
                    onChange={(e) => handleInputChange('rsvpDeadline', e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                    style={{ borderColor: theme.accent + '40' }}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-semibold tracking-wider">
                    Dress Code
                  </label>
                  <select
                    value={formData.dresscode}
                    onChange={(e) => handleInputChange('dresscode', e.target.value)}
                    className="w-full px-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300"
                    style={{ borderColor: theme.accent + '40' }}
                  >
                    <option value="">Select dress code</option>
                    <option value="Casual">Casual</option>
                    <option value="Semi-Formal">Semi-Formal</option>
                    <option value="Formal">Formal</option>
                    <option value="Black Tie Optional">Black Tie Optional</option>
                    <option value="Black Tie">Black Tie</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none"
                  style={{ borderColor: theme.accent + '40' }}
                  rows={3}
                  placeholder="Any special instructions for guests..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Your Story */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  How We Met
                </label>
                <div className="relative">
                  <Heart className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                  <textarea
                    value={formData.howWeMet}
                    onChange={(e) => handleInputChange('howWeMet', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none"
                    style={{ borderColor: theme.accent + '40' }}
                    rows={3}
                    placeholder="Tell us about how you first met..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  First Date Story
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                  <textarea
                    value={formData.firstDate}
                    onChange={(e) => handleInputChange('firstDate', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none"
                    style={{ borderColor: theme.accent + '40' }}
                    rows={3}
                    placeholder="Share the story of your first date..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Proposal Story
                </label>
                <div className="relative">
                  <Star className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                  <textarea
                    value={formData.proposalStory}
                    onChange={(e) => handleInputChange('proposalStory', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none"
                    style={{ borderColor: theme.accent + '40' }}
                    rows={4}
                    placeholder="Tell us about the proposal..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Favorite Memory Together
                </label>
                <div className="relative">
                  <MessageCircle className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.accent }} />
                  <textarea
                    value={formData.favoriteMemory}
                    onChange={(e) => handleInputChange('favoriteMemory', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none"
                    style={{ borderColor: theme.accent + '40' }}
                    rows={3}
                    placeholder="Share your favorite memory as a couple..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos & Images */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.primary }}>
                  Upload Your Photos
                </h3>
                <p className="text-sm" style={{ color: theme.textLight }}>
                  Add beautiful photos to personalize your invitation
                </p>
              </div>

              {/* Hero Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Hero Background Image
                </label>
                <div 
                  className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 hover:border-solid cursor-pointer"
                  style={{ borderColor: theme.accent + '40' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.heroImage ? (
                    <div className="relative">
                      <img 
                        src={formData.heroImage} 
                        alt="Hero" 
                        className="w-full h-32 object-cover rounded-lg" 
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange('heroImage', null);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: theme.accent }} />
                      <p className="font-medium" style={{ color: theme.text }}>
                        Click to upload hero image
                      </p>
                      <p className="text-sm mt-1" style={{ color: theme.textLight }}>
                        Recommended: 1920x1080px
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('heroImage', e)}
                  className="hidden"
                />
              </div>

              {/* Gallery Images */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold tracking-wider">
                  Gallery Images (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.galleryPhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={photo} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg" 
                      />
                      <button
                        onClick={() => removeArrayItem('galleryPhotos', index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 hover:border-solid flex flex-col items-center justify-center min-h-24"
                    style={{ borderColor: theme.accent + '40' }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = (e) => {
                        const files = Array.from(e.target.files);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData(prev => ({
                              ...prev,
                              galleryPhotos: [...prev.galleryPhotos, event.target.result]
                            }));
                          };
                          reader.readAsDataURL(file);
                        });
                      };
                      input.click();
                    }}
                  >
                    <Plus className="w-6 h-6 mb-1" style={{ color: theme.accent }} />
                    <span className="text-xs" style={{ color: theme.textLight }}>Add Photos</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Schedule & Events */}
          {step === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.primary }}>
                  Wedding Day Schedule
                </h3>
                <p className="text-sm" style={{ color: theme.textLight }}>
                  Customize your wedding day timeline
                </p>
              </div>

              <div className="space-y-4">
                {formData.schedule.map((item, index) => (
                  <div key={index} className="bg-white/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium" style={{ color: theme.primary }}>
                        Event {index + 1}
                      </h4>
                      {formData.schedule.length > 1 && (
                        <button
                          onClick={() => removeArrayItem('schedule', index)}
                          className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textLight }}>
                          Time
                        </label>
                        <input
                          type="time"
                          value={item.time}
                          onChange={(e) => handleArrayInputChange('schedule', index, 'time', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 text-sm"
                          style={{ borderColor: theme.accent + '40' }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: theme.textLight }}>
                          Event Name
                        </label>
                        <input
                          type="text"
                          value={item.event}
                          onChange={(e) => handleArrayInputChange('schedule', index, 'event', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 text-sm"
                          style={{ borderColor: theme.accent + '40' }}
                          placeholder="Event name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textLight }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => handleArrayInputChange('schedule', index, 'location', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 text-sm"
                        style={{ borderColor: theme.accent + '40' }}
                        placeholder="Event location"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: theme.textLight }}>
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleArrayInputChange('schedule', index, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/50 border border-gray-200 focus:border-2 focus:outline-none transition-all duration-300 resize-none text-sm"
                        style={{ borderColor: theme.accent + '40' }}
                        rows={2}
                        placeholder="Event description"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => addArrayItem('schedule', { time: '', event: '', location: '', description: '' })}
                  className="w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:border-solid"
                  style={{ borderColor: theme.accent + '40', color: theme.accent }}
                >
                  <Plus className="w-5 h-5" />
                  Add Event
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Customization */}
          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.primary }}>
                  Final Customization
                </h3>
                <p className="text-sm" style={{ color: theme.textLight }}>
                  Choose your theme and review your invitation
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold tracking-wider mb-3">
                    Choose Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(themes).map(([key, themeData]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.selectedTheme === key ? 'ring-2 ring-offset-2' : ''
                        }`}
                        style={{
                          borderColor: formData.selectedTheme === key ? themeData.accent : 'transparent',
                          background: themeData.gradientPrimary,
                          ringColor: themeData.accent
                        }}
                        onClick={() => handleInputChange('selectedTheme', key)}
                      >
                        <div className="text-center">
                          <div 
                            className="w-8 h-8 rounded-full mx-auto mb-2"
                            style={{ background: themeData.accent }}
                          />
                          <h4 className="font-medium capitalize" style={{ color: themeData.primary }}>
                            {key}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview Section */}
                <div className="bg-white/20 rounded-xl p-6">
                  <h4 className="font-semibold mb-4" style={{ color: theme.primary }}>
                    Preview
                  </h4>
                  <div className="bg-white/50 rounded-lg p-4 text-center">
                    <h2 
                      className="text-2xl font-light mb-2"
                      style={{ 
                        fontFamily: themes[formData.selectedTheme].fontPrimary,
                        color: themes[formData.selectedTheme].primary 
                      }}
                    >
                      {formData.brideName || 'Bride'} & {formData.groomName || 'Groom'}
                    </h2>
                    <div 
                      className="w-16 h-0.5 mx-auto mb-2"
                      style={{ background: themes[formData.selectedTheme].accent }}
                    />
                    <p style={{ color: themes[formData.selectedTheme].textLight }}>
                      {formData.weddingDate ? new Date(formData.weddingDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Wedding Date'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: themes[formData.selectedTheme].textLight }}>
                      {formData.venue || 'Wedding Venue'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Image Crop Modal */}
          {imagePreview && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold">Crop Image</h3>
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setCropData(null);
                      setCurrentImageField(null);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="relative max-h-96 overflow-hidden rounded-lg">
                    <img 
                      src={imagePreview} 
                      alt="Crop preview" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-4">
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setCropData(null);
                        setCurrentImageField(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={applyCrop}
                      className="px-4 py-2 text-white rounded-lg transition-colors"
                      style={{ background: theme.accent }}
                    >
                      Apply Crop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-full font-semibold tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
            style={{
              background: step === 1 ? 'transparent' : 'rgba(0,0,0,0.1)',
              color: theme.text
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-3 order-1 sm:order-2">
            {step < steps.length ? (
              <button
                onClick={() => setStep(Math.min(steps.length, step + 1))}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 flex-1 sm:flex-initial"
                style={{
                  background: currentStep?.color,
                  color: 'white'
                }}
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 flex-1 sm:flex-initial"
                style={{
                  background: theme.gradientAccent,
                  color: theme.primary
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create My Invitation
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCustomizer;