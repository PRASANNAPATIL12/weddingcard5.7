import React, { useState } from 'react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const GalleryPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const { weddingData } = useUserData();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Photos' },
    { id: 'engagement', name: 'Engagement' },
    { id: 'travels', name: 'Our Travels' },
    { id: 'family', name: 'With Family' },
    { id: 'friends', name: 'With Friends' }
  ];

  // Get photos from wedding data or use fallback photos if none are available
  const galleryPhotos = weddingData?.gallery_photos || [];
  
  // Fallback photos if no photos are added yet
  const fallbackPhotos = [
    {
      id: 'fallback1',
      url: "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=800&h=600&fit=crop",
      category: "engagement",
      title: "Engagement Session",
      description: "A beautiful engagement photo session",
      eventMessage: "The moment we knew we were meant to be together"
    },
    {
      id: 'fallback2',
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
      category: "travels",
      title: "Paris Adventure",
      description: "Our romantic trip to Paris",
      eventMessage: "Exploring the city of love together"
    },
    {
      id: 'fallback3',
      url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      category: "engagement",
      title: "Golden Hour",
      description: "Captured during golden hour",
      eventMessage: "When the light was just perfect"
    },
    {
      id: 'fallback4',
      url: "https://images.unsplash.com/photo-1597248374161-426f3d6f1f6b?w=800&h=600&fit=crop",
      category: "travels",
      title: "Santorini Sunset",
      description: "Watching the sunset in Santorini",
      eventMessage: "One of the most beautiful sunsets we've ever seen"
    },
    {
      id: 'fallback5',
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      category: "family",
      title: "Family Gathering",
      description: "Special moment with family",
      eventMessage: "Surrounded by the love of our families"
    },
    {
      id: 'fallback6',
      url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
      category: "friends",
      title: "With Our Gang",
      description: "Fun times with friends",
      eventMessage: "The friends who have been there through it all"
    }
  ];

  const photos = galleryPhotos.length > 0 ? galleryPhotos.map(photo => ({
    id: photo.id,
    src: photo.url,
    category: photo.category,
    title: photo.title,
    description: photo.description,
    eventMessage: photo.eventMessage
  })) : fallbackPhotos.map(photo => ({
    id: photo.id,
    src: photo.url,
    category: photo.category,
    title: photo.title,
    description: photo.description,
    eventMessage: photo.eventMessage
  }));

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const openLightbox = (photo) => {
    setSelectedImage(photo);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredPhotos.findIndex(photo => photo.id === selectedImage.id);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredPhotos.length
      : (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedImage(filteredPhotos[newIndex]);
  };

  return (
    <div 
      className="min-h-screen pt-20 pb-16 px-8"
      style={{ background: theme.gradientPrimary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Our Gallery
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            Capturing precious moments from our journey together. Each photo tells a story of love, laughter, and the beautiful memories we've created.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 ${
                selectedCategory === category.id 
                  ? 'shadow-lg' 
                  : 'hover:shadow-lg'
              }`}
              style={{
                background: selectedCategory === category.id 
                  ? theme.gradientAccent 
                  : 'rgba(255,255,255,0.1)',
                color: selectedCategory === category.id 
                  ? theme.primary 
                  : theme.text,
                border: selectedCategory === category.id 
                  ? 'none' 
                  : `1px solid ${theme.accent}40`
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id}
              className="group cursor-pointer"
              onClick={() => openLightbox(photo)}
            >
              <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-semibold mb-2">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-sm mb-2 opacity-90">{photo.description}</p>
                  )}
                  {photo.eventMessage && (
                    <p className="text-xs mb-3 italic opacity-80">"{photo.eventMessage}"</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Click to view</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="relative max-w-5xl max-h-full">
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <X className="w-8 h-8" />
              </button>
              
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/30 rounded-full p-2"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 bg-black/30 rounded-full p-2"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-gray-200 text-sm mb-2">{selectedImage.description}</p>
                )}
                {selectedImage.eventMessage && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <p className="text-white text-sm italic">"{selectedImage.eventMessage}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;