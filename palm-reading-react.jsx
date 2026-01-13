import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, RotateCcw, X, Globe, Loader2, Home } from 'lucide-react';

// Language Translations
const translations = {
  hi: {
    title: 'हस्त रेखा विज्ञान',
    subtitle: 'AI के साथ अपनी किस्मत की रेखाएं जानें',
    cameraTitle: 'कैमरा से स्कैन करें',
    cameraDesc: 'अपना हाथ कैमरे के सामने रखें',
    uploadTitle: 'फोटो अपलोड करें',
    uploadDesc: 'अपने हाथ की तस्वीर चुनें',
    captureBtn: 'फोटो लें',
    analyzeBtn: 'हस्तरेखा पढ़ें',
    cancelBtn: 'रद्द करें',
    resetBtn: 'फिर से शुरू करें',
    clickHere: 'यहाँ क्लिक करें',
    dragText: 'या फोटो को यहाँ खींच कर लाएं',
    loading: 'आपकी किस्मत की रेखाएं पढ़ी जा रही हैं...',
    analyzing: 'विश्लेषण हो रहा है...',
    resultTitle: 'आपकी हस्तरेखा का विश्लेषण',
    footer: '✨ यह केवल मनोरंजन के लिए है। गंभीर निर्णयों के लिए विशेषज्ञ से सलाह लें।',
    selectHand: 'कौन सा हाथ?',
    leftHand: 'बायां हाथ',
    rightHand: 'दायां हाथ',
    handTip: 'बायां हाथ जन्मजात गुण दिखाता है, दायां हाथ अर्जित गुण दिखाता है',
    homeBtn: 'होम पेज',
  },
  en: {
    title: 'Palm Reading Science',
    subtitle: 'Discover Your Destiny with AI',
    cameraTitle: 'Scan with Camera',
    cameraDesc: 'Place your hand in front of camera',
    uploadTitle: 'Upload Photo',
    uploadDesc: 'Choose a palm photo',
    captureBtn: 'Capture Photo',
    analyzeBtn: 'Read Palm',
    cancelBtn: 'Cancel',
    resetBtn: 'Start Over',
    clickHere: 'Click Here',
    dragText: 'or drag and drop photo here',
    loading: 'Reading your destiny lines...',
    analyzing: 'Analyzing...',
    resultTitle: 'Your Palm Reading',
    footer: '✨ For entertainment purposes only. Consult experts for serious decisions.',
    selectHand: 'Which Hand?',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    handTip: 'Left hand shows innate traits, right hand shows acquired traits',
    homeBtn: 'Home Page',
  },
  hinglish: {
    title: 'हस्त रेखा Science',
    subtitle: 'AI ke saath apni destiny discover karein',
    cameraTitle: 'Camera se Scan karein',
    cameraDesc: 'Apna haath camera ke saamne rakhein',
    uploadTitle: 'Photo Upload karein',
    uploadDesc: 'Palm ki photo choose karein',
    captureBtn: 'Photo Lein',
    analyzeBtn: 'Palm Read karein',
    cancelBtn: 'Cancel',
    resetBtn: 'Phir se Start',
    clickHere: 'Yahan Click karein',
    dragText: 'ya photo drag karein',
    loading: 'Aapki kismat ki lines read ho rahi hain...',
    analyzing: 'Analyze ho raha hai...',
    resultTitle: 'Aapki Palm Reading',
    footer: '✨ Sirf entertainment ke liye. Important decisions ke liye expert se consult karein.',
    selectHand: 'Kaunsa Haath?',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    handTip: 'Left hand natural traits dikhata hai, right hand developed traits',
    homeBtn: 'Home Page',
  }
};

