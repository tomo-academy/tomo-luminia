import React, { useState } from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectKey = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await (window as any).aistudio.openSelectKey();
      // Assume success if no error thrown, call parent handler
      onKeySelected();
    } catch (err: any) {
      console.error("Key selection failed:", err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        setError("Session expired or invalid. Please try selecting the key again.");
      } else {
        setError("Failed to select API key. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full">
        <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Key className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          API Key Required
        </h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          To use the <strong>Nano Banana Pro</strong> (Gemini 3 Pro) model for high-fidelity 4K image generation, you must select a paid API key from a Google Cloud Project.
        </p>

        <button
          onClick={handleSelectKey}
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-brand-200/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            "Select API Key"
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-100">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-brand-600 flex items-center justify-center gap-1 transition-colors"
          >
            Learn more about billing
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySelector;