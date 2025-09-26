import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  HelpCircle,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';

const FAQAdmin = ({ weddingData, onSave, theme }) => {
  const [faqs, setFaqs] = useState(weddingData?.faqs || []);
  const [editingFaq, setEditingFaq] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize with default FAQs if none exist
  useEffect(() => {
    if (!weddingData?.faqs || weddingData.faqs.length === 0) {
      const defaultFaqs = [
        {
          id: 'default-1',
          question: "What should I wear?",
          answer: "We're having a garden ceremony, so we recommend cocktail attire. Ladies, consider comfortable shoes for outdoor surfaces."
        },
        {
          id: 'default-2', 
          question: "Will there be parking available?",
          answer: "Yes, there is complimentary valet parking available at the venue entrance."
        },
        {
          id: 'default-3',
          question: "Can I bring a guest?",
          answer: "Please check your invitation for guest details. If you have any questions, feel free to reach out to us directly."
        },
        {
          id: 'default-4',
          question: "Is the venue accessible?",
          answer: "Yes, our venue is fully wheelchair accessible with ramps and accessible restroom facilities."
        }
      ];
      setFaqs(defaultFaqs);
      // Auto-save default FAQs
      handleSaveToBackend(defaultFaqs);
    } else {
      setFaqs(weddingData.faqs);
    }
  }, [weddingData]);

  const handleAddFaq = () => {
    const newFaq = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    };
    setEditingFaq(newFaq);
    setIsAddingNew(true);
    setExpandedCard(newFaq.id);
  };

  const handleEditFaq = (faq) => {
    setEditingFaq({ ...faq });
    setIsAddingNew(false);
    setExpandedCard(faq.id);
  };

  const handleSaveFaq = () => {
    if (!editingFaq.question.trim() || !editingFaq.answer.trim()) {
      alert('Please fill in both question and answer fields');
      return;
    }

    let updatedFaqs;
    
    if (isAddingNew) {
      updatedFaqs = [...faqs, editingFaq];
    } else {
      updatedFaqs = faqs.map(faq => 
        faq.id === editingFaq.id ? editingFaq : faq
      );
    }

    setFaqs(updatedFaqs);
    setEditingFaq(null);
    setIsAddingNew(false);
    setExpandedCard(null);
    setHasChanges(true);
    
    // Save to backend immediately
    handleSaveToBackend(updatedFaqs);
  };

  const handleDeleteFaq = (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    const updatedFaqs = faqs.filter(faq => faq.id !== faqId);
    setFaqs(updatedFaqs);
    setHasChanges(true);
    
    // If we're editing the deleted FAQ, clear the editing state
    if (editingFaq && editingFaq.id === faqId) {
      setEditingFaq(null);
      setIsAddingNew(false);
      setExpandedCard(null);
    }
    
    // Save to backend immediately
    handleSaveToBackend(updatedFaqs);
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
    setIsAddingNew(false);
    setExpandedCard(null);
  };

  const handleSaveToBackend = async (faqsToSave) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/wedding/faq`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          faqs: faqsToSave
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update parent component
        onSave({ faqs: faqsToSave });
        setHasChanges(false);
      } else {
        console.error('Failed to save FAQs:', data);
      }
    } catch (error) {
      console.error('Error saving FAQs:', error);
    }
  };

  const toggleCard = (faqId) => {
    if (editingFaq && editingFaq.id === faqId) {
      // If currently editing this card, don't collapse
      return;
    }
    setExpandedCard(expandedCard === faqId ? null : faqId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: theme.primary }}>
            FAQ Management
          </h3>
          <p className="text-sm" style={{ color: theme.textLight }}>
            Manage frequently asked questions for your wedding guests.
          </p>
        </div>
        
        {/* Enable Section Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium" style={{ color: theme.text }}>
            Enable Section
          </span>
          <button
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
              faqs.length > 0 ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform transition-transform duration-200 bg-white rounded-full ${
                faqs.length > 0 ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Add New FAQ Button */}
      {!editingFaq && (
        <button
          onClick={handleAddFaq}
          className="w-full py-3 border-2 border-dashed rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          <Plus className="w-5 h-5" />
          Add New FAQ
        </button>
      )}

      {/* FAQ Cards */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {faqs.map((faq) => {
          const isExpanded = expandedCard === faq.id;
          const isEditing = editingFaq && editingFaq.id === faq.id;
          
          return (
            <div 
              key={faq.id}
              className="bg-white rounded-xl shadow-md border border-white/20 overflow-hidden transition-all duration-300"
            >
              {/* Card Header */}
              <div 
                className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${
                  isExpanded ? 'bg-white/5' : ''
                }`}
                onClick={() => !isEditing && toggleCard(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <HelpCircle className="w-5 h-5" style={{ color: theme.accent }} />
                    <span 
                      className="font-medium text-sm line-clamp-1"
                      style={{ color: theme.text }}
                    >
                      {faq.question || 'New Question'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditFaq(faq);
                          }}
                          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit3 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaq(faq.id);
                          }}
                          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                    
                    {!isEditing && (
                      isExpanded ? 
                        <ChevronUp className="w-4 h-4" style={{ color: theme.accent }} /> :
                        <ChevronDown className="w-4 h-4" style={{ color: theme.accent }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-white/10">
                  {isEditing ? (
                    // Edit Form
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                          Question *
                        </label>
                        <input
                          type="text"
                          value={editingFaq.question}
                          onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your question..."
                          style={{ color: theme.text }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                          Answer *
                        </label>
                        <textarea
                          value={editingFaq.answer}
                          onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows="4"
                          placeholder="Enter the answer..."
                          style={{ color: theme.text }}
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSaveFaq}
                          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Answer
                    <div className="p-6">
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: theme.textLight }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {faqs.length === 0 && !editingFaq && (
        <div className="text-center py-8">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No FAQs added yet</p>
        </div>
      )}
    </div>
  );
};

export default FAQAdmin;