// AI Prompts
const getPrompt = (lang, hand) => {
  const handInfo = hand === 'left' 
    ? 'This is the LEFT palm (shows natural/innate characteristics)' 
    : 'This is the RIGHT palm (shows developed/acquired characteristics)';

  const prompts = {
    hi: `आप एक विशेषज्ञ हस्तरेखा पाठक हैं। ${handInfo}

इस हाथ का गहन विश्लेषण करें और निम्नलिखित के बारे में विस्तृत जानकारी दें:

**मुख्य रेखाएं:**
1. जीवन रेखा (Life Line) - स्वास्थ्य, जीवन शक्ति और दीर्घायु
2. हृदय रेखा (Heart Line) - प्रेम, भावनाएं और रिश्ते
3. मस्तिष्क रेखा (Head Line) - बुद्धि, सोच और करियर
4. भाग्य रेखा (Fate Line) - जीवन की दिशा और सफलता

**अतिरिक्त विश्लेषण:**
- हाथ का आकार और उंगलियों की लंबाई
- माउंट्स की स्थिति (मंगल, शुक्र, बुध आदि)
- विशेष चिन्ह या प्रतीक

कृपया सकारात्मक, प्रेरणादायक और व्यावहारिक सलाह दें। हिंदी में जवाब दें।`,

    en: `You are an expert palm reader. ${handInfo}

Provide a comprehensive palm reading analysis covering:

**Major Lines:**
1. Life Line - Health, vitality, and longevity
2. Heart Line - Love, emotions, and relationships
3. Head Line - Intelligence, thinking, and career
4. Fate Line - Life direction and success

**Additional Analysis:**
- Hand shape and finger length
- Mount positions (Mars, Venus, Mercury, etc.)
- Special marks or symbols

Please provide positive, inspiring, and practical insights. Respond in English.`,

    hinglish: `You are an expert palm reader. ${handInfo}

Is haath ka detailed analysis provide karein covering:

**Major Lines:**
1. Life Line - Health, vitality aur longevity
2. Heart Line - Love, emotions aur relationships
3. Head Line - Intelligence, thinking aur career
4. Fate Line - Life direction aur success

**Additional Analysis:**
- Haath ka shape aur fingers ki length
- Mounts ki position (Mars, Venus, Mercury, etc.)
- Special marks ya symbols

Please positive, inspiring aur practical insights dein. Hinglish mein respond karein.`
  };

  return prompts[lang];
};

