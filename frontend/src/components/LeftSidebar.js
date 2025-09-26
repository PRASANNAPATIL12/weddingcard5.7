import React, { useState, useRef, useEffect } from 'react';
import { useAppTheme } from '../App';
import { useUserData } from '../contexts/UserDataContext';
import { RSVPAdminContent } from '../pages/DashboardPage';
import FAQAdmin from './FAQAdmin';
import QRCodeGenerator from './QRCodeGenerator';
import ThemeManager from './ThemeManager';

// Clipboard utility function with fallback
const copyToClipboardWithFallback = async (text) => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch (error) {
    console.warn('Clipboard API failed, using fallback method:', error);
  }

  // Fallback method: Create temporary textarea element
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const result = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (!result) {
      throw new Error('execCommand copy failed');
    }
  } catch (fallbackError) {
    console.error('All clipboard methods failed:', fallbackError);
    // Show user a manual copy option
    const userPrompt = prompt('Copy this URL manually:', text);
    if (userPrompt !== null) {
      return; // User interaction completed
    }
    throw new Error('Failed to copy to clipboard');
  }
};
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Calendar, 
  Users, 
  Image, 
  Settings, 
  LogOut,
  Edit3,
  Mail,
  MessageCircle,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Save,
  MessageSquare,
  Share,
  QrCode,
  Link,
  Wand2,
  Eye,
  EyeOff,
  Download,
  Palette,
  Clock,
  MapPin,
  Phone,
  Copy,
  CheckCircle,
  X
} from 'lucide-react';

