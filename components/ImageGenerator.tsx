import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Maximize2, 
  Wand2, 
  Layers,
  Eraser,
  History,
  Palette,
  ChevronRight,
  Info,
  AlertCircle,
  Copy,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { AspectRatio, GeneratedImage } from '../types';

const LOADING_PHASES = [
  "INITIALIZING NEURAL PATHWAYS...",
  "ANALYZING VISUAL REFERENCE...",
  "PARSING SEMANTIC STRUCTURES...",
  "SYNTHESIZING GEOMETRY...",
  "CALCULATING LIGHT & REFLECTIONS...",
  "REFINING TEXTURE DETAILS...",
  "POLISHING FINAL COMPOSITION..."
];

const STYLE_PRESETS = [
  "Cinematic",
  "Photorealistic",
  "Cyberpunk",
  "Studio Lighting",
  "Oil Painting",
  "Minimalist",
  "Noir",
  "Vaporwave"
];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedError, setCopiedError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Animation states
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, left: number, top: number, delay: number}>>([]);

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    let phaseInterval: ReturnType<typeof setInterval>;
    let progressInterval: ReturnType<typeof setInterval>;

    if (isGenerating) {
      setLoadingPhase(0);
      setProgress(0);

      phaseInterval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % LOADING_PHASES.length);
      }, 1500);

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          // Non-linear progress simulation
          const remaining = 100 - prev;
          const noise = Math.random() * 2; 
          const increment = Math.max(0.05, (remaining * 0.02) + (prev < 30 ? 0.5 : 0.05) + noise);
          return Math.min(99, prev + increment);
        });
      }, 50);

    } else {
      setProgress(100);
    }

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim() && !referenceImage) return;
    
    setIsGenerating(true);
    setError(null);
    setCopiedError(false);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio, referenceImage || undefined);
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: prompt,
        aspectRatio: aspectRatio,
        timestamp: Date.now(),
      };
      
      setResult(newImage);
      setHistory(prev => [newImage, ...prev]);
      
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during creation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddStyle = (style: string) => {
    if (!prompt.includes(style)) {
      setPrompt(prev => prev ? `${prev}, ${style}` : style);
    }
  };

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `luminia-tomo-art-${img.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    setPrompt('');
    setReferenceImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const selectFromHistory = (img: GeneratedImage) => {
    setResult(img);
    setPrompt(img.prompt);
    setAspectRatio(img.aspectRatio);
  };

  const handleCopyError = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopiedError(true);
      setTimeout(() => setCopiedError(false), 2000);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please select an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8 w-full min-h-full flex flex-col gap-6">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[600px]">
        
        {/* Left Column: Control Station */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          <div className="glass-panel rounded-2xl p-1 shadow-2xl shadow-black/50 relative overflow-hidden group border-white/10 flex-1 flex flex-col min-h-[500px]">
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
            
            <div className="p-7 relative z-10 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-bold text-gold-500 tracking-[0.2em] flex items-center gap-2 uppercase">
                  <Layers className="w-4 h-4" />
                  Studio Configuration
                </h2>
                <button 
                  onClick={handleClear}
                  className="text-[10px] text-slate-500 hover:text-white transition-colors flex items-center gap-1 group/reset uppercase tracking-wider font-medium"
                >
                  <Eraser className="w-3 h-3 group-hover/reset:rotate-12 transition-transform" />
                  Reset
                </button>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-6 flex-none">
                <label className="block text-[10px] font-semibold text-slate-400 mb-3 uppercase tracking-widest">
                  Canvas Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[AspectRatio.Square, AspectRatio.Landscape, AspectRatio.Portrait].map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`relative py-3 px-2 rounded-lg text-xs font-medium transition-all duration-300 border backdrop-blur-sm ${
                        aspectRatio === r
                          ? 'bg-gold-500/10 border-gold-500/40 text-gold-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300 hover:border-white/10'
                      }`}
                    >
                      {r}
                      {aspectRatio === r && (
                        <span className="absolute inset-0 rounded-lg ring-1 ring-gold-500/20 animate-pulse"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

               {/* Visual Reference Input */}
              <div className="mb-6 flex-none">
                <label className="block text-[10px] font-semibold text-slate-400 mb-3 uppercase tracking-widest flex justify-between">
                   <span>Visual Reference</span>
                   <span className="text-slate-600 text-[9px] normal-case tracking-normal">(Optional)</span>
                </label>
                
                {!referenceImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer group/upload text-center"
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleFileSelect}
                    />
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                        <Upload className="w-4 h-4 text-slate-400 group-hover/upload:text-gold-400" />
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider group-hover/upload:text-slate-300">
                        Upload Reference Image
                      </span>
                    </div>
                  </div>
                ) : (
                   <div className="relative rounded-xl overflow-hidden border border-gold-500/30 group/preview h-32 w-full bg-black/40 flex items-center justify-center">
                      <img src={referenceImage} alt="Reference" className="h-full w-full object-contain opacity-80" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                         <button 
                           onClick={() => {
                             setReferenceImage(null);
                             if (fileInputRef.current) fileInputRef.current.value = '';
                           }}
                           className="bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 rounded-full p-2 transition-all"
                         >
                            <X className="w-4 h-4" />
                         </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-gold-500 text-obsidian text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-lg">
                        Ref
                      </div>
                   </div>
                )}
              </div>

              {/* Prompt Input */}
              <div className="mb-6 group relative z-10 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-3 flex-none">
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Prompt Engineering
                  </label>
                  <span className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Wand2 className="w-3 h-3" />
                    AI Assisted
                  </span>
                </div>
                
                <div className="relative flex-1 min-h-[160px] flex flex-col">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={referenceImage ? "Describe how to modify the reference image..." : "Describe your vision with precision..."}
                    className="flex-1 w-full bg-black/40 text-slate-200 placeholder:text-slate-700 p-5 rounded-xl border border-white/5 focus:border-gold-500/30 focus:ring-1 focus:ring-gold-500/10 transition-all resize-none text-sm leading-relaxed scrollbar-thin outline-none shadow-inner font-light tracking-wide"
                  />
                  
                  {/* Style Chips */}
                  <div className="absolute bottom-2 left-2 right-2 flex gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none mask-fade-right">
                    {STYLE_PRESETS.map(style => (
                      <button
                        key={style}
                        onClick={() => handleAddStyle(style)}
                        className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-gold-500/20 border border-white/5 hover:border-gold-500/30 text-[10px] text-slate-400 hover:text-gold-200 transition-all uppercase tracking-wider whitespace-nowrap"
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/20 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 relative group">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">System Exception</h3>
                    <p className="text-[11px] text-red-200/80 font-mono leading-relaxed break-words">{error}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setError(null)}
                      className="text-red-400/50 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleCopyError}
                      className="text-red-400/50 hover:text-red-400 transition-colors"
                      title="Copy error details"
                    >
                      {copiedError ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt.trim() && !referenceImage)}
                className="w-full relative py-4 bg-gradient-to-r from-gold-600 to-amber-600 hover:from-gold-500 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:cursor-not-allowed text-white font-bold tracking-[0.2em] rounded-xl overflow-hidden transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] flex items-center justify-center gap-3 group/btn"
              >
                <span className="relative z-10 flex items-center gap-2 text-xs uppercase">
                  {isGenerating ? 'Synthesizing...' : 'Initialize Generation'}
                  {!isGenerating && <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                </span>
                
                {/* Button Shine Effect */}
                {!isGenerating && (
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization Deck */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[500px]">
          <div className="glass-panel rounded-2xl p-1 relative flex-1 flex flex-col overflow-hidden shadow-2xl shadow-black/80 border-white/10">
            
            {/* Main Canvas Area */}
            <div className="relative flex-1 bg-black/60 rounded-xl overflow-hidden flex items-center justify-center group/canvas">
              
              {/* Empty State */}
              {!isGenerating && !result && (
                <div className="text-center opacity-30 flex flex-col items-center gap-6 p-8">
                  <div className="w-32 h-32 rounded-full border border-dashed border-white/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                    <ImageIcon className="w-12 h-12 text-white/40" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-display tracking-widest text-white/60">LUMINIA<span className="text-gold-500">.</span>CANVAS</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Awaiting Visual Parameters</p>
                  </div>
                </div>
              )}

              {/* Loading State - Quantum Core */}
              {isGenerating && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
                  {/* Particle Field */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                     {particles.map((p) => (
                        <div 
                          key={p.id}
                          className="absolute w-1 h-1 bg-gold-400 rounded-full opacity-0 animate-[float_3s_ease-in-out_infinite]"
                          style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            animationDelay: `${p.delay}s`
                          }}
                        />
                     ))}
                  </div>

                  {/* Core Animation */}
                  <div className="relative w-48 h-48 flex items-center justify-center mb-12">
                     {/* Outer Gyro Ring */}
                     <div className="absolute inset-0 rounded-full border border-gold-500/10 border-t-gold-500/60 animate-[spin_3s_linear_infinite]"></div>
                     {/* Inner Gyro Ring (Reverse & Tilted) */}
                     <div className="absolute inset-4 rounded-full border border-amber-500/10 border-b-amber-500/60 animate-[spin_2s_linear_infinite_reverse]"></div>
                     {/* Static decorative ring */}
                     <div className="absolute inset-0 rounded-full border border-white/5 scale-110"></div>
                     
                     {/* Center Core */}
                     <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-gold-500/20 to-amber-600/20 rounded-full backdrop-blur-xl flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-pulse">
                        <Zap className="w-10 h-10 text-gold-400 animate-[pulse_1s_ease-in-out_infinite]" />
                     </div>
                  </div>

                  {/* Status Text */}
                  <div className="text-center space-y-4 relative z-10">
                    <div className="h-6 overflow-hidden">
                       <p className="text-xs font-mono text-gold-400 tracking-[0.2em] animate-pulse">
                         {LOADING_PHASES[loadingPhase]}
                       </p>
                    </div>
                    
                    {/* Laser Progress Bar */}
                    <div className="w-80 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-gold-500 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{Math.floor(progress)}%</p>
                  </div>
                </div>
              )}

              {/* Result Image */}
              {result && !isGenerating && (
                <div className="relative w-full h-full flex items-center justify-center p-4 group/image">
                  <img 
                    src={result.url} 
                    alt={result.prompt}
                    className="max-w-full max-h-full object-contain rounded shadow-2xl shadow-black/50"
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 translate-y-4 group-hover/image:opacity-100 group-hover/image:translate-y-0 transition-all duration-300">
                    <button 
                      onClick={() => handleDownload(result)}
                      className="bg-black/80 hover:bg-gold-600 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-colors shadow-lg"
                      title="Download High-Res"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button 
                      className="bg-black/80 hover:bg-gold-600 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-colors shadow-lg"
                      title="Fullscreen View"
                      onClick={() => window.open(result.url, '_blank')}
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Session History (Filmstrip) */}
            {history.length > 0 && (
              <div className="h-24 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center px-4 gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                 <div className="flex-none flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-2 border-r border-white/10 pr-4 h-1/2">
                    <History className="w-3 h-3" />
                    Session
                 </div>
                 {history.map((img) => (
                    <div 
                      key={img.timestamp} 
                      onClick={() => selectFromHistory(img)}
                      className={`relative w-16 h-16 flex-none rounded-lg overflow-hidden cursor-pointer border transition-all ${
                        result?.timestamp === img.timestamp 
                        ? 'border-gold-500 ring-2 ring-gold-500/20 opacity-100 scale-105' 
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                       <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Global Style for Float Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0; }
          50% { transform: translateY(-20px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default ImageGenerator;