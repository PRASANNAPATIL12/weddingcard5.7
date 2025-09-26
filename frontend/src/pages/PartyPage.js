import React from 'react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { Heart, Star, Crown, Users } from 'lucide-react';

const PartyPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const { weddingData } = useUserData();

  // Use dynamic data from context or fallback to default data
  const brideParty = weddingData?.bridal_party || [
    {
      name: "Emily Johnson",
      role: "Maid of Honor",
      relationship: "Sister & Best Friend",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b734?w=400&h=400&fit=crop&crop=face",
      description: "Sarah's older sister and lifelong confidante. Emily has been there through every milestone and couldn't be more excited to stand by Sarah's side."
    },
    {
      name: "Jessica Chen",
      role: "Bridesmaid",
      relationship: "College Roommate",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Met Sarah in freshman year and they've been inseparable ever since. Jessica brings laughter and adventure to every situation."
    },
    {
      name: "Amanda Rodriguez",
      role: "Bridesmaid",
      relationship: "Work Best Friend",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
      description: "Sarah's partner-in-crime at work who became family. Amanda is known for her infectious smile and unwavering loyalty."
    },
    {
      name: "Sophie Williams",
      role: "Bridesmaid",
      relationship: "Childhood Friend",
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&h=400&fit=crop&crop=face",
      description: "Friends since elementary school, Sophie knows all of Sarah's secrets and dreams. Their friendship has stood the test of time."
    }
  ];

  const groomParty = weddingData?.groom_party || [
    {
      name: "David Thompson",
      role: "Best Man",
      relationship: "Brother & Confidant",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Michael's younger brother and best friend. David has always looked up to Michael and is honored to be his best man on this special day."
    },
    {
      name: "Ryan Mitchell",
      role: "Groomsman",
      relationship: "College Buddy",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      description: "Michael's college roommate and adventure partner. Ryan introduced Michael to rock climbing and they've been conquering peaks together ever since."
    },
    {
      name: "James Park",
      role: "Groomsman",
      relationship: "Work Colleague",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Started as colleagues but quickly became close friends. James is Michael's go-to person for both professional advice and weekend golf games."
    },
    {
      name: "Alex Turner",
      role: "Groomsman",
      relationship: "Childhood Friend",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face",
      description: "Friends since they were kids in the same neighborhood. Alex and Michael have shared countless memories and adventures growing up together."
    }
  ];

  const specialRoles = weddingData?.special_roles || [
    {
      name: "Lily Johnson",
      role: "Flower Girl",
      relationship: "Sarah's Niece",
      age: "Age 6",
      image: "https://images.unsplash.com/photo-1518632651006-33c8c8e2f10e?w=400&h=400&fit=crop&crop=face",
      description: "Emily's daughter who brings joy and innocence to every gathering. She's beyond excited to spread flower petals down the aisle."
    },
    {
      name: "Oliver Thompson",
      role: "Ring Bearer",
      relationship: "Michael's Nephew",
      age: "Age 8",
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop&crop=face",
      description: "David's son who takes his ring bearer duties very seriously. He's been practicing his walk down the aisle for weeks."
    }
  ];

  const PartyMember = ({ member, isSpecial = false }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl text-center">
      <div className="relative mb-6">
        <div className="w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-white/30">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
        <div 
          className="absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: theme.gradientAccent }}
        >
          {member.role === 'Maid of Honor' || member.role === 'Best Man' ? (
            <Crown className="w-6 h-6" style={{ color: theme.primary }} />
          ) : isSpecial ? (
            <Star className="w-6 h-6" style={{ color: theme.primary }} />
          ) : (
            <Heart className="w-6 h-6" style={{ color: theme.primary }} />
          )}
        </div>
      </div>
      
      <h3 
        className="text-2xl font-semibold mb-2"
        style={{ 
          fontFamily: theme.fontPrimary,
          color: theme.primary 
        }}
      >
        {member.name}
      </h3>
      
      <div 
        className="text-lg font-medium mb-2"
        style={{ color: theme.accent }}
      >
        {member.role}
      </div>
      
      <div 
        className="text-sm font-medium mb-4 opacity-80"
        style={{ color: theme.text }}
      >
        {member.relationship} {member.age && `• ${member.age}`}
      </div>
      
      <p 
        className="text-sm leading-relaxed"
        style={{ color: theme.textLight }}
      >
        {member.description}
      </p>
    </div>
  );

  return (
    <div 
      className="min-h-screen pt-20 pb-16 px-8"
      style={{ background: theme.gradientPrimary }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Wedding Party
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            We're surrounded by the most amazing family and friends who have supported our journey. 
            Meet the special people who will be standing with us on our big day!
          </p>
        </div>

        {/* Bride's Party */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-4">
              <Heart className="w-8 h-8" style={{ color: theme.accent }} />
              <h2 
                className="text-4xl font-light"
                style={{ 
                  fontFamily: theme.fontPrimary,
                  color: theme.primary 
                }}
              >
                Bride's Party
              </h2>
              <Heart className="w-8 h-8" style={{ color: theme.accent }} />
            </div>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: theme.textLight }}
            >
              The wonderful women who have shaped Sarah's life and will stand by her side as she says "I do."
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brideParty.map((member, index) => (
              <PartyMember key={index} member={member} />
            ))}
          </div>
        </section>

        {/* Groom's Party */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-4">
              <Users className="w-8 h-8" style={{ color: theme.accent }} />
              <h2 
                className="text-4xl font-light"
                style={{ 
                  fontFamily: theme.fontPrimary,
                  color: theme.primary 
                }}
              >
                Groom's Party
              </h2>
              <Users className="w-8 h-8" style={{ color: theme.accent }} />
            </div>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: theme.textLight }}
            >
              The incredible men who have been Michael's support system and will stand proudly beside him on this momentous day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {groomParty.map((member, index) => (
              <PartyMember key={index} member={member} />
            ))}
          </div>
        </section>

        {/* Special Roles */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-4 mb-4">
              <Star className="w-8 h-8" style={{ color: theme.accent }} />
              <h2 
                className="text-4xl font-light"
                style={{ 
                  fontFamily: theme.fontPrimary,
                  color: theme.primary 
                }}
              >
                Special Roles
              </h2>
              <Star className="w-8 h-8" style={{ color: theme.accent }} />
            </div>
            <p 
              className="text-lg max-w-2xl mx-auto"
              style={{ color: theme.textLight }}
            >
              Our precious little ones who will add extra magic and joy to our ceremony.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {specialRoles.map((member, index) => (
              <PartyMember key={index} member={member} isSpecial={true} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PartyPage;