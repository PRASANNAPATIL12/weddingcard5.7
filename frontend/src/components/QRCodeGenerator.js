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

  const downloadQRCode = async () => {
    if (!canvasRef.current) return;
    
    setDownloadProgress(25);
    
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      const filename = `wedding-qr-${selectedShape}-${weddingData?.couple_name_1?.toLowerCase() || 'wedding'}-${weddingData?.couple_name_2?.toLowerCase() || 'card'}-${Date.now()}.png`;
      
      setDownloadProgress(75);
      
      // Enhanced canvas with better quality
      const highResCanvas = document.createElement('canvas');
      const highResCtx = highResCanvas.getContext('2d');
      
      // Create high-resolution version (2x)
      highResCanvas.width = canvas.width * 2;
      highResCanvas.height = canvas.height * 2;
      
      highResCtx.imageSmoothingEnabled = false;
      highResCtx.drawImage(canvas, 0, 0, highResCanvas.width, highResCanvas.height);
      
      setDownloadProgress(90);
      
      link.download = filename;
      link.href = highResCanvas.toDataURL('image/png', 1.0);
      link.click();
      
      setDownloadProgress(100);
      
      // Reset progress after download
      setTimeout(() => setDownloadProgress(0), 1000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadProgress(0);
    }
  };

  const ColorPicker = ({ currentColor, onChange, label }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [customColor, setCustomColor] = useState(currentColor);

    // Prevent event bubbling to avoid modal closing
    const handlePickerClick = (e) => {
      e.stopPropagation();
    };

    const handleColorSelect = (color) => {
      setCustomColor(color);
      onChange(color);
      // Don't close picker immediately for better UX
    };

    return (
      <div className="space-y-2" onClick={handlePickerClick}>
        <label className="block text-sm font-medium" style={{ color: theme.text }}>
          {label}
        </label>
        
        {/* Current Color Display */}
        <div 
          className="w-full h-12 rounded-lg border-2 cursor-pointer flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          style={{ 
            backgroundColor: currentColor,
            borderColor: theme.accent
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowPicker(!showPicker);
          }}
        >
          <span 
            className="text-sm font-medium"
            style={{ 
              color: currentColor === '#FFFFFF' || currentColor === '#FFFF00' ? '#000000' : '#FFFFFF',
              textShadow: '0 0 4px rgba(0,0,0,0.7)'
            }}
          >
            {currentColor}
          </span>
        </div>

        {showPicker && (
          <div className="p-4 bg-white rounded-lg shadow-xl border-2 border-gray-200 relative z-50">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPicker(false);
              }}
              className="absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs"
            >
              ×
            </button>

            {/* HTML5 Color Picker */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Custom Color</label>
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  e.stopPropagation();
                  handleColorSelect(e.target.value);
                }}
                className="w-full h-12 rounded-lg border cursor-pointer"
                onClick={handlePickerClick}
              />
            </div>

            {/* Hex Input */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">Hex Code</label>
              <input
                type="text"
                value={customColor}
                onChange={(e) => {
                  e.stopPropagation();
                  const value = e.target.value;
                  setCustomColor(value);
                  if (/^#[0-9A-F]{6}$/i.test(value)) {
                    handleColorSelect(value);
                  }
                }}
                className="w-full p-2 border rounded-lg text-center font-mono text-sm"
                placeholder="#000000"
                onClick={handlePickerClick}
              />
            </div>

            {/* Preset Colors */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Preset Colors</label>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform ${
                      currentColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                    }`}
                    style={{ 
                      backgroundColor: color, 
                      borderColor: color === '#FFFFFF' ? '#e5e7eb' : color 
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleColorSelect(color);
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-2" style={{ color: theme.primary }}>
            QR Code Generator
          </h3>
          <p className="text-sm" style={{ color: theme.textLight }}>
            Create a custom QR code for your wedding invitation
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls - Responsive */}
        <div className="space-y-6 order-2 lg:order-1">
          {/* Premium Feature Badge */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">PREMIUM QR STYLES</span>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-bold">PRO</span>
            </div>
          </div>

          {/* Shape & Color Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
              SHAPE & STYLE
            </h4>

            {/* Enhanced Shape Selection with Descriptions */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: theme.text }}>
                QR Code Pattern
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {shapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <button
                      key={shape.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShape(shape.id);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedShape === shape.id 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
                          : 'border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Icon className="w-6 h-6" />
                          <span className="ml-2 text-2xl">{shape.preview}</span>
                        </div>
                        <div className="text-xs font-medium text-gray-800">{shape.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{shape.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Color Pickers */}
            <div className="grid md:grid-cols-2 gap-4">
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

            {/* Style Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <QrCodeIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Currently selected: {shapes.find(s => s.id === selectedShape)?.name}</p>
                  <p className="text-xs mt-1">{shapes.find(s => s.id === selectedShape)?.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Download Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadQRCode();
            }}
            disabled={isGenerating || downloadProgress > 0}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            style={{
              background: isGenerating || downloadProgress > 0 
                ? 'linear-gradient(45deg, #6b7280, #9ca3af)' 
                : theme.gradientAccent,
              color: theme.primary
            }}
          >
            {downloadProgress > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Downloading {downloadProgress}%</span>
              </div>
            ) : isGenerating ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                <span>Download QR Code</span>
              </div>
            )}
          </button>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQrColor('#000000');
                setBackgroundColor('#FFFFFF');
                setSelectedShape('square');
              }}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              Reset to Default
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const randomColor = presetColors[Math.floor(Math.random() * presetColors.length)];
                const randomBg = presetColors[Math.floor(Math.random() * presetColors.length)];
                setQrColor(randomColor);
                setBackgroundColor(randomBg);
              }}
              className="py-2 px-4 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm font-medium transition-colors"
            >
              Random Colors
            </button>
          </div>
        </div>

        {/* Preview - Enhanced and Responsive */}
        <div className="space-y-4 order-1 lg:order-2">
          <h4 className="text-lg font-semibold" style={{ color: theme.text }}>
            Live Preview
          </h4>
          
          <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-gray-100">
            {qrCodeUrl ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Preview"
                    className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                    style={{ backgroundColor: backgroundColor }}
                    onError={(e) => {
                      console.error('QR code failed to load');
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmI3MjgwIj5RUiBDb2RlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                  {selectedShape === 'classy' && (
                    <div className="absolute -inset-2 border-4 border-dashed border-gray-300 rounded-lg" />
                  )}
                </div>
                <p className="mt-4 text-sm text-gray-600 font-medium">
                  Scan to visit: {weddingData?.couple_name_1} & {weddingData?.couple_name_2}'s Wedding
                </p>
                {isGenerating && (
                  <div className="mt-2">
                    <div className="animate-pulse bg-gray-200 h-2 rounded w-full" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <QrCodeIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>Generating QR Code...</p>
                </div>
              </div>
            )}
          </div>

          {/* Wedding Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg">
            <h5 className="font-semibold mb-3" style={{ color: theme.text }}>
              Wedding Details
            </h5>
            <div className="text-sm space-y-2" style={{ color: theme.textLight }}>
              <div className="flex justify-between">
                <span>Couple:</span>
                <span className="font-medium">{weddingData?.couple_name_1} & {weddingData?.couple_name_2}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{weddingData?.wedding_date}</span>
              </div>
              <div className="flex justify-between">
                <span>Venue:</span>
                <span className="font-medium">{weddingData?.venue_name}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500 break-all">
                  <strong>QR URL:</strong> {shareableUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h6 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h6>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• High contrast colors work best for scanning</li>
              <li>• Test your QR code before printing</li>
              <li>• Classy style includes decorative borders</li>
              <li>• Download provides high-resolution image</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Enhanced Download */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={400}
        height={400}
      />
    </div>
  );
};

export default QRCodeGenerator;