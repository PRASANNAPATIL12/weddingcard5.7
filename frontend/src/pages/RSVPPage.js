import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { Heart, Users, Mail, Phone, Check, AlertCircle } from 'lucide-react';

const RSVPPage = () => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const { weddingData } = useUserData();
  const { shareableId } = useParams();
  
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    attendance: '',
    guest_count: 1,
    dietary_restrictions: '',
    special_message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Determine wedding_id - could be from URL param, current wedding data, or public page data
      const wedding_id = shareableId || weddingData?.id || weddingData?.shareable_id;
      
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          wedding_id: wedding_id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || 'Failed to submit RSVP. Please try again.');
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
      setError('Failed to submit RSVP. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 pt-20">
        <div className="text-center max-w-2xl mx-auto">
          <div 
            className="w-24 h-24 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{ background: theme.gradientAccent }}
          >
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 
            className="text-5xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            Thank You!
          </h1>
          <p 
            className="text-xl leading-relaxed mb-8"
            style={{ color: theme.textLight }}
          >
            Your RSVP has been received. We're so excited to celebrate with you on our special day!
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-8 py-4 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1"
            style={{
              background: theme.gradientAccent,
              color: theme.primary
            }}
          >
            Submit Another RSVP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-20 pb-16 px-8"
      style={{ background: theme.gradientPrimary }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 
            className="text-6xl font-light mb-6"
            style={{ 
              fontFamily: theme.fontPrimary,
              color: theme.primary 
            }}
          >
            RSVP
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: theme.textLight }}
          >
            We can't wait to celebrate with you! Please let us know if you'll be joining us on our special day.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  name="guest_name"
                  required
                  value={formData.guest_name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300"
                  style={{ 
                    color: theme.text,
                    borderColor: `${theme.accent}40`
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.textLight }} />
                  <input
                    type="email"
                    name="guest_email"
                    required
                    value={formData.guest_email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300"
                    style={{ 
                      color: theme.text,
                      borderColor: `${theme.accent}40`
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.textLight }} />
                  <input
                    type="tel"
                    name="guest_phone"
                    value={formData.guest_phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300"
                    style={{ 
                      color: theme.text,
                      borderColor: `${theme.accent}40`
                    }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Will you be attending? *
                </label>
                <select
                  name="attendance"
                  required
                  value={formData.attendance}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300"
                  style={{ 
                    color: theme.text,
                    borderColor: `${theme.accent}40`
                  }}
                >
                  <option value="">Please select</option>
                  <option value="yes">Joyfully accepts</option>
                  <option value="no">Regretfully declines</option>
                </select>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Number of Guests
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.textLight }} />
                  <select
                    name="guest_count"
                    value={formData.guest_count}
                    onChange={handleChange}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300"
                    style={{ 
                      color: theme.text,
                      borderColor: `${theme.accent}40`
                    }}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests</option>
                  </select>
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300"
                  style={{ 
                    color: theme.text,
                    borderColor: `${theme.accent}40`
                  }}
                  placeholder="Any allergies or dietary needs?"
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-semibold tracking-wider mb-3"
                style={{ color: theme.text }}
              >
                Special Message for the Couple
              </label>
              <textarea
                name="special_message"
                value={formData.special_message}
                onChange={handleChange}
                rows={4}
                className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 resize-none"
                style={{ 
                  color: theme.text,
                  borderColor: `${theme.accent}40`
                }}
                placeholder={`Share your well wishes with ${weddingData?.couple_name_1 || 'the couple'} & ${weddingData?.couple_name_2 || ''}...`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 px-12 py-4 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: theme.gradientAccent,
                  color: theme.primary,
                  boxShadow: `0 10px 30px ${theme.accent}30`
                }}
              >
                <Heart className="w-5 h-5" />
                {submitting ? 'Submitting...' : 'Submit RSVP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RSVPPage;