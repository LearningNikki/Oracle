import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageChange, compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const removeImage = () => {
    onImageChange(null);
  };

  return (
    <div className="w-full">
      {!compact && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          1. Upload Visual
        </label>
      )}
      
      {image ? (
        <div className={`relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-800 shadow-xl ${compact ? 'h-40' : 'h-64 md:h-80'}`}>
          <img 
            src={image} 
            alt="Upload preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              onClick={removeImage}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transform transition hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`
            border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200
            ${compact ? 'p-4 h-40' : 'p-8'}
            ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="bg-slate-700/50 p-3 rounded-full mb-3">
            <ImageIcon className={`text-indigo-400 ${compact ? 'w-6 h-6' : 'w-8 h-8'}`} />
          </div>
          <p className="text-slate-300 font-medium mb-1 text-center text-sm">
            {compact ? 'Upload' : 'Click to upload or drag & drop'}
          </p>
          {!compact && (
            <p className="text-slate-500 text-xs text-center">
              PNG, JPG, GIF up to 5MB
            </p>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            id={compact ? "image-input-compact" : "image-input"}
          />
          <label 
            htmlFor={compact ? "image-input-compact" : "image-input"} 
            className="absolute inset-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;