// Our Story Manager Component
const OurStoryManager = ({ weddingData, onSave, theme }) => {
  const [storyTimeline, setStoryTimeline] = useState(weddingData?.story_timeline || []);
  const [editingStage, setEditingStage] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddStage = () => {
    setEditingStage({
      id: Date.now().toString(),
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      image: ''
    });
    setIsAddingNew(true);
  };

  const handleEditStage = (stage, index) => {
    setEditingStage({ ...stage, index });
    setIsAddingNew(false);
  };

  const handleSaveStage = () => {
    if (!editingStage.year || !editingStage.title) {
      alert('Please fill in year and title fields');
      return;
    }

    const updatedTimeline = [...storyTimeline];
    
    if (isAddingNew) {
      updatedTimeline.push({
        year: editingStage.year,
        title: editingStage.title,
        description: editingStage.description,
        image: editingStage.image
      });
    } else {
      const index = editingStage.index;
      if (index !== undefined && updatedTimeline[index]) {
        updatedTimeline[index] = {
          year: editingStage.year,
          title: editingStage.title,
          description: editingStage.description,
          image: editingStage.image
        };
      }
    }

    setStoryTimeline(updatedTimeline);
    setEditingStage(null);
    setIsAddingNew(false);
    
    // Save to backend immediately when user clicks save
    onSave({ story_timeline: updatedTimeline });
  };

  const handleDeleteStage = (index) => {
    if (!window.confirm('Are you sure you want to remove this story stage?')) return;
    
    const updatedTimeline = storyTimeline.filter((_, i) => i !== index);
    setStoryTimeline(updatedTimeline);
    
    // Save to backend immediately after confirmation
    onSave({ story_timeline: updatedTimeline });
  };

  const handleCancelEdit = () => {
    setEditingStage(null);
    setIsAddingNew(false);
  };

  const StoryCard = ({ stage, index }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-golden text-white px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: theme.primary }}>
              {stage.year}
            </span>
            <h4 className="text-lg font-semibold" style={{ color: theme.text }}>{stage.title}</h4>
          </div>
          <p className="text-sm mb-3" style={{ color: theme.textLight }}>{stage.description}</p>
          
          {stage.image && (
            <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-200">
              <img 
                src={stage.image} 
                alt={stage.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">No Image</text></svg>';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => handleEditStage(stage, index)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit this story stage"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteStage(index)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete this story stage"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const StoryForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
        {isAddingNew ? 'Add New Story Stage' : 'Edit Story Stage'}
      </h4>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Year *
            </label>
            <input
              type="text"
              value={editingStage?.year || ''}
              onChange={(e) => setEditingStage({ ...editingStage, year: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="2019"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Title *
            </label>
            <input
              type="text"
              value={editingStage?.title || ''}
              onChange={(e) => setEditingStage({ ...editingStage, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., First Meeting, Engagement, etc."
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Description
          </label>
          <textarea
            value={editingStage?.description || ''}
            onChange={(e) => setEditingStage({ ...editingStage, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Tell the story of this milestone..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Image URL
          </label>
          <input
            type="url"
            value={editingStage?.image || ''}
            onChange={(e) => setEditingStage({ ...editingStage, image: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs mt-1" style={{ color: theme.textLight }}>
            Use a direct link to an image (jpg, png, etc.)
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSaveStage}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primary }}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={handleCancelEdit}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: theme.textLight }}>
        Create a beautiful timeline of your love story. Each stage represents a milestone in your relationship.
      </p>

      {/* Add New Stage Button */}
      {!editingStage && (
        <button
          onClick={handleAddStage}
          className="w-full py-3 border-2 border-dashed rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          <Plus className="w-5 h-5" />
          Add New Story Stage
        </button>
      )}

      {/* Story Form (Edit/Add) */}
      {editingStage && <StoryForm />}

      {/* Story Timeline */}
      <div className="space-y-4">
        {storyTimeline.length === 0 && !editingStage ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No story stages added yet</p>
          </div>
        ) : (
          storyTimeline.map((stage, index) => (
            <StoryCard key={index} stage={stage} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

// Wedding Party Manager Component
const WeddingPartyManager = ({ weddingData, onSave, theme }) => {
  const [activeTab, setActiveTab] = useState('bridal');
  const [bridalParty, setBridalParty] = useState(weddingData?.bridal_party || []);
  const [groomParty, setGroomParty] = useState(weddingData?.groom_party || []);
  const [specialRoles, setSpecialRoles] = useState(weddingData?.special_roles || []);
  const [editingPerson, setEditingPerson] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const tabs = [
    { id: 'bridal', label: 'Bride Party', data: bridalParty, setter: setBridalParty },
    { id: 'groom', label: 'Groom Party', data: groomParty, setter: setGroomParty },
    { id: 'special', label: 'Special Roles', data: specialRoles, setter: setSpecialRoles }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const handleAddPerson = () => {
    setEditingPerson({
      id: Date.now().toString(),
      name: '',
      designation: '',
      description: '',
      photo: ''
    });
    setIsAddingNew(true);
  };

  const handleEditPerson = (person) => {
    setEditingPerson({ ...person });
    setIsAddingNew(false);
  };

  const handleSavePerson = () => {
    if (!editingPerson.name || !editingPerson.designation) {
      alert('Please fill in name and role fields');
      return;
    }

    const updatedData = [...activeTabData.data];
    
    if (isAddingNew) {
      updatedData.push(editingPerson);
    } else {
      const index = updatedData.findIndex(p => p.id === editingPerson.id);
      if (index !== -1) {
        updatedData[index] = editingPerson;
      }
    }

    activeTabData.setter(updatedData);
    setEditingPerson(null);
    setIsAddingNew(false);
    
    // Save to backend immediately when user clicks save
    saveAllPartyDataToBackend(activeTab, updatedData);
  };

  const saveAllPartyDataToBackend = (changedTab, updatedData) => {
    const partyData = {
      bridal_party: changedTab === 'bridal' ? updatedData : bridalParty,
      groom_party: changedTab === 'groom' ? updatedData : groomParty,
      special_roles: changedTab === 'special' ? updatedData : specialRoles
    };
    onSave(partyData);
  };

  const handleDeletePerson = (personId) => {
    if (!window.confirm('Are you sure you want to remove this person?')) return;
    
    const updatedData = activeTabData.data.filter(p => p.id !== personId);
    activeTabData.setter(updatedData);
    
    // Save to backend immediately after confirmation
    saveAllPartyDataToBackend(activeTab, updatedData);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
    setIsAddingNew(false);
  };

  const handleTabSwitch = (newTab) => {
    // Don't switch tabs if user is currently editing - ask for confirmation
    if (editingPerson) {
      const shouldSwitch = window.confirm('You have unsaved changes. Do you want to discard them and switch tabs?');
      if (!shouldSwitch) return;
      
      // User chose to discard changes
      setEditingPerson(null);
      setIsAddingNew(false);
    }
    
    setActiveTab(newTab);
  };

  const PersonCard = ({ person }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-start">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
        {person.photo ? (
          <img src={person.photo} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <Users className="w-8 h-8 text-gray-500" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-lg" style={{ color: theme.text }}>{person.name}</h4>
        <p className="font-medium" style={{ color: theme.primary }}>{person.designation}</p>
        <p className="text-sm mt-1" style={{ color: theme.textLight }}>{person.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleEditPerson(person)}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <Edit3 className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={() => handleDeletePerson(person.id)}
          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );

  const PersonForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
        {isAddingNew ? 'Add New Person' : 'Edit Person'}
      </h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Name *
          </label>
          <input
            type="text"
            value={editingPerson?.name || ''}
            onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Role/Title *
          </label>
          <input
            type="text"
            value={editingPerson?.designation || ''}
            onChange={(e) => setEditingPerson({ ...editingPerson, designation: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Maid of Honor, Best Man, Flower Girl"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Relationship/Description
          </label>
          <textarea
            value={editingPerson?.description || ''}
            onChange={(e) => setEditingPerson({ ...editingPerson, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="e.g., Best friend since college, Sister, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Photo URL
          </label>
          <input
            type="url"
            value={editingPerson?.photo || ''}
            onChange={(e) => setEditingPerson({ ...editingPerson, photo: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/photo.jpg"
          />
          <p className="text-xs mt-1" style={{ color: theme.textLight }}>
            Use a direct link to an image (jpg, png, etc.)
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSavePerson}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primary }}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={handleCancelEdit}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabSwitch(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm'
                : 'hover:bg-gray-200'
            }`}
            style={{
              color: activeTab === tab.id ? theme.primary : theme.textLight
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add New Person Button */}
      {!editingPerson && (
        <button
          onClick={handleAddPerson}
          className="w-full py-3 border-2 border-dashed rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          <Plus className="w-5 h-5" />
          Add Person to {activeTabData.label}
        </button>
      )}

      {/* Person Form (Edit/Add) */}
      {editingPerson && <PersonForm />}

      {/* People List */}
      <div className="space-y-4">
        {activeTabData.data.length === 0 && !editingPerson ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No people added to {activeTabData.label} yet</p>
          </div>
        ) : (
          activeTabData.data.map((person) => (
            <PersonCard key={person.id || person.name} person={person} />
          ))
        )}
      </div>
    </div>
  );
};

// Gallery Manager Component
const GalleryManager = ({ weddingData, onSave, theme }) => {
  const [galleryPhotos, setGalleryPhotos] = useState(weddingData?.gallery_photos || []);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Photo categories/tags
  const photoCategories = [
    { id: 'all', name: 'All Photos', color: '#6366F1' },
    { id: 'engagement', name: 'Engagement', color: '#EC4899' },
    { id: 'travels', name: 'Our Travels', color: '#10B981' },
    { id: 'family', name: 'With Family', color: '#F59E0B' },
    { id: 'friends', name: 'With Friends', color: '#8B5CF6' }
  ];

  const handleAddPhoto = () => {
    setEditingPhoto({
      id: Date.now().toString(),
      url: '',
      title: '',
      description: '',
      category: 'all',
      eventMessage: ''
    });
    setIsAddingNew(true);
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto({ ...photo });
    setIsAddingNew(false);
  };

  const handleSavePhoto = () => {
    if (!editingPhoto.url || !editingPhoto.title) {
      alert('Please fill in URL and title fields');
      return;
    }

    const updatedPhotos = [...galleryPhotos];
    
    if (isAddingNew) {
      updatedPhotos.push(editingPhoto);
    } else {
      const index = updatedPhotos.findIndex(p => p.id === editingPhoto.id);
      if (index !== -1) {
        updatedPhotos[index] = editingPhoto;
      }
    }

    setGalleryPhotos(updatedPhotos);
    setEditingPhoto(null);
    setIsAddingNew(false);
    
    // Save to backend immediately when user clicks save
    onSave({ gallery_photos: updatedPhotos });
  };

  const handleDeletePhoto = (photoId) => {
    if (!window.confirm('Are you sure you want to remove this photo?')) return;
    
    const updatedPhotos = galleryPhotos.filter(p => p.id !== photoId);
    setGalleryPhotos(updatedPhotos);
    
    // Save to backend immediately after confirmation
    onSave({ gallery_photos: updatedPhotos });
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
    setIsAddingNew(false);
  };

  const getCategoryColor = (categoryId) => {
    const category = photoCategories.find(c => c.id === categoryId);
    return category ? category.color : '#6366F1';
  };

  const PhotoCard = ({ photo }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img 
          src={photo.url} 
          alt={photo.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect width="200" height="150" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="14">Invalid Image URL</text></svg>';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-lg" style={{ color: theme.text }}>{photo.title}</h4>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: getCategoryColor(photo.category) }}
          >
            {photoCategories.find(c => c.id === photo.category)?.name || 'All Photos'}
          </span>
        </div>
        
        {photo.description && (
          <p className="text-sm mb-2" style={{ color: theme.textLight }}>
            {photo.description}
          </p>
        )}
        
        {photo.eventMessage && (
          <div className="mb-3 p-2 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">{photo.eventMessage}</p>
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => handleEditPhoto(photo)}
            className="flex-1 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors text-blue-600 text-sm font-medium"
          >
            <Edit3 className="w-4 h-4 inline mr-1" />
            Edit
          </button>
          <button
            onClick={() => handleDeletePhoto(photo.id)}
            className="flex-1 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-600 text-sm font-medium"
          >
            <X className="w-4 h-4 inline mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  const PhotoForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
        {isAddingNew ? 'Add New Photo' : 'Edit Photo'}
      </h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Photo URL (PNG/JPG only) *
          </label>
          <input
            type="url"
            value={editingPhoto?.url || ''}
            onChange={(e) => setEditingPhoto({ ...editingPhoto, url: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://images.unsplash.com/photo-example.jpg"
          />
          <p className="text-xs mt-1" style={{ color: theme.textLight }}>
            Use a direct link to a PNG or JPG image
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Photo Title *
          </label>
          <input
            type="text"
            value={editingPhoto?.title || ''}
            onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Engagement Session, Paris Adventure"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Category Tag *
          </label>
          <select
            value={editingPhoto?.category || 'all'}
            onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {photoCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-xs mt-1" style={{ color: theme.textLight }}>
            Choose which section this photo belongs to in the gallery
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Photo Description
          </label>
          <textarea
            value={editingPhoto?.description || ''}
            onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            placeholder="Brief description of the photo..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Event Message
          </label>
          <textarea
            value={editingPhoto?.eventMessage || ''}
            onChange={(e) => setEditingPhoto({ ...editingPhoto, eventMessage: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="What message do you want to show about this moment/event?"
          />
        </div>
        
        {/* Image Preview */}
        {editingPhoto?.url && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Preview
            </label>
            <img
              src={editingPhoto.url}
              alt="Preview"
              className="w-32 h-24 object-cover rounded-lg border-2 shadow-md"
              style={{ borderColor: getCategoryColor(editingPhoto.category) }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="75" viewBox="0 0 100 75"><rect width="100" height="75" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="10">Invalid URL</text></svg>';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSavePhoto}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primary }}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={handleCancelEdit}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <p className="text-sm" style={{ color: theme.textLight }}>
        Add photos with URLs and organize them by category. Each photo can have a description and event message that will be displayed in the gallery.
      </p>

      {/* Add New Photo Button */}
      {!editingPhoto && (
        <button
          onClick={handleAddPhoto}
          className="w-full py-3 border-2 border-dashed rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          <Plus className="w-5 h-5" />
          Add New Photo
        </button>
      )}

      {/* Photo Form (Edit/Add) */}
      {editingPhoto && <PhotoForm />}

      {/* Photos Grid */}
      <div className="space-y-4">
        {galleryPhotos.length === 0 && !editingPhoto ? (
          <div className="text-center py-8">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No photos added yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {galleryPhotos.map((photo) => (
              <PhotoCard key={photo.id || photo.url} photo={photo} />
            ))}
          </div>
        )}
      </div>

      {/* Category Legend */}
      {galleryPhotos.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium mb-3" style={{ color: theme.text }}>
            Category Colors:
          </h5>
          <div className="flex flex-wrap gap-2">
            {photoCategories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs" style={{ color: theme.textLight }}>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Schedule Manager Component  
const ScheduleManager = ({ weddingData, onSave, theme }) => {
  const [scheduleEvents, setScheduleEvents] = useState(weddingData?.schedule_events || []);
  const [importantInfo, setImportantInfo] = useState(weddingData?.important_info || {});
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingInfoItem, setEditingInfoItem] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingInfo, setIsAddingInfo] = useState(false);

  const defaultInfoItems = [
    { id: 'dress_code', title: 'Dress Code', description: 'Formal/Black Tie Optional. We encourage elegant attire in garden-friendly footwear.', icon: 'Users' },
    { id: 'weather_plan', title: 'Weather Plan', description: 'Our venue has both indoor and covered outdoor spaces for any weather conditions.', icon: 'Calendar' },
    { id: 'transportation', title: 'Transportation', description: 'Complimentary shuttle service available from nearby hotels. Valet parking provided.', icon: 'MapPin' },
    { id: 'special_accommodations', title: 'Special Accommodations', description: 'Please let us know of any accessibility needs or dietary restrictions in your RSVP.', icon: 'Users' }
  ];

  const handleAddEvent = () => {
    setEditingEvent({
      id: Date.now().toString(),
      time: '12:00 PM',
      title: '',
      description: '',
      location: '',
      duration: '1 hour',
      date: weddingData?.wedding_date || '',
      highlight: false
    });
    setIsAddingEvent(true);
  };

  const handleEditEvent = (event, index) => {
    setEditingEvent({ ...event, index });
    setIsAddingEvent(false);
  };

  const handleSaveEvent = () => {
    if (!editingEvent.title || !editingEvent.time) {
      alert('Please fill in title and time fields');
      return;
    }

    const updatedEvents = [...scheduleEvents];
    
    if (isAddingEvent) {
      updatedEvents.push({
        id: editingEvent.id,
        time: editingEvent.time,
        title: editingEvent.title,
        description: editingEvent.description,
        location: editingEvent.location,
        duration: editingEvent.duration,
        date: editingEvent.date,
        highlight: editingEvent.highlight
      });
    } else {
      const index = editingEvent.index;
      if (index !== undefined && updatedEvents[index]) {
        updatedEvents[index] = {
          id: updatedEvents[index].id || Date.now().toString(),
          time: editingEvent.time,
          title: editingEvent.title,
          description: editingEvent.description,
          location: editingEvent.location,
          duration: editingEvent.duration,
          date: editingEvent.date,
          highlight: editingEvent.highlight
        };
      }
    }

    setScheduleEvents(updatedEvents);
    setEditingEvent(null);
    setIsAddingEvent(false);
    
    // Save to backend immediately
    onSave({ schedule_events: updatedEvents });
  };

  const handleDeleteEvent = (index) => {
    if (!window.confirm('Are you sure you want to remove this event?')) return;
    
    const updatedEvents = scheduleEvents.filter((_, i) => i !== index);
    setScheduleEvents(updatedEvents);
    
    // Save to backend immediately
    onSave({ schedule_events: updatedEvents });
  };

  const handleCancelEditEvent = () => {
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  // Important Information Management
  const handleAddInfoItem = () => {
    setEditingInfoItem({
      id: Date.now().toString(),
      title: '',
      description: '',
      enabled: true
    });
    setIsAddingInfo(true);
  };

  const handleEditInfoItem = (item) => {
    setEditingInfoItem({ ...item });
    setIsAddingInfo(false);
  };

  const handleSaveInfoItem = () => {
    if (!editingInfoItem.title) {
      alert('Please fill in the title field');
      return;
    }

    const updatedInfo = { ...importantInfo };
    updatedInfo[editingInfoItem.id] = {
      title: editingInfoItem.title,
      description: editingInfoItem.description,
      enabled: editingInfoItem.enabled
    };

    setImportantInfo(updatedInfo);
    setEditingInfoItem(null);
    setIsAddingInfo(false);
    
    // Save to backend immediately
    onSave({ important_info: updatedInfo });
  };

  const handleDeleteInfoItem = (itemId) => {
    if (!window.confirm('Are you sure you want to remove this information item?')) return;
    
    const updatedInfo = { ...importantInfo };
    delete updatedInfo[itemId];
    setImportantInfo(updatedInfo);
    
    // Save to backend immediately
    onSave({ important_info: updatedInfo });
  };

  const EventCard = ({ event, index }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: event.highlight ? theme.accent : '#e5e7eb' }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {event.highlight && (
              <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-yellow-500">
                Highlighted
              </span>
            )}
            <h4 className="text-lg font-semibold" style={{ color: theme.text }}>{event.title}</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: theme.accent }} />
              <span style={{ color: theme.textLight }}>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: theme.accent }} />
              <span style={{ color: theme.textLight }}>{event.date || 'No date set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: theme.accent }} />
              <span style={{ color: theme.textLight }}>Duration: {event.duration}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: theme.accent }} />
                <span style={{ color: theme.textLight }}>{event.location}</span>
              </div>
            )}
          </div>
          
          {event.description && (
            <p className="text-sm mb-3" style={{ color: theme.textLight }}>
              {event.description}
            </p>
          )}
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => handleEditEvent(event, index)}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit this event"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteEvent(index)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete this event"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const EventForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
        {isAddingEvent ? 'Add New Event' : 'Edit Event'}
      </h4>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Event Title *
            </label>
            <input
              type="text"
              value={editingEvent?.title || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Wedding Ceremony, Reception"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Time *
            </label>
            <input
              type="text"
              value={editingEvent?.time || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 2:00 PM"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Date
            </label>
            <input
              type="date"
              value={editingEvent?.date || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
              Duration
            </label>
            <input
              type="text"
              value={editingEvent?.duration || ''}
              onChange={(e) => setEditingEvent({ ...editingEvent, duration: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1 hour, 30 minutes"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Location
          </label>
          <input
            type="text"
            value={editingEvent?.location || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Main Hall, Garden Area"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Description
          </label>
          <textarea
            value={editingEvent?.description || ''}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Brief description of the event..."
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm" style={{ color: theme.text }}>
            <input
              type="checkbox"
              checked={editingEvent?.highlight || false}
              onChange={(e) => setEditingEvent({ ...editingEvent, highlight: e.target.checked })}
              className="rounded"
              style={{ accentColor: theme.accent }}
            />
            Highlight this event (makes it stand out in the timeline)
          </label>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSaveEvent}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: theme.primary }}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={handleCancelEditEvent}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const InfoCard = ({ item, itemId }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-3">
        <h5 className="font-semibold text-lg" style={{ color: theme.text }}>{item.title}</h5>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditInfoItem({ ...item, id: itemId })}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
            title="Edit this information"
          >
            <Edit3 className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteInfoItem(itemId)}
            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
            title="Delete this information"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      <p className="text-sm" style={{ color: theme.textLight }}>{item.description}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Schedule Events Section */}
      <div>
        <h4 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
          Wedding Day Timeline
        </h4>
        <p className="text-sm mb-6" style={{ color: theme.textLight }}>
          Create your wedding day schedule with events, times, and locations. Each card can be edited or removed individually.
        </p>

        {/* Add New Event Button */}
        {!editingEvent && (
          <button
            onClick={handleAddEvent}
            className="w-full py-3 mb-6 border-2 border-dashed rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            style={{ borderColor: theme.primary, color: theme.primary }}
          >
            <Plus className="w-5 h-5" />
            Add New Event
          </button>
        )}

        {/* Event Form (Edit/Add) */}
        {editingEvent && <EventForm />}

        {/* Events List */}
        <div className="space-y-4">
          {scheduleEvents.length === 0 && !editingEvent ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No events added yet</p>
            </div>
          ) : (
            scheduleEvents.map((event, index) => (
              <EventCard key={event.id || index} event={event} index={index} />
            ))
          )}
        </div>
      </div>

      {/* Important Information Section */}
      <div className="pt-6 border-t border-gray-200">
        <h4 className="text-lg font-semibold mb-4" style={{ color: theme.primary }}>
          Important Information
        </h4>
        <p className="text-sm mb-6" style={{ color: theme.textLight }}>
          Add important information for your guests like dress code, weather plan, transportation, etc.
        </p>

        {/* Important Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Default info items */}
          {defaultInfoItems.map((defaultItem) => {
            const savedItem = importantInfo[defaultItem.id];
            const item = savedItem || { title: defaultItem.title, description: defaultItem.description, enabled: true };
            
            return (
              <InfoCard key={defaultItem.id} item={item} itemId={defaultItem.id} />
            );
          })}
          
          {/* Custom info items */}
          {Object.entries(importantInfo).map(([itemId, item]) => {
            if (!defaultInfoItems.find(d => d.id === itemId)) {
              return (
                <InfoCard key={itemId} item={item} itemId={itemId} />
              );
            }
            return null;
          })}
        </div>

        {/* Add New Info Button */}
        <button
          onClick={handleAddInfoItem}
          className="w-full py-3 border-2 border-dashed rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          style={{ borderColor: theme.primary, color: theme.primary }}
        >
          <Plus className="w-5 h-5" />
          Add Custom Information
        </button>
      </div>
    </div>
  );
};

const LeftSidebar = () => {
  const { themes, currentTheme, setCurrentTheme } = useAppTheme();
  const theme = themes[currentTheme];
  const { 
    leftSidebarOpen, 
    setLeftSidebarOpen, 
    logout, 
    userInfo,
    isAuthenticated,
    weddingData,
    saveWeddingData 
  } = useUserData();

  const [activeSection, setActiveSection] = useState('info');
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [activeForm, setActiveForm] = useState(null);
  const modalRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef(null);

  const editSections = [
    { id: 'home', label: 'Home', icon: Heart, description: 'Edit couple names, date, venue' },
    { id: 'story', label: 'Our Story', icon: Heart, description: 'Timeline and love story' },
    { id: 'rsvp', label: 'RSVP', icon: Mail, description: 'RSVP form settings' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, description: 'Wedding day timeline' },
    { id: 'gallery', label: 'Gallery', icon: Image, description: 'Photo gallery' },
    { id: 'party', label: 'Wedding Party', icon: Users, description: 'Bridal and groom party' },
    { id: 'registry', label: 'Registry', icon: Gift, description: 'Gift registry links' },
    { id: 'guestbook', label: 'Guest Book', icon: MessageCircle, description: 'Guest messages' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Frequently asked questions' },
    { id: 'theme', label: 'Theme', icon: Settings, description: 'Classic, Modern, or Boho' }
  ];

  // Main sidebar sections - reorganized as requested
  const sidebarSections = [
    { id: 'info', label: 'Edit the Info', icon: Edit3, expandable: true, color: '#6366F1' },
    { id: 'whatsapp', label: 'Share via WhatsApp', icon: MessageSquare, color: '#25D366' },
    { id: 'gmail', label: 'Share via Gmail', icon: Mail, color: '#EA4335' },
    { id: 'qrcode', label: 'Get QR Code', icon: QrCode, color: '#6366F1' },
    { id: 'url', label: 'Get Shareable URL', icon: Link, color: '#3B82F6' },
    { id: 'ai', label: 'Generate Design with AI', icon: Wand2, color: '#8B5CF6' }
  ];

  // Handle click outside modal to auto-save immediately
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on a form input, button, or other interactive element
      const isInteractiveElement = event.target.tagName === 'INPUT' || 
                                 event.target.tagName === 'BUTTON' || 
                                 event.target.tagName === 'SELECT' || 
                                 event.target.tagName === 'TEXTAREA' ||
                                 event.target.closest('button') ||
                                 event.target.closest('input') ||
                                 event.target.closest('select') ||
                                 event.target.closest('textarea');
      
      // Only close modal if clicked outside and not on interactive elements
      if (modalRef.current && !modalRef.current.contains(event.target) && !isInteractiveElement) {
        if (activeForm) {
          // Immediate auto-save and close (no delay)
          setShowNotification(true);
          setActiveForm(null);
          setTimeout(() => {
            setShowNotification(false);
          }, 1500);
        }
      }
      
      // Handle sidebar click outside when expanded by hover
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !leftSidebarOpen && isHovering) {
        setIsHovering(false);
      }
    };

    if (activeForm) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    // Always listen for clicks outside sidebar when it's hovered open
    if (!leftSidebarOpen && isHovering) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [activeForm, leftSidebarOpen, isHovering]);

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && activeForm) {
      setActiveForm(null);
    }
  };

  const handleSectionClick = (sectionId) => {
    switch (sectionId) {
      case 'whatsapp':
      case 'gmail':
        handlePremiumFeature(sectionId);
        break;
      case 'qrcode':
        setActiveForm('qrcode-generator');
        break;
      case 'url':
        handlePremiumFeature(sectionId);
        break;
      case 'ai':
        setActiveForm('ai-design');
        break;
      default:
        break;
    }
  };

  const handlePremiumFeature = (featureId) => {
    // Get the system-generated custom URL from wedding data
    const shareableUrl = weddingData.custom_url 
      ? `${window.location.origin}/${weddingData.custom_url}`
      : `${window.location.origin}/wedding/${userInfo.userId}`;
    
    console.log('Shareable URL:', shareableUrl, 'Custom URL:', weddingData.custom_url);
    
    switch (featureId) {
      case 'whatsapp':
        const whatsappText = `Check out our wedding card! 💒✨ ${weddingData.couple_name_1} & ${weddingData.couple_name_2} are getting married on ${weddingData.wedding_date}! ${shareableUrl}`;
        
        // Detect if user is on mobile or desktop
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          // Mobile: Open WhatsApp app directly with pre-filled message
          const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(whatsappText)}`;
          window.open(whatsappAppUrl, '_blank');
        } else {
          // Desktop: Open WhatsApp Web with pre-filled message - allows selecting multiple contacts
          const whatsappWebUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`;
          window.open(whatsappWebUrl, '_blank');
        }
        break;
      
      case 'gmail':
        const subject = `${weddingData.couple_name_1} & ${weddingData.couple_name_2}'s Wedding Invitation`;
        const body = `You're invited to our wedding! 💕\n\nView our beautiful wedding card: ${shareableUrl}\n\nDate: ${weddingData.wedding_date}\nVenue: ${weddingData.venue_location}\n\nWe can't wait to celebrate with you!\n\nWith love,\n${weddingData.couple_name_1} & ${weddingData.couple_name_2}`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
        break;
      
      case 'qrcode':
        // Generate QR code using QR Server API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareableUrl)}`;
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
          <html>
            <head><title>QR Code - Wedding Card</title></head>
            <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif; background: linear-gradient(135deg, #f8f6f0, #ffffff);">
              <h2 style="color: #333; margin-bottom: 20px;">Wedding Card QR Code</h2>
              <img src="${qrUrl}" alt="QR Code" style="border: 4px solid #d4af37; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
              <p style="color: #666; margin-top: 20px; text-align: center; max-width: 300px;">Scan this QR code to view the wedding card</p>
              <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: linear-gradient(135deg, #d4af37, #f4e4a6); border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;">Print QR Code</button>
            </body>
          </html>
        `);
        break;
      
      case 'url':
        copyToClipboardWithFallback(shareableUrl).then(() => {
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 2000);
        }).catch((error) => {
          console.error('Failed to copy URL:', error);
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 2000);
        });
        break;
      
      case 'ai':
        // AI Design Generator Modal
        setActiveForm('ai-design');
        break;
      
      default:
        break;
    }
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-[60] bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-slide-in-right">
          <CheckCircle className="w-5 h-5" />
          <span>
            {activeForm === 'url' ? 'URL copied to clipboard!' : 'Changes saved automatically!'}
          </span>
        </div>
      )}

      {/* Left Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed left-0 top-0 h-full backdrop-blur-xl border-r border-white/30 shadow-2xl transition-all duration-500 ease-in-out z-40 ${
          leftSidebarOpen || (!leftSidebarOpen && isHovering) ? 'w-80 md:w-80' : 'w-16 md:w-20'
        }`}
        style={{ 
          background: window.innerWidth <= 768 
            ? `linear-gradient(135deg, ${theme.background}70, ${theme.secondary}60)` // More translucent on mobile
            : `linear-gradient(135deg, ${theme.background}f0, ${theme.secondary}e0)`, // Less translucent on desktop
          borderColor: `${theme.accent}20`
        }}
        onMouseEnter={() => {
          // Only enable hover on desktop
          if (!leftSidebarOpen && window.innerWidth > 768) {
            setIsHovering(true);
          }
        }}
        onMouseLeave={() => {
          // Don't auto-close on mouse leave - user requested it stays open
          // It will only close when clicking outside
        }}
        onClick={(e) => {
          // On mobile, clicking the sidebar when collapsed should open it
          if (window.innerWidth <= 768 && !leftSidebarOpen && e.target === e.currentTarget) {
            setLeftSidebarOpen(true);
          }
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="absolute -right-4 top-20 w-8 h-16 bg-white border border-gray-200 rounded-r-xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-50"
          style={{ 
            background: theme.gradientAccent,
            borderColor: `${theme.accent}30`
          }}
        >
          {leftSidebarOpen ? (
            <ChevronLeft className="w-4 h-4" style={{ color: theme.primary }} />
          ) : (
            <ChevronRight className="w-4 h-4" style={{ color: theme.primary }} />
          )}
        </button>

        {/* Sidebar Content */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse"
                style={{ background: theme.gradientAccent }}
              >
                <Edit3 className="w-5 h-5" style={{ color: theme.primary }} />
              </div>
              {leftSidebarOpen || (!leftSidebarOpen && isHovering) && (
                <div>
                  <h2 
                    className="text-lg font-semibold"
                    style={{ 
                      fontFamily: theme.fontPrimary,
                      color: theme.primary 
                    }}
                  >
                    Wedding Editor
                  </h2>
                  <p className="text-sm opacity-70" style={{ color: theme.textLight }}>
                    Welcome, {userInfo?.username}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {sidebarSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isInfoSection = section.id === 'info';
                
                return (
                  <div key={section.id}>
                    <button
                      onClick={() => {
                        setActiveSection(section.id);
                        if (isInfoSection) {
                          setInfoExpanded(!infoExpanded);
                        } else {
                          // Handle premium features and custom actions
                          handleSectionClick(section.id);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 hover:scale-105 group ${
                        isActive ? 'shadow-lg' : 'hover:shadow-md'
                      }`}
                      style={{
                        background: isActive 
                          ? theme.gradientAccent 
                          : 'rgba(255,255,255,0.1)',
                        color: isActive 
                          ? theme.primary 
                          : theme.text
                      }}
                      title={!(leftSidebarOpen || isHovering) ? section.label : ''}
                    >
                      <div className="flex items-center gap-3">
                        <Icon 
                          className="w-5 h-5" 
                          style={{ color: section.color || theme.text }}
                        />
                        {(leftSidebarOpen || (!leftSidebarOpen && isHovering)) && (
                          <span className="font-medium">{section.label}</span>
                        )}
                      </div>
                      {(leftSidebarOpen || (!leftSidebarOpen && isHovering)) && isInfoSection && (
                        infoExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Info Section Dropdown */}
                    {isInfoSection && infoExpanded && (leftSidebarOpen || (!leftSidebarOpen && isHovering)) && (
                      <div className="mt-2 ml-4 space-y-1">
                        {editSections.map((editSection) => {
                          const EditIcon = editSection.icon;
                          return (
                            <button
                              key={editSection.id}
                              onClick={() => setActiveForm(editSection.id)}
                              className="w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/10 group animate-fade-in"
                              style={{ color: theme.textLight }}
                            >
                              <EditIcon className="w-4 h-4" />
                              <div className="text-left">
                                <div className="text-sm font-medium group-hover:font-semibold transition-all duration-200">
                                  {editSection.label}
                                </div>
                                <div className="text-xs opacity-70">
                                  {editSection.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Section removed - premium features now integrated into main navigation */}
          </div>

          {/* Footer - Logout */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:scale-105"
              style={{ color: theme.textLight }}
              title={!(leftSidebarOpen || isHovering) ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5" />
              {(leftSidebarOpen || (!leftSidebarOpen && isHovering)) && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Form Popups */}
      {activeForm && (
        <FormPopup
          sectionId={activeForm}
          onClose={() => setActiveForm(null)}
          theme={theme}
          modalRef={modalRef}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          themes={themes}
        />
      )}

      {/* Main Content Pusher - Adds margin when sidebar is open */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          leftSidebarOpen ? 'ml-80' : 'ml-20'
        }`}
        style={{ minHeight: '100vh' }}
      />
    </>
  );
};

// Enhanced Form Popup Component with Auto-save and Premium Features
const FormPopup = ({ sectionId, onClose, theme, modalRef }) => {
  const { weddingData, saveWeddingData } = useUserData();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [sectionEnabled, setSectionEnabled] = useState(true);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        autoSave();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [formData]);

  const autoSave = () => {
    if (Object.keys(formData).length > 0) {
      setSaving(true);
      
      // Save form data
      const updatedData = { ...weddingData };
      Object.keys(formData).forEach(field => {
        updatedData[field] = formData[field];
      });
      
      saveWeddingData(updatedData);
      
      setTimeout(() => {
        setSaving(false);
      }, 500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    autoSave();
    
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 1000);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderForm = () => {
    switch (sectionId) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Home Section
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Bride's Name
                </label>
                <input
                  type="text"
                  defaultValue={weddingData.couple_name_1}
                  onChange={(e) => handleChange('couple_name_1', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 backdrop-blur-sm"
                  style={{ color: theme.text, borderColor: `${theme.accent}40` }}
                  placeholder="Enter bride's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Groom's Name
                </label>
                <input
                  type="text"
                  defaultValue={weddingData.couple_name_2}
                  onChange={(e) => handleChange('couple_name_2', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 backdrop-blur-sm"
                  style={{ color: theme.text, borderColor: `${theme.accent}40` }}
                  placeholder="Enter groom's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Wedding Date
                </label>
                <input
                  type="date"
                  defaultValue={weddingData.wedding_date}
                  onChange={(e) => handleChange('wedding_date', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 backdrop-blur-sm"
                  style={{ color: theme.text, borderColor: `${theme.accent}40` }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                  Venue Name
                </label>
                <input
                  type="text"
                  defaultValue={weddingData.venue_name}
                  onChange={(e) => handleChange('venue_name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 backdrop-blur-sm"
                  style={{ color: theme.text, borderColor: `${theme.accent}40` }}
                  placeholder="Enter venue name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                Venue Location
              </label>
              <input
                type="text"
                defaultValue={weddingData.venue_location}
                onChange={(e) => handleChange('venue_location', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 backdrop-blur-sm"
                style={{ color: theme.text, borderColor: `${theme.accent}40` }}
                placeholder="Enter full venue address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
                Love Story Description
              </label>
              <textarea
                rows={4}
                defaultValue={weddingData.their_story}
                onChange={(e) => handleChange('their_story', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 resize-none backdrop-blur-sm"
                style={{ color: theme.text, borderColor: `${theme.accent}40` }}
                placeholder="Tell your beautiful love story..."
              />
            </div>
          </div>
        );
      
      case 'story':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Our Love Story
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Enhanced Our Story Management Interface */}
            <OurStoryManager 
              weddingData={weddingData}
              onSave={(data) => handleChange('story_timeline', data.story_timeline)}
              theme={theme}
            />
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Wedding Schedule
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Schedule Management Interface */}
            <ScheduleManager 
              weddingData={weddingData}
              onSave={saveWeddingData}
              theme={theme}
            />
          </div>
        );

      case 'rsvp':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit RSVP Section
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <RSVPAdminContent 
              weddingData={weddingData} 
              theme={theme} 
            />
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Photo Gallery
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            {/* Gallery Management Interface */}
            <GalleryManager 
              weddingData={weddingData}
              onSave={saveWeddingData}
              theme={theme}
            />
          </div>
        );

      case 'party':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Wedding Party
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            {/* Wedding Party Management Interface */}
            <WeddingPartyManager 
              weddingData={weddingData}
              onSave={saveWeddingData}
              theme={theme}
            />
          </div>
        );

      case 'registry':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Gift Registry
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="text-center py-12">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: theme.gradientAccent }}
              >
                <Gift className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
              <p className="text-lg mb-2" style={{ color: theme.text }}>
                Gift Registry Links
              </p>
              <p className="text-sm" style={{ color: theme.textLight }}>
                Add links to your wedding registries from different stores and your honeymoon fund information.
              </p>
            </div>
          </div>
        );

      case 'guestbook':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit Guest Book
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="text-center py-12">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: theme.gradientAccent }}
              >
                <MessageCircle className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
              <p className="text-lg mb-2" style={{ color: theme.text }}>
                Guest Book Messages
              </p>
              <p className="text-sm" style={{ color: theme.textLight }}>
                Configure the guest book section where friends and family can leave heartfelt messages and well wishes.
              </p>
            </div>
          </div>
        );

      case 'faq':
        return (
          <FAQAdmin 
            weddingData={weddingData} 
            onSave={saveWeddingData} 
            theme={theme} 
          />
        );

      case 'theme':
        return (
          <ThemeManager 
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            themes={themes}
            onSave={saveWeddingData}
            theme={theme}
          />
        );

      case 'ai-design':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6" style={{ color: theme.primary }}>
              AI Design Generator
            </h3>
            <div className="text-center py-12">
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse"
                style={{ background: theme.gradientAccent }}
              >
                <Wand2 className="w-10 h-10" style={{ color: theme.primary }} />
              </div>
              <p className="text-lg mb-4" style={{ color: theme.text }}>
                AI-Powered Design Coming Soon!
              </p>
              <p className="text-sm mb-6" style={{ color: theme.textLight }}>
                Our AI will generate beautiful, personalized wedding card designs based on your preferences, theme, and story.
              </p>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-left">
                <h4 className="font-semibold mb-3 text-purple-800">Features will include:</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li>• Color scheme suggestions based on your theme</li>
                  <li>• Layout optimization for your content</li>
                  <li>• Font pairing recommendations</li>
                  <li>• Background pattern generation</li>
                  <li>• Multiple design variations to choose from</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'custom-url':
        return <CustomUrlForm theme={theme} weddingData={weddingData} saveWeddingData={saveWeddingData} />;

      case 'qrcode-generator':
        return (
          <QRCodeGenerator 
            weddingData={weddingData} 
            theme={theme} 
            onClose={() => setActiveForm(null)} 
          />
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
                Edit {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Section
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: theme.textLight }}>Enable Section</span>
                <button
                  onClick={() => setSectionEnabled(!sectionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    sectionEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    sectionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="text-center py-12">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: theme.gradientAccent }}
              >
                <Plus className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
              <p className="text-lg mb-2" style={{ color: theme.text }}>
                Enhanced form for {sectionId} section
              </p>
              <p className="text-sm" style={{ color: theme.textLight }}>
                This section will contain pre-populated data from your landing page. You can edit, replace, or remove any content here.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border"
        style={{ 
          border: `1px solid ${theme.accent}30`,
          background: `linear-gradient(135deg, ${theme.background}f8, ${theme.secondary}f0)`
        }}
      >
        <div className="p-8">
          {/* Header with auto-save indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {saving && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Auto-saving...</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition-colors duration-200"
              style={{ color: theme.textLight }}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {renderForm()}
            
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm opacity-70" style={{ color: theme.textLight }}>
                💡 Click outside or press ESC to auto-save and close
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  style={{ color: theme.text }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  style={{
                    background: theme.gradientAccent,
                    color: theme.primary
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Custom URL Form Component
const CustomUrlForm = ({ theme, weddingData, saveWeddingData }) => {
  const { userInfo } = useUserData();
  const [customUrl, setCustomUrl] = useState(weddingData.custom_url || '');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (customUrl) {
      setPreviewUrl(`${window.location.origin}/${customUrl}`);
    } else {
      setPreviewUrl(`${window.location.origin}/wedding/${userInfo.userId}`);
    }
  }, [customUrl, userInfo.userId]);

  const handleSaveUrl = () => {
    const updatedData = { ...weddingData, custom_url: customUrl };
    saveWeddingData(updatedData);
  };

  const handleCopyUrl = () => {
    copyToClipboardWithFallback(previewUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch((error) => {
      console.error('Failed to copy URL:', error);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const generateSuggestions = () => {
    const name1 = weddingData.couple_name_1?.toLowerCase().replace(/\s+/g, '') || 'bride';
    const name2 = weddingData.couple_name_2?.toLowerCase().replace(/\s+/g, '') || 'groom';
    return [
      `${name1}-${name2}-wedding`,
      `${name1}and${name2}`,
      `${name1}-${name2}-2025`,
      `wedding-${name1}-${name2}`,
      `${name1}${name2}wedding`
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold" style={{ color: theme.primary }}>
          Customize Your Wedding URL
        </h3>
        <div className="flex items-center gap-2">
          <Link className="w-6 h-6" style={{ color: theme.accent }} />
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h4 className="font-semibold mb-3 text-blue-800">Create Your Perfect Wedding URL</h4>
        <p className="text-sm text-blue-700 mb-4">
          Make your wedding card easy to remember and share with a custom URL that reflects your love story.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Custom URL Route
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm px-3 py-3 bg-gray-100 rounded-l-xl border-r-0" style={{ color: theme.textLight }}>
              {window.location.origin}/
            </span>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => {
                const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                setCustomUrl(value);
              }}
              className="flex-1 px-4 py-3 rounded-r-xl bg-white/20 border border-white/30 focus:border-opacity-50 transition-all duration-300 backdrop-blur-sm"
              style={{ color: theme.text, borderColor: `${theme.accent}40` }}
              placeholder="sarah-michael-wedding"
            />
          </div>
          <p className="text-xs mt-1" style={{ color: theme.textLight }}>
            Only lowercase letters, numbers, and hyphens allowed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: theme.text }}>
            Preview URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={previewUrl}
              readOnly
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 border border-gray-200"
              style={{ color: theme.text }}
            />
            <button
              onClick={handleCopyUrl}
              className="px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: isCopied ? '#10b981' : theme.gradientAccent,
                color: theme.primary
              }}
            >
              {isCopied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: theme.text }}>
            URL Suggestions
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {generateSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setCustomUrl(suggestion)}
                className="text-left px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 text-sm"
                style={{ color: theme.textLight }}
              >
                {window.location.origin}/{suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveUrl}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            style={{
              background: theme.gradientAccent,
              color: theme.primary
            }}
          >
            Save Custom URL
          </button>
        </div>
      </div>
    </div>
  );
};

// QR Code Generator Form - Replaced with new QRCodeGenerator component

export default LeftSidebar;