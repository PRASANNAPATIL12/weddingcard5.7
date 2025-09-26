import React from 'react';
import { useAppTheme } from '../App';
import { Gift, ExternalLink, Heart, Star, Home, Coffee } from 'lucide-react';

const RegistryPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];

  const registries = [
    {
      store: "Williams Sonoma",
      description: "For all our kitchen and cooking needs as we start our married life together.",
      url: "https://www.williams-sonoma.com",
      icon: Coffee,
      color: "#E8B4B8"
    },
    {
      store: "Crate & Barrel",
      description: "Home essentials and beautiful pieces to make our house a home.",
      url: "https://www.crateandbarrel.com",
      icon: Home,
      color: "#A8C8EC"
    },
    {
      store: "Amazon",
      description: "Everything else we need for our new adventure together.",
      url: "https://www.amazon.com",
      icon: Gift,
      color: "#F4C2A1"
    }
  ];

  const giftIdeas = [
    {
      category: "Kitchen & Dining",
      items: [
        "Stand Mixer",
        "High-Quality Knife Set",
        "Dinnerware Set",
        "Wine Glasses",
        "Coffee Maker"
      ]
    },
    {
      category: "Home & Decor",
      items: [
        "Throw Pillows",
        "Candles & Holders",
        "Picture Frames",
        "Artwork",
        "Plants & Planters"
      ]
    },
    {
      category: "Experiences",
      items: [
        "Date Night Vouchers",
        "Cooking Classes",
        "Wine Tasting",
        "Travel Fund",
        "Spa Day"
      ]
    }
  ];

  const weddingFund = {
    title: "Honeymoon Fund",
    description: "Help us create unforgettable memories on our honeymoon to Japan. Every contribution, big or small, means the world to us!",
    destination: "Tokyo & Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=400&fit=crop"
  };

  return (
    <div 
      className="min-h-screen pt-20 pb-16 px-8"
      style={{ background: theme.gradientPrimary }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Gift Registry
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            Your presence at our wedding is the greatest gift of all! If you'd like to help us start our married life together, here are some things we'd love.
          </p>
        </div>

        {/* Honeymoon Fund */}
        <section className="mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-2xl">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={weddingFund.image}
                  alt={weddingFund.destination}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: theme.gradientAccent }}
                  >
                    <Heart className="w-6 h-6" style={{ color: theme.primary }} />
                  </div>
                  <h2 
                    className="text-3xl font-semibold"
                    style={{ 
                      fontFamily: theme.fontPrimary,
                      color: theme.primary 
                    }}
                  >
                    {weddingFund.title}
                  </h2>
                </div>
                
                <p 
                  className="text-lg leading-relaxed mb-6"
                  style={{ color: theme.textLight }}
                >
                  {weddingFund.description}
                </p>
                
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5" style={{ color: theme.accent }} />
                  <span 
                    className="font-medium"
                    style={{ color: theme.text }}
                  >
                    Destination: {weddingFund.destination}
                  </span>
                </div>
                
                <button
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-xl self-start"
                  style={{
                    background: theme.gradientAccent,
                    color: theme.primary
                  }}
                >
                  <Gift className="w-5 h-5" />
                  Contribute to Honeymoon
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Registry Stores */}
        <section className="mb-16">
          <h2 
            className="text-4xl font-light text-center mb-12"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Our Registries
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {registries.map((registry, index) => {
              const Icon = registry.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl text-center"
                >
                  <div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: registry.color }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 
                    className="text-2xl font-semibold mb-4"
                    style={{ 
                      fontFamily: theme.fontPrimary,
                      color: theme.primary 
                    }}
                  >
                    {registry.store}
                  </h3>
                  
                  <p 
                    className="text-lg leading-relaxed mb-8"
                    style={{ color: theme.textLight }}
                  >
                    {registry.description}
                  </p>
                  
                  <button
                    onClick={() => window.open(registry.url, '_blank')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      background: theme.gradientAccent,
                      color: theme.primary
                    }}
                  >
                    View Registry
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gift Ideas */}
        <section>
          <h2 
            className="text-4xl font-light text-center mb-12"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Gift Ideas by Category
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {giftIdeas.map((category, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <h3 
                  className="text-2xl font-semibold mb-6 text-center"
                  style={{ 
                    fontFamily: theme.fontPrimary,
                    color: theme.primary 
                  }}
                >
                  {category.category}
                </h3>
                
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li 
                      key={itemIndex}
                      className="flex items-center gap-3 text-lg"
                    >
                      <div 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: theme.accent }}
                      />
                      <span style={{ color: theme.textLight }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Thank You Note */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <Heart 
              className="w-16 h-16 mx-auto mb-6"
              style={{ color: theme.accent }}
            />
            <p 
              className="text-2xl font-light italic leading-relaxed max-w-3xl mx-auto"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              "The best gifts are those that come from the heart. Thank you for being part of our special day and for your thoughtfulness."
            </p>
            <p 
              className="text-lg mt-6 font-medium"
              style={{ color: theme.textLight }}
            >
              With love and gratitude,<br />
              Sarah & Michael
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistryPage;