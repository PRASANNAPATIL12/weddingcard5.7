import React, { useState } from 'react';
import { 
  Palette, 
  Check,
  Save,
  Sparkles
} from 'lucide-react';

const ThemeManager = ({ currentTheme, setCurrentTheme, themes, onSave, theme }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [isSaving, setIsSaving] = useState(false);

  const themeOptions = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Elegant and timeless',
      icon: '👑',
      preview: {
        primary: '#1a1a1a',
        accent: '#d4af37',
        background: '#ffffff'
      }
    },
    {
      id: 'modern', 
      name: 'Modern',
      description: 'Clean and contemporary',
      icon: '🎨',
      preview: {
        primary: '#2c2c2c',
        accent: '#ff6b6b', 
        background: '#ffffff'
      }
    },
    {
      id: 'boho',
      name: 'Boho',
      description: 'Bohemian and romantic',
      icon: '🌸',
      preview: {
        primary: '#8b4513',
        accent: '#cd853f',
        background: '#fefefe'
      }
    }
  ];

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    // Apply theme immediately for preview
    setCurrentTheme(themeId);
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        console.error('No session ID found');
        return;
      }

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/wedding/theme`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          theme: selectedTheme
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update parent component
        onSave({ theme: selectedTheme });
        console.log('Theme saved successfully');
      } else {
        console.error('Failed to save theme:', data);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: theme.primary }}>
            Choose Your Theme
          </h3>
          <p className="text-sm" style={{ color: theme.textLight }}>
            Select a theme that matches your wedding style. This will be applied to your entire dashboard and saved to your profile.
          </p>
        </div>
      </div>

      {/* Theme Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themeOptions.map((themeOption) => {
          const isSelected = selectedTheme === themeOption.id;
          const themeColors = themes[themeOption.id];
          
          return (
            <div
              key={themeOption.id}
              className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? 'border-current shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                background: isSelected 
                  ? `linear-gradient(135deg, ${themeColors.secondary}50, ${themeColors.background})`
                  : 'rgba(255,255,255,0.5)',
                borderColor: isSelected ? themeColors.accent : undefined
              }}
              onClick={() => handleThemeSelect(themeOption.id)}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div 
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: themeColors.accent }}
                >
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              {/* Theme Preview */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{themeOption.icon}</div>
                <h4 
                  className="text-xl font-semibold mb-1"
                  style={{ color: themeColors.primary }}
                >
                  {themeOption.name}
                </h4>
                <p 
                  className="text-sm"
                  style={{ color: themeColors.textLight || themeColors.text }}
                >
                  {themeOption.description}
                </p>
              </div>

              {/* Color Palette Preview */}
              <div className="flex justify-center space-x-2 mb-4">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeColors.primary }}
                  title="Primary Color"
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeColors.accent }}
                  title="Accent Color"
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: themeColors.secondary }}
                  title="Secondary Color"
                />
              </div>

              {/* Theme Features */}
              <div className="text-xs space-y-1" style={{ color: themeColors.textLight || themeColors.text }}>
                {themeOption.id === 'classic' && (
                  <>
                    <p>• Gold accent colors</p>
                    <p>• Serif typography</p>
                    <p>• Timeless elegance</p>
                  </>
                )}
                {themeOption.id === 'modern' && (
                  <>
                    <p>• Bold accent colors</p>
                    <p>• Sans-serif typography</p>
                    <p>• Clean minimalism</p>
                  </>
                )}
                {themeOption.id === 'boho' && (
                  <>
                    <p>• Earth tone colors</p>
                    <p>• Script typography</p>
                    <p>• Romantic warmth</p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleSaveTheme}
          disabled={isSaving || selectedTheme === currentTheme}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: theme.gradientAccent,
            color: theme.primary
          }}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving Theme...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Theme
            </>
          )}
        </button>
      </div>

      {/* Theme Info */}
      <div className="bg-white/10 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" style={{ color: theme.accent }} />
          <span className="font-semibold" style={{ color: theme.text }}>
            Theme Information
          </span>
        </div>
        <div className="text-sm space-y-1" style={{ color: theme.textLight }}>
          <p><strong>Current Theme:</strong> {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</p>
          <p><strong>Selected Theme:</strong> {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}</p>
          <p className="mt-2 text-xs">
            💡 Your theme choice will be automatically saved and applied across your entire dashboard. 
            It will persist even after you log out and log back in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;