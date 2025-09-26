import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Palette, 
  Square, 
  Circle,
  RefreshCw,
  QrCode as QrCodeIcon,
  Hexagon,
  Star,
  Diamond,
  Heart
} from 'lucide-react';

const QRCodeGenerator = ({ weddingData, theme, onClose }) => {
  const [qrColor, setQrColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [selectedShape, setSelectedShape] = useState('square');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const canvasRef = useRef(null);

  // Generate shareable URL for QR code
  const shareableUrl = weddingData?.shareable_id 
    ? `${window.location.origin}/share/${weddingData.shareable_id}`
    : `${window.location.origin}/wedding/${weddingData?.id}`;

  // Enhanced QR code shapes with unique visual characteristics
  const shapes = [
    { 
      id: 'square', 
      name: 'Classic Square', 
      icon: Square, 
      description: 'Traditional sharp edges',
      preview: '⬛',
      apiStyle: '&qzone=1&format=png'
    },
    { 
      id: 'rounded', 
      name: 'Rounded Corners', 
      icon: Square, 
      description: 'Soft rounded edges',
      preview: '⬜',
      apiStyle: '&qzone=1&format=png&style=rounded'
    },
    { 
      id: 'dots', 
      name: 'Circular Dots', 
      icon: Circle, 
      description: 'Perfect circles',
      preview: '●',
      apiStyle: '&qzone=0&format=png'
    },
    { 
      id: 'rounded-dots', 
      name: 'Rounded Dots', 
      icon: Circle, 
      description: 'Smooth circular dots',
      preview: '⚫',
      apiStyle: '&qzone=2&format=png'
    },
    { 
      id: 'extra-rounded', 
      name: 'Extra Rounded', 
      icon: Square, 
      description: 'Maximum roundness',
      preview: '🔲',
      apiStyle: '&qzone=3&format=png'
    },
    { 
      id: 'classy', 
      name: 'Classy Border', 
      icon: Diamond, 
      description: 'Elegant with border',
      preview: '◈',
      apiStyle: '&qzone=4&format=png&margin=2'
    }
  ];

  // Pre-defined colors with better variety
  const presetColors = [
    // Primary colors
    '#000000', '#FFFFFF', '#808080', '#FF0000', 
    // Theme colors
    '#d4af37', '#1a1a1a', '#ff6b6b', '#2c2c2c',
    // Wedding colors
    '#8b4513', '#cd853f', '#FF69B4', '#FFB6C1',
    // Elegant colors
    '#4B0082', '#800080', '#008B8B', '#006400',
    '#B22222', '#FF8C00', '#32CD32', '#1E90FF'
  ];

  useEffect(() => {
    generateQRCode();
  }, [qrColor, backgroundColor, selectedShape, shareableUrl]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Use different QR code APIs based on shape for better variety
      const qrUrl = buildQRCodeUrl();
      setQrCodeUrl(qrUrl);
      
      // Draw on canvas for download functionality with enhanced features
      if (canvasRef.current) {
        await drawQRCodeOnCanvas(qrUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const drawQRCodeOnCanvas = async (qrUrl) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 400;
        
        // Enhanced background with gradient for classy style
        if (selectedShape === 'classy') {
          const gradient = ctx.createLinearGradient(0, 0, 400, 400);
          gradient.addColorStop(0, backgroundColor);
          gradient.addColorStop(1, adjustBrightness(backgroundColor, -10));
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = backgroundColor;
        }
        ctx.fillRect(0, 0, 400, 400);
        
        // Add decorative border for classy style
        if (selectedShape === 'classy') {
          ctx.strokeStyle = adjustBrightness(qrColor, 20);
          ctx.lineWidth = 8;
          ctx.strokeRect(20, 20, 360, 360);
          
          // Inner border
          ctx.strokeStyle = qrColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(30, 30, 340, 340);
          
          // Draw QR code with padding
          ctx.drawImage(img, 40, 40, 320, 320);
        } else {
          // Standard QR code drawing
          ctx.drawImage(img, 50, 50, 300, 300);
        }
        
        resolve();
      };
      
      img.onerror = () => {
        console.error('Failed to load QR code image');
        resolve();
      };
      
      img.src = qrUrl;
    });
  };

  const adjustBrightness = (hex, percent) => {
    // Convert hex to RGB
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const buildQRCodeUrl = () => {
    const selectedShapeData = shapes.find(s => s.id === selectedShape);
    let baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    
    // Different APIs for different styles
    if (selectedShape === 'dots' || selectedShape === 'rounded-dots') {
      // Use alternative API for better dot patterns
      baseUrl = 'https://qr-code-styling.com/api/create';
      return `${baseUrl}?data=${encodeURIComponent(shareableUrl)}&size=300&format=png&color=${qrColor.replace('#', '')}&backgroundColor=${backgroundColor.replace('#', '')}&dotType=${selectedShape === 'dots' ? 'square' : 'rounded'}&cornerType=square`;
    }
    
    const params = new URLSearchParams({
      size: '300x300',
      data: shareableUrl,
      color: qrColor.replace('#', ''),
      bgcolor: backgroundColor.replace('#', ''),
      format: 'png',
      ecc: 'M',
      margin: selectedShape === 'classy' ? '2' : '0'
    });

    // Add shape-specific parameters
    if (selectedShape === 'rounded' || selectedShape === 'extra-rounded') {
      params.append('qzone', selectedShape === 'extra-rounded' ? '3' : '1');
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const handleColorChange = (color, type) => {
    if (type === 'qr') {
      setQrColor(color);
    } else {
      setBackgroundColor(color);
    }
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `wedding-qr-code-${weddingData?.couple_name_1 || 'wedding'}-${weddingData?.couple_name_2 || 'card'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const ColorPicker = ({ currentColor, onChange, label }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [customColor, setCustomColor] = useState(currentColor);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: theme.text }}>
          {label}
        </label>
        
        {/* Current Color Display */}
        <div 
          className="w-full h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center"
          style={{ 
            backgroundColor: currentColor,
            borderColor: theme.accent
          }}
          onClick={() => setShowPicker(!showPicker)}
        >
          <span 
            className="text-sm font-medium"
            style={{ 
              color: currentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
              textShadow: '0 0 2px rgba(0,0,0,0.5)'
            }}
          >
            {currentColor}
          </span>
        </div>

        {showPicker && (
          <div className="p-4 bg-white rounded-lg shadow-lg border">
            {/* HTML5 Color Picker */}
            <div className="mb-4">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onChange(e.target.value);
                }}
                className="w-full h-12 rounded-lg border cursor-pointer"
              />
            </div>

            {/* Hex Input */}
            <div className="mb-4">
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    onChange(e.target.value);
                  }
                }}
                className="w-full p-2 border rounded-lg text-center font-mono"
                placeholder="#000000"
              />
            </div>

            {/* Preset Colors */}
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    currentColor === color ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color, borderColor: color === '#FFFFFF' ? '#e5e7eb' : color }}
                  onClick={() => {
                    setCustomColor(color);
                    onChange(color);
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: theme.primary }}>
            QR Code Generator
          </h3>
          <p className="text-sm" style={{ color: theme.textLight }}>
            Generate a custom QR code for your wedding invitation
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          {/* Frame Options */}
          <div className="bg-cyan-500 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">FRAME</span>
              <span className="bg-blue-800 px-2 py-1 rounded text-xs font-bold">NEW!</span>
            </div>
          </div>

          {/* Shape & Color Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
              SHAPE & COLOR
            </h4>

            {/* Shape Selection */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: theme.text }}>
                QR Code Shape
              </label>
              <div className="grid grid-cols-3 gap-3">
                {shapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => setSelectedShape(shape.id)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedShape === shape.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs">{shape.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker 
                currentColor={qrColor}
                onChange={(color) => handleColorChange(color, 'qr')}
                label="QR Code Color"
              />
              <ColorPicker 
                currentColor={backgroundColor}
                onChange={(color) => handleColorChange(color, 'background')}
                label="Background Color"
              />
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadQRCode}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
            style={{
              background: theme.gradientAccent,
              color: theme.primary
            }}
          >
            {isGenerating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isGenerating ? 'Generating...' : 'Download QR Code'}
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
            Preview
          </h4>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border">
            {qrCodeUrl && (
              <div className="text-center">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Preview"
                  className="w-64 h-64 mx-auto rounded-lg shadow-md"
                  style={{ backgroundColor: backgroundColor }}
                />
                <p className="mt-4 text-sm text-gray-600">
                  Scan to visit: {weddingData?.couple_name_1} & {weddingData?.couple_name_2}'s Wedding
                </p>
              </div>
            )}
          </div>

          {/* Wedding Info */}
          <div className="bg-white/10 p-4 rounded-lg">
            <h5 className="font-semibold mb-2" style={{ color: theme.text }}>
              Wedding Details
            </h5>
            <div className="text-sm space-y-1" style={{ color: theme.textLight }}>
              <p>Couple: {weddingData?.couple_name_1} & {weddingData?.couple_name_2}</p>
              <p>Date: {weddingData?.wedding_date}</p>
              <p>Venue: {weddingData?.venue_name}</p>
              <p className="break-all">URL: {shareableUrl}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Download */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={300}
        height={300}
      />
    </div>
  );
};

export default QRCodeGenerator;