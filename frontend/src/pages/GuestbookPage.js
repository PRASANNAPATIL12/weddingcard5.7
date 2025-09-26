import React, { useState, useEffect } from 'react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { Heart, MessageCircle, User, Send, Star, Loader } from 'lucide-react';

const GuestbookPage = ({ isPrivate = false, isDashboard = false }) => {
  const { themes, currentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const { weddingData, sessionId } = useUserData();
  
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: '',
    relationship: ''
  });

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get wedding ID for API calls - different logic for public vs private
  const weddingId = isPrivate ? (weddingData?.id || 'default') : 'public';

  useEffect(() => {
    fetchMessages();
  }, [weddingId]);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      let response;
      if (isPrivate && isDashboard) {
        // Private dashboard guestbook - get messages for user's specific wedding
        response = await fetch(`${backendUrl}/api/guestbook/private/${weddingId}`);
      } else if (isPrivate) {
        // Private wedding page (shareable link) - get messages for specific wedding
        response = await fetch(`${backendUrl}/api/guestbook/${weddingId}`);
      } else {
        // Public landing page guestbook - get all public messages
        response = await fetch(`${backendUrl}/api/guestbook/public/messages`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      
      let response;
      let requestBody;
      
      if (isPrivate && isDashboard) {
        // Private dashboard guestbook - send to private endpoint with session
        requestBody = {
          ...newMessage,
          session_id: sessionId
        };
        response = await fetch(`${backendUrl}/api/guestbook/private`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      } else {
        // Public guestbook or shareable wedding page
        requestBody = {
          ...newMessage,
          wedding_id: weddingId,
          is_public: !isPrivate
        };
        response = await fetch(`${backendUrl}/api/guestbook`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        setNewMessage({ name: '', message: '', relationship: '' });
        // Refresh messages to show the new one
        await fetchMessages();
        // Show success message without alert
        setError('');
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setNewMessage({
      ...newMessage,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

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
            Guestbook
          </h1>
          <div 
            className="w-24 h-0.5 mx-auto mb-8"
            style={{ background: theme.accent }}
          />
          <p 
            className="text-xl leading-relaxed max-w-3xl mx-auto"
            style={{ color: theme.textLight }}
          >
            Leave us a message of love, laughter, or your favorite memory with us. 
            Your words will become treasured keepsakes from our special day.
          </p>
        </div>

        {/* Message Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: theme.gradientAccent }}
            >
              <MessageCircle className="w-6 h-6" style={{ color: theme.primary }} />
            </div>
            <h2 
              className="text-3xl font-semibold"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Leave a Message
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-center">
                {error}
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Your Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-4 w-5 h-5 opacity-50" style={{ color: theme.textLight }} />
                  <input
                    type="text"
                    name="name"
                    required
                    value={newMessage.name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full pl-12 pr-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 disabled:opacity-50"
                    style={{ 
                      color: theme.text,
                      borderColor: `${theme.accent}40`
                    }}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label 
                  className="block text-sm font-semibold tracking-wider mb-3"
                  style={{ color: theme.text }}
                >
                  Your Relationship
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={newMessage.relationship}
                  onChange={handleChange}
                  disabled={submitting}
                  className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 disabled:opacity-50"
                  style={{ 
                    color: theme.text,
                    borderColor: `${theme.accent}40`
                  }}
                  placeholder="e.g., Friend, Family, Colleague"
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-semibold tracking-wider mb-3"
                style={{ color: theme.text }}
              >
                Your Message *
              </label>
              <textarea
                name="message"
                required
                value={newMessage.message}
                onChange={handleChange}
                disabled={submitting}
                rows={5}
                className="w-full px-6 py-4 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 resize-none disabled:opacity-50"
                style={{ 
                  color: theme.text,
                  borderColor: `${theme.accent}40`
                }}
                placeholder={`Share your thoughts, wishes, or favorite memories with ${weddingData?.couple_name_1 || 'Sarah'} & ${weddingData?.couple_name_2 || 'Michael'}...`}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background: theme.gradientAccent,
                  color: theme.primary
                }}
              >
                {submitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Messages Display */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Heart className="w-8 h-8" style={{ color: theme.accent }} />
            <h2 
              className="text-3xl font-semibold"
              style={{ 
                fontFamily: theme.fontPrimary,
                color: theme.primary 
              }}
            >
              Messages from Our Loved Ones
            </h2>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: theme.accent }} />
                <p className="text-lg" style={{ color: theme.text }}>Loading messages...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg mb-4" style={{ color: theme.text }}>Unable to load messages</p>
                <button
                  onClick={fetchMessages}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: theme.gradientAccent,
                    color: theme.primary
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: theme.textLight }} />
                <p className="text-lg mb-2" style={{ color: theme.text }}>No Messages Yet</p>
                <p className="text-sm opacity-70" style={{ color: theme.textLight }}>
                  Be the first to leave a message for {weddingData?.couple_name_1 || 'Sarah'} & {weddingData?.couple_name_2 || 'Michael'}!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg"
                      style={{ 
                        background: theme.gradientAccent,
                        color: theme.primary 
                      }}
                    >
                      {message.name.charAt(0)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <div>
                          <h3 
                            className="text-xl font-semibold"
                            style={{ color: theme.primary }}
                          >
                            {message.name}
                          </h3>
                          {message.relationship && (
                            <p 
                              className="text-sm opacity-80"
                              style={{ color: theme.textLight }}
                            >
                              {message.relationship}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <Star className="w-4 h-4" style={{ color: theme.accent }} />
                          <span 
                            className="text-sm"
                            style={{ color: theme.textLight }}
                          >
                            {formatDate(message.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      <p 
                        className="text-lg leading-relaxed"
                        style={{ color: theme.textLight }}
                      >
                        "{message.message}"
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
              "Thank you for sharing your love and warm wishes with us. Each message is a precious gift that we'll treasure forever."
            </p>
            <p 
              className="text-lg mt-6 font-medium"
              style={{ color: theme.textLight }}
            >
              With all our love,<br />
              {weddingData?.couple_name_1 || 'Sarah'} & {weddingData?.couple_name_2 || 'Michael'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestbookPage;