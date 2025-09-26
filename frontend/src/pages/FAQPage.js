import React, { useState } from 'react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { ChevronDown, ChevronUp, HelpCircle, MapPin, Clock, Users, Car, Utensils, Camera, Gift } from 'lucide-react';

const FAQPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const { weddingData } = useUserData();
  
  const [openFAQ, setOpenFAQ] = useState(null);

  // Use wedding data FAQs if available, otherwise use default structure
  const customFaqs = weddingData?.faqs || [];
  
  const defaultFaqs = [
    {
      category: "Wedding Details",
      icon: HelpCircle,
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
    },
    {
      category: "Location & Travel",
      icon: MapPin,
      questions: [
        {
          question: "What is the venue address?",
          answer: "Sunset Garden Estate is located at 1234 Vineyard Lane, Napa Valley, CA 94558. The venue is about a 10-minute drive from downtown Napa."
        },
        {
          question: "Is parking available?",
          answer: "Yes! Complimentary valet parking will be provided for all guests. Simply pull up to the main entrance and our attendants will take care of your vehicle."
        },
        {
          question: "Are there hotels nearby?",
          answer: "We have reserved room blocks at the Napa Valley Lodge and Marriott Napa Valley. Complimentary shuttle service will be provided from these hotels to the venue."
        }
      ]
    },
    {
      category: "Reception",
      icon: Utensils,
      questions: [
        {
          question: "What type of food will be served?",
          answer: "We'll be serving a three-course plated dinner featuring locally sourced ingredients. The menu includes options for various dietary restrictions including vegetarian, vegan, and gluten-free."
        },
        {
          question: "Will there be an open bar?",
          answer: "Yes! We'll have a full open bar throughout the cocktail hour and reception, featuring premium spirits, wine, beer, and signature cocktails created just for our special day."
        },
        {
          question: "Can I request a song for the reception?",
          answer: "Absolutely! When you RSVP, there's a section where you can request songs. We can't guarantee every request will be played, but we'll do our best to include your favorites!"
        }
      ]
    },
    {
      category: "RSVP & Guests",
      icon: Users,
      questions: [
        {
          question: "When is the RSVP deadline?",
          answer: "Please RSVP by April 15, 2025. This helps us provide an accurate headcount to our caterer and ensure we have adequate seating for everyone."
        },
        {
          question: "Can I bring a plus-one?",
          answer: "Plus-ones are indicated on your invitation. If your invitation includes 'and guest' or includes your partner's name, then yes! If you're unsure, please reach out to us directly."
        },
        {
          question: "Are children welcome?",
          answer: "We love your little ones, but we've decided to have an adult-only celebration to allow all our guests to relax and enjoy the evening. The only children present will be those in our wedding party."
        }
      ]
    },
    {
      category: "Special Accommodations",
      icon: Users,
      questions: [
        {
          question: "Is the venue wheelchair accessible?",
          answer: "Yes, Sunset Garden Estate is fully wheelchair accessible. All areas including restrooms, dining areas, and ceremony space are accessible. Please let us know if you need any special accommodations."
        },
        {
          question: "I have dietary restrictions. What should I do?",
          answer: "Please indicate any dietary restrictions or food allergies when you RSVP. Our catering team can accommodate most dietary needs including vegetarian, vegan, gluten-free, and other allergies."
        },
        {
          question: "What if I need to leave early?",
          answer: "We understand that circumstances may require early departure. Please let our wedding coordinator know so we can ensure you have easy access to valet parking and can exit gracefully."
        }
      ]
    },
    {
      category: "Photography & Social Media",
      icon: Camera,
      questions: [
        {
          question: "Can I take photos during the ceremony?",
          answer: "We'd prefer an unplugged ceremony so everyone can be fully present in the moment. Our professional photographer will capture everything beautifully, and we'll share photos after the wedding!"
        },
        {
          question: "Can I post photos on social media?",
          answer: "Yes! We'd love for you to share your favorite moments. Please use our wedding hashtag #SarahAndMichaelSayIDo so we can see all your wonderful posts!"
        },
        {
          question: "Will you have a photo booth?",
          answer: "Yes! We'll have a fun photo booth set up during the reception with props and instant prints. It's a great way to create memories and take home a keepsake from our special day."
        }
      ]
    },
    {
      category: "Gifts & Registry",
      icon: Gift,
      questions: [
        {
          question: "Do I need to bring a gift?",
          answer: "Your presence is the greatest gift! If you'd like to give a gift, we have registries at Williams Sonoma, Crate & Barrel, and Amazon. You can also contribute to our honeymoon fund."
        },
        {
          question: "When should I send my gift?",
          answer: "Gifts can be sent to our home address (available in your invitation) before the wedding, or brought to the reception. We have a designated gift table at the venue."
        },
        {
          question: "What if I can't attend but want to send a gift?",
          answer: "That's so thoughtful of you! Gifts can be shipped directly from our registry to our home address, or you can contribute to our honeymoon fund online anytime."
        }
      ]
    }
  ];

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  // Decide which FAQs to display - custom ones if available, otherwise defaults
  const displayFaqs = customFaqs.length > 0 ? customFaqs : defaultFaqs;
  const isCustomFaqs = customFaqs.length > 0;

  return (
    <div 
      className="min-h-screen pt-20 pb-16 px-8"
      style={{ background: theme.gradientPrimary }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Frequently Asked Questions
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            We've compiled answers to the most common questions about our wedding day. 
            If you don't find what you're looking for, please don't hesitate to reach out!
          </p>
        </div>

        {/* FAQ Display */}
        <div className="space-y-6">
          {isCustomFaqs ? (
            // Custom FAQs - Simple Q&A format
            displayFaqs.map((faq) => {
              const isOpen = openFAQ === faq.id;
              
              return (
                <div key={faq.id} className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                  >
                    <span 
                      className="text-lg font-medium pr-4"
                      style={{ color: theme.text }}
                    >
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: theme.accent }} />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: theme.accent }} />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 -mt-2">
                      <p 
                        className="text-lg leading-relaxed"
                        style={{ color: theme.textLight }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Default categorized FAQs
            displayFaqs.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={categoryIndex} className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden">
                {/* Category Header */}
                <div className="bg-white/5 p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: theme.gradientAccent }}
                    >
                      <Icon className="w-6 h-6" style={{ color: theme.primary }} />
                    </div>
                    <h2 
                      className="text-2xl font-semibold"
                      style={{ 
                        fontFamily: theme.fontPrimary,
                        color: theme.primary 
                      }}
                    >
                      {category.category}
                    </h2>
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-white/10">
                  {category.questions.map((faq, questionIndex) => {
                    const faqId = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openFAQ === faqId;

                    return (
                      <div key={questionIndex}>
                        <button
                          onClick={() => toggleFAQ(faqId)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                        >
                          <span 
                            className="text-lg font-medium pr-4"
                            style={{ color: theme.text }}
                          >
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: theme.accent }} />
                          ) : (
                            <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: theme.accent }} />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 pb-6 -mt-2">
                            <p 
                              className="text-lg leading-relaxed"
                              style={{ color: theme.textLight }}
                            >
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
            })
          )}
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <HelpCircle 
              className="w-16 h-16 mx-auto mb-6"
              style={{ color: theme.accent }}
            />
            <h3 
              className="text-3xl font-light mb-6"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Still Have Questions?
            </h3>
            <p 
              className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto"
              style={{ color: theme.textLight }}
            >
              Don't hesitate to reach out! We're here to help make sure you have all the information you need for our special day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:sarah.michael.wedding@email.com"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: theme.gradientAccent,
                  color: theme.primary
                }}
              >
                Email Us
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold tracking-wider border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;