// Star Background Component
const StarryBackground = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute w-0.5 h-0.5 bg-mint rounded-full animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Language Selector Component
const LanguageSelector = ({ currentLang, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'hi', label: '🇮🇳 हिंदी', icon: '🇮🇳' },
    { code: 'en', label: '🇬🇧 English', icon: '🇬🇧' },
    { code: 'hinglish', label: '🌐 Hinglish', icon: '🌐' },
  ];

  const currentLangLabel = languages.find(l => l.code === currentLang)?.label;

  return (
    <div className="absolute top-8 right-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card-bg backdrop-blur-lg border-2 border-mint rounded-full text-text hover:bg-mint/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mint/30"
      >
        <Globe size={18} />
        <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{currentLangLabel}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-card-bg backdrop-blur-xl border-2 border-mint rounded-2xl overflow-hidden min-w-[150px] animate-slideDown">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-mint/15 transition-colors border-b border-mint/10 last:border-0 ${
                currentLang === lang.code ? 'bg-mint/20 text-mint font-semibold' : ''
              }`}
              style={{ paddingTop: '0.3em', lineHeight: '1.6' }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Hand Selection Component
const HandSelector = ({ selectedHand, onHandSelect, t }) => {
  return (
    <div className="mb-6">
      <p className="text-center text-text-dim mb-3 pt-2 text-lg font-medium" style={{ paddingTop: '0.4em', lineHeight: '1.6', color: '#cbd5e1' }}>{t.selectHand}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onHandSelect('left')}
          className={`flex-1 max-w-[200px] p-4 rounded-xl border-2 transition-all ${
            selectedHand === 'left'
              ? 'border-mint bg-mint/20 text-mint'
              : 'border-mint/30 hover:border-mint/50'
          }`}
        >
          <div className="text-3xl mb-2">🤚</div>
          <div className="font-semibold text-base" style={{ paddingTop: '0.3em', lineHeight: '1.6', color: '#ffffff' }}>{t.leftHand}</div>
        </button>
        <button
          onClick={() => onHandSelect('right')}
          className={`flex-1 max-w-[200px] p-4 rounded-xl border-2 transition-all ${
            selectedHand === 'right'
              ? 'border-mint bg-mint/20 text-mint'
              : 'border-mint/30 hover:border-mint/50'
          }`}
        >
          <div className="text-3xl mb-2">🖐️</div>
          <div className="font-semibold text-base" style={{ paddingTop: '0.3em', lineHeight: '1.6', color: '#ffffff' }}>{t.rightHand}</div>
        </button>
      </div>
      <p className="text-center text-text-dim text-base mt-3 font-medium" style={{ paddingTop: '0.3em', lineHeight: '1.6', color: '#cbd5e1' }}>{t.handTip}</p>
    </div>
  );
};

// Main App Component
function PalmReadingApp() {
  const [language, setLanguage] = useState('hi');
  const [mode, setMode] = useState(null); // 'camera' or 'upload'
  const [selectedHand, setSelectedHand] = useState('right');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const t = translations[language];

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Auto-reset if camera mode is stuck without active camera for too long
  useEffect(() => {
    if (mode === 'camera' && !isCameraActive && !image) {
      const timeout = setTimeout(() => {
        if (mode === 'camera' && !isCameraActive && !image) {
          console.log('Camera timeout - resetting');
          alert('Camera is taking too long to start. Please try again or upload a photo.');
          resetApp();
        }
      }, 10000); // 10 seconds timeout
      return () => clearTimeout(timeout);
    }
  }, [mode, isCameraActive, image]);

  // Start Camera
  const startCamera = async () => {
    try {
      // Set mode first so UI updates
      setMode('camera');
      setIsCameraActive(false); // Reset before starting
      
      // Check if running on secure context (HTTPS or localhost)
      const isSecureContext = window.isSecureContext || 
        window.location.protocol === 'https:' || 
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1';
      
      if (!isSecureContext) {
        throw new Error('SECURE_CONTEXT_REQUIRED');
      }
      
      // Check if getUserMedia is available
      if (!navigator.mediaDevices) {
        throw new Error('MEDIA_DEVICES_NOT_SUPPORTED');
      }
      
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('GET_USER_MEDIA_NOT_SUPPORTED');
      }
      
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('NO_CAMERA_FOUND');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Wait a bit for video element to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try multiple times to find video element
      let attempts = 0;
      while (!videoRef.current && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsCameraActive(true);
        };
        
        // Set active immediately as fallback
        setIsCameraActive(true);
      } else {
        // If video ref is not ready, stop the stream
        stream.getTracks().forEach(track => track.stop());
        throw new Error('VIDEO_ELEMENT_NOT_READY');
      }
    } catch (error) {
      console.error('Camera error:', error);
      
      let errorMessage = 'Camera not available. Please upload a photo instead.';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access denied. Please:\n1. Click the camera icon in your browser\'s address bar\n2. Allow camera access\n3. Try again\n\nOr upload a photo instead.';
      } else if (error.name === 'NotFoundError' || error.message === 'NO_CAMERA_FOUND') {
        errorMessage = 'No camera found on this device. Please upload a photo instead.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is being used by another application. Please close other apps using the camera and try again, or upload a photo instead.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera settings not supported. Please upload a photo instead.';
      } else if (error.message === 'SECURE_CONTEXT_REQUIRED') {
        errorMessage = 'Camera requires HTTPS connection. Please use https:// or localhost, or upload a photo instead.';
      } else if (error.message === 'MEDIA_DEVICES_NOT_SUPPORTED' || error.message === 'GET_USER_MEDIA_NOT_SUPPORTED') {
        errorMessage = 'Camera not supported in this browser. Please use Chrome, Firefox, Safari, or Edge, or upload a photo instead.';
      } else if (error.message === 'VIDEO_ELEMENT_NOT_READY') {
        errorMessage = 'Video element not ready. Please refresh the page and try again, or upload a photo instead.';
      }
      
      alert(errorMessage);
      resetApp();
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setMode(null);
  };

  // Capture Image from Camera
  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9);
      setImage(imageData);
      stopCamera();
      
      // Auto-analyze after capturing photo
      setTimeout(() => {
        analyzePalm();
      }, 500); // Small delay to ensure image is set
    }
  };

  // Handle File Upload
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze Palm
  const analyzePalm = async () => {
    if (!image) return;

    setIsLoading(true);
    
    try {
      // Try OpenAI API first (if key available), then Anthropic, then fallback
      const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;
      const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      
      let resultText = '';
      
      // Try OpenAI API
      if (openAIKey) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openAIKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              max_tokens: 1500,
              messages: [{
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: {
                      url: image
                    }
                  },
                  {
                    type: 'text',
                    text: getPrompt(language, selectedHand)
                  }
                ]
              }]
            })
          });

          if (response.ok) {
            const data = await response.json();
            resultText = data.choices[0]?.message?.content || '';
            if (resultText) {
              setResult(resultText);
              setIsLoading(false);
              return;
            }
          }
        } catch (openAIError) {
          console.log('OpenAI API failed, trying Anthropic...', openAIError);
        }
      }
      
      // Try Anthropic API
      if (anthropicKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1500,
            messages: [{
              role: 'user',
              content: [
                {
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: image.split(',')[1]
                  }
                },
                {
                  type: 'text',
                  text: getPrompt(language, selectedHand)
                }
              ]
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        resultText = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n');
        
        setResult(resultText);
        setIsLoading(false);
        return;
      }
      
      // Fallback: Mock response if no API keys
      if (!openAIKey && !anthropicKey) {
        const mockResponse = language === 'hi' 
          ? `आपकी हस्तरेखा का विश्लेषण:\n\nजीवन रेखा: आपकी जीवन रेखा मजबूत और लंबी है, जो अच्छे स्वास्थ्य और दीर्घायु का संकेत देती है।\n\nहृदय रेखा: आपकी हृदय रेखा स्पष्ट है, जो गहरे भावनात्मक संबंधों की ओर इशारा करती है।\n\nमस्तिष्क रेखा: आपकी मस्तिष्क रेखा तेज बुद्धि और रचनात्मक सोच दिखाती है।\n\nभाग्य रेखा: आपकी भाग्य रेखा सफलता और उपलब्धियों का संकेत देती है।\n\n⚠️ यह एक mock response है। वास्तविक विश्लेषण के लिए API key सेट करें।`
          : language === 'en'
          ? `Your Palm Reading Analysis:\n\nLife Line: Your life line is strong and long, indicating good health and longevity.\n\nHeart Line: Your heart line is clear, suggesting deep emotional connections.\n\nHead Line: Your head line shows sharp intelligence and creative thinking.\n\nFate Line: Your fate line indicates success and achievements.\n\n⚠️ This is a mock response. Please set an API key for real analysis.`
          : `Aapki Palm Reading:\n\nLife Line: Strong aur long, good health dikhata hai.\n\nHeart Line: Clear hai, deep emotions.\n\nHead Line: Sharp intelligence aur creativity.\n\nFate Line: Success aur achievements.\n\n⚠️ Yeh mock response hai. Real analysis ke liye API key set karein.`;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResult(mockResponse);
        setIsLoading(false);
        return;
      }
      
      throw new Error('No API keys configured');
      
    } catch (error) {
      const errorMessage = error.message || 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
      console.error('Palm analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset App
  const resetApp = () => {
    setMode(null);
    setImage(null);
    setResult(null);
    setIsLoading(false);
    setIsCameraActive(false);
    stopCamera();
  };

  // Force reset on mount if stuck
  useEffect(() => {
    // Reset if stuck in loading state for too long
    if (isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          alert('Request timeout. Please try again.');
        }
      }, 30000); // 30 seconds timeout
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Render Initial Options
  const renderInitialOptions = () => (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <button
        onClick={async () => {
          await startCamera();
        }}
        className="group relative bg-secondary/50 border-2 border-mint/40 rounded-2xl p-8 text-center transition-all hover:border-mint hover:-translate-y-2 hover:shadow-xl hover:shadow-mint/30 overflow-hidden"
      >
        <div className="absolute inset-0 bg-mint/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
        <Camera className="w-12 h-12 mx-auto mb-4 text-mint relative z-10" />
        <h3 className="text-xl font-bold text-mint mb-2 font-cinzel relative z-10" style={{ paddingTop: '0.3em', lineHeight: '1.6' }}>{t.cameraTitle}</h3>
        <p className="text-text-dim relative z-10 text-base font-medium" style={{ paddingTop: '0.2em', lineHeight: '1.6', color: '#cbd5e1' }}>{t.cameraDesc}</p>
      </button>

      <button
        onClick={() => setMode('upload')}
        className="group relative bg-secondary/50 border-2 border-purple/40 rounded-2xl p-8 text-center transition-all hover:border-purple hover:-translate-y-2 hover:shadow-xl hover:shadow-purple/30 overflow-hidden"
      >
        <div className="absolute inset-0 bg-purple/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
        <Upload className="w-12 h-12 mx-auto mb-4 text-purple relative z-10" />
        <h3 className="text-xl font-bold text-purple mb-2 font-cinzel relative z-10" style={{ paddingTop: '0.3em', lineHeight: '1.6' }}>{t.uploadTitle}</h3>
        <p className="text-text-dim relative z-10 text-base font-medium" style={{ paddingTop: '0.2em', lineHeight: '1.6', color: '#cbd5e1' }}>{t.uploadDesc}</p>
      </button>
    </div>
  );

  // Render Camera View
  const renderCameraView = () => (
    <div className="space-y-4">
      <HandSelector selectedHand={selectedHand} onHandSelect={setSelectedHand} t={t} />
      
      <div className="relative rounded-2xl overflow-hidden border-2 border-mint shadow-xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-w-2xl mx-auto"
        />
      </div>
      
      <div className="flex gap-4 justify-center">
        <button
          onClick={captureImage}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint to-blue rounded-full text-primary font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-mint/50 transition-all"
        >
          <Camera size={20} />
          <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.captureBtn}</span>
        </button>
        <button
          onClick={stopCamera}
          className="flex items-center gap-2 px-6 py-3 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
        >
          <X size={20} />
          <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.cancelBtn}</span>
        </button>
      </div>
    </div>
  );

  // Render Upload View
  const renderUploadView = () => (
    <div className="space-y-4">
      <HandSelector selectedHand={selectedHand} onHandSelect={setSelectedHand} t={t} />
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        className="hidden"
      />
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files[0]);
        }}
        className="border-2 border-dashed border-mint rounded-2xl p-12 text-center cursor-pointer hover:border-purple hover:bg-purple/10 transition-all"
      >
        <Upload className="w-16 h-16 mx-auto mb-4 text-mint" />
        <p className="text-xl font-semibold text-mint mb-2" style={{ paddingTop: '0.3em', lineHeight: '1.6' }}>{t.clickHere}</p>
        <p className="text-text-dim text-base font-medium" style={{ paddingTop: '0.2em', lineHeight: '1.6', color: '#cbd5e1' }}>{t.dragText}</p>
      </div>

      {image && (
        <div className="space-y-4">
          <img
            src={image}
            alt="Palm"
            className="max-w-md mx-auto rounded-xl border-2 border-mint shadow-xl"
          />
          <div className="flex gap-4 justify-center">
            <button
              onClick={analyzePalm}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint to-blue rounded-full text-primary font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-mint/50 transition-all disabled:opacity-50"
            >
              <Sparkles size={20} />
              <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.analyzeBtn}</span>
            </button>
            <button
              onClick={() => setImage(null)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
            >
              <X size={20} />
              {t.cancelBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render Loading
  const renderLoading = () => (
    <div className="text-center py-12">
      <Loader2 className="w-12 h-12 mx-auto mb-4 text-mint animate-spin" />
      <p className="text-xl text-text font-semibold">{t.analyzing}</p>
      <p className="text-text-dim mt-2 text-base font-medium" style={{ color: '#cbd5e1' }}>{t.loading}</p>
    </div>
  );

  // Render Result
  const renderResult = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-3 justify-center">
        <Sparkles className="text-mint" size={24} />
        <h2 className="text-2xl font-bold text-mint font-cinzel">{t.resultTitle}</h2>
        <Sparkles className="text-mint" size={24} />
      </div>
      
      {image && (
        <img
          src={image}
          alt="Analyzed Palm"
          className="max-w-xs mx-auto rounded-xl border-2 border-mint/30 shadow-lg"
        />
      )}
      
      <div className="bg-secondary/70 backdrop-blur-sm border-l-4 border-mint rounded-xl p-6">
        <div className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-text leading-relaxed font-spectral">
            {result}
          </pre>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button
          onClick={resetApp}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-mint to-blue rounded-full text-primary font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-mint/50 transition-all"
        >
          <Home size={20} />
          <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.homeBtn}</span>
        </button>
        <button
          onClick={resetApp}
          className="flex items-center gap-2 px-8 py-3 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
        >
          <RotateCcw size={20} />
          <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.resetBtn}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary text-text relative overflow-hidden">
      {/* Background Effects */}
      <StarryBackground />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-mint/15 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple/12 rounded-full blur-3xl" />
        <div className="absolute top-[50%] left-[50%] w-96 h-96 bg-blue/10 rounded-full blur-3xl" />
      </div>

      {/* Language Selector */}
      <LanguageSelector currentLang={language} onLanguageChange={setLanguage} />
      
      {/* Emergency Reset Button - Always visible */}
      {(isLoading || result || mode || image) && (
        <button
          onClick={resetApp}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-secondary/90 backdrop-blur-lg border-2 border-mint rounded-full text-mint hover:bg-mint hover:text-primary transition-all text-sm"
          title="Reset App"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        {/* Header */}
        <header className="text-center py-12 animate-fadeIn overflow-visible">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-cinzel bg-gradient-to-r from-mint via-blue to-purple bg-clip-text text-transparent leading-relaxed pt-4 pb-2" style={{ lineHeight: '1.5', paddingTop: '0.5em', paddingBottom: '0.3em' }}>
            {t.title}
          </h1>
          <p className="text-xl text-text-dim font-medium" style={{ paddingTop: '0.3em', lineHeight: '1.6', color: '#cbd5e1' }}>{t.subtitle}</p>
        </header>

        {/* Main Card */}
        <div className="bg-card-bg backdrop-blur-xl border border-mint/30 rounded-3xl p-8 shadow-2xl animate-fadeIn overflow-visible">
          <canvas ref={canvasRef} className="hidden" />
          
          {isLoading && renderLoading()}
          
          {result && !isLoading && renderResult()}
          
          {!isLoading && !result && !mode && renderInitialOptions()}
          
          {!isLoading && !result && mode === 'camera' && !image && (
            <div className="space-y-4">
              {/* Always render video element (hidden until active) so ref is available */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-mint shadow-xl" style={{ display: isCameraActive ? 'block' : 'none' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full max-w-2xl mx-auto" 
                />
              </div>
              
              {isCameraActive ? (
                <>
                  <HandSelector selectedHand={selectedHand} onHandSelect={setSelectedHand} t={t} />
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={captureImage}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint to-blue rounded-full text-primary font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-mint/50 transition-all"
                    >
                      <Camera size={20} />
                      <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.captureBtn}</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
                    >
                      <X size={20} />
                      <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.cancelBtn}</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 text-mint animate-spin" />
                  <p className="text-text-dim font-medium mb-4" style={{ color: '#cbd5e1' }}>Camera starting...</p>
                  <p className="text-text-dim text-sm mb-4" style={{ color: '#94a3b8' }}>Please allow camera access when prompted</p>
                  <button
                    onClick={resetApp}
                    className="px-6 py-2 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
                  >
                    <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          )}
          
          {!isLoading && !result && mode === 'upload' && !image && renderUploadView()}
          
          {!isLoading && !result && image && mode === 'camera' && (
            <div className="space-y-4">
              <HandSelector selectedHand={selectedHand} onHandSelect={setSelectedHand} t={t} />
              <img
                src={image}
                alt="Captured Palm"
                className="max-w-md mx-auto rounded-xl border-2 border-mint shadow-xl"
              />
              <div className="flex gap-4 justify-center">
                <button
                  onClick={analyzePalm}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint to-blue rounded-full text-primary font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-mint/50 transition-all"
                >
                  <Sparkles size={20} />
                  {t.analyzeBtn}
                </button>
                <button
                  onClick={resetApp}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
                >
                  <X size={20} />
                  {t.cancelBtn}
                </button>
              </div>
            </div>
          )}
          
          {!isLoading && !result && image && mode === 'upload' && (
            <div className="space-y-4">
              <HandSelector selectedHand={selectedHand} onHandSelect={setSelectedHand} t={t} />
              <img
                src={image}
                alt="Uploaded Palm"
                className="max-w-md mx-auto rounded-xl border-2 border-mint shadow-xl"
              />
              <div className="flex gap-4 justify-center">
                <button
                  onClick={analyzePalm}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint to-blue rounded-full text-primary font-semibold hover:-translate-y-1 hover:shadow-lg hover:shadow-mint/50 transition-all disabled:opacity-50"
                >
                  <Sparkles size={20} />
                  <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.analyzeBtn}</span>
                </button>
                <button
                  onClick={() => {
                    setImage(null);
                    setMode(null);
                  }}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-mint text-mint rounded-full hover:bg-mint hover:text-primary transition-all"
                >
                  <X size={20} />
                  <span style={{ paddingTop: '0.2em', lineHeight: '1.6' }}>{t.cancelBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-text-dim text-base font-medium" style={{ color: '#cbd5e1' }}>
          <p>{t.footer}</p>
        </footer>
      </div>
    </div>
  );
}

export default PalmReadingApp;