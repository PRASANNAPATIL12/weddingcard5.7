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

  // Pre-defined colors
  const presetColors = [
    '#FF0000', '#FF8000', '#FFFF00', '#00FF00', 
    '#00FFFF', '#0000FF', '#8000FF', '#000000',
    '#FFFFFF', '#808080', '#800000', '#008000',
    '#000080', '#800080', '#FFC0CB', '#FFA500'
  ];

  useEffect(() => {
    generateQRCode();
  }, [qrColor, backgroundColor, selectedShape, shareableUrl]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Use QR Server API with custom styling
      const qrUrl = buildQRCodeUrl();
      setQrCodeUrl(qrUrl);
      
      // Draw on canvas for download functionality
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          canvas.width = 300;
          canvas.height = 300;
          
          // Fill background
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, 300, 300);
          
          // Draw QR code
          ctx.drawImage(img, 0, 0, 300, 300);
        };
        
        img.src = qrUrl;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildQRCodeUrl = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
      size: '300x300',
      data: shareableUrl,
      color: qrColor.replace('#', ''),
      bgcolor: backgroundColor.replace('#', ''),
      format: 'png',
      ecc: 'M'
    });

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