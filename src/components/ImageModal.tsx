import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="w-full flex items-center justify-between p-4 bg-slate-900/90 border-b border-white/10 absolute top-0 left-0 right-0 z-10">
          <h3 className="text-sm font-bold text-white truncate max-w-[70%]">
            {title || 'Receipt Preview'}
          </h3>
          <div className="flex items-center gap-3">
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
              title="Open original"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Image Container */}
        <div className="w-full h-full overflow-auto pt-16 pb-4 px-4 flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt="Receipt Full Size" 
            className="max-w-full max-h-full object-contain rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};
