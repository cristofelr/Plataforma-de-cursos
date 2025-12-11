import React, { useState, useRef } from 'react';
import { generateOrEditImage } from '../services/geminiService';
import { Loader2, Wand2, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageEditorProps {
  currentImageUrl: string;
  onImageUpdate: (newUrl: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ currentImageUrl, onImageUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newImage = await generateOrEditImage(prompt, currentImageUrl);
      onImageUpdate(newImage);
      setPrompt('');
    } catch (err) {
      setError("Falha ao gerar imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpdate(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 border border-brand-border bg-brand-surface p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-brand-neon tracking-wider uppercase flex items-center gap-2">
           <ImageIcon size={16} /> Gerenciador de Imagem
        </label>
        <span className="text-xs text-brand-500 bg-brand-900/50 border border-brand-700 px-2 py-1 rounded flex items-center gap-1 font-mono">
          <Wand2 size={12} /> AI & UPLOAD
        </span>
      </div>
      
      <div className="relative group overflow-hidden rounded-md border border-brand-border bg-brand-dark/50">
        <img 
          src={currentImageUrl} 
          alt="Preview" 
          className="w-full h-48 object-cover"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-brand-neon h-8 w-8" />
              <span className="text-xs text-brand-neon font-mono animate-pulse">PROCESSANDO...</span>
            </div>
          </div>
        )}
      </div>

      {/* Manual Upload Button */}
      <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            className="flex-1 bg-brand-dark border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white px-4 py-2 rounded flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]"
          >
            <Upload size={16} /> Carregar Foto (Upload)
          </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase my-1">
         <div className="h-px bg-brand-border flex-1"></div>
         <span>OU GERAR COM IA</span>
         <div className="h-px bg-brand-border flex-1"></div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="CMD: 'Adicionar filtro cyber'..."
          className="flex-1 px-3 py-2 bg-brand-dark border border-brand-border rounded text-sm text-brand-neon focus:outline-none focus:border-brand-neon focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] font-mono placeholder:text-slate-600"
          disabled={isLoading}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded border border-transparent hover:border-brand-neon hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold transition-all uppercase tracking-wide"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        </button>
      </div>
      
      {error && <p className="text-xs text-red-500 font-mono">ERROR: {error}</p>}
    </div>
  );
};