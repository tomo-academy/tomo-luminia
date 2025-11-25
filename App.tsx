import React from 'react';
import { Sparkles, Hexagon } from 'lucide-react';
import ImageGenerator from './components/ImageGenerator';

const App: React.FC = () => {
  return (
    <div className="h-screen bg-obsidian flex flex-col relative overflow-hidden font-sans text-slate-200">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat"></div>
         
         {/* Gradients */}
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-950/30 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-950/20 rounded-full blur-[150px]"></div>
         <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-gold-900/5 rounded-full blur-[180px]"></div>
      </div>

      {/* Header */}
      <header className="flex-none z-50 border-b border-white/5 bg-obsidian/80 backdrop-blur-xl">
        <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer select-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 bg-gold-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
              <img 
                src="https://z-cdn-media.chatglm.cn/files/cea69af6-6d68-4581-856c-5df765b22ea5_cropped_circle_image%20%281%29.png?auth_key=1763892820-dc2d90f4b3304401a8588c2566c619f3-0-2975beb137d987845caf20db770fad21" 
                alt="LUMINIA Logo" 
                className="relative w-full h-full object-cover rounded-full border border-white/10 shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl md:text-2xl font-display text-white tracking-wider flex items-baseline">
                LUMINIA 
                <span className="text-[10px] font-sans text-gold-500/80 font-normal tracking-[0.2em] ml-3 uppercase translate-y-[-1px]">
                  by TOMO
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
                 <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-medium">
                   Pro Studio
                 </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current Model</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-gold-500" />
                GEMINI 2.5 FLASH
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col overflow-hidden">
        {/* We pass a class to ensure it takes full height and manages its own internal scrolling if needed */}
        <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-gold-500/50">
          <ImageGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-none border-t border-white/5 py-4 bg-obsidian/50 backdrop-blur-sm relative z-10">
         <div className="max-w-[1800px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
            <p className="text-[10px] text-slate-600 tracking-widest font-light uppercase">
              Luminia by TOMO Creative Suite • Powered by Google Gemini
            </p>
            <div className="flex gap-6 text-[10px] text-slate-600 uppercase tracking-widest">
               <span className="hover:text-gold-500 cursor-pointer transition-colors">Privacy</span>
               <span className="hover:text-gold-500 cursor-pointer transition-colors">Terms</span>
               <span className="hover:text-gold-500 cursor-pointer transition-colors">v3.0.0</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;