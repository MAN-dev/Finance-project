import React, { useRef } from 'react';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelected: (base64: string) => void;
  label?: string;
  shape?: 'circle' | 'square' | 'rect';
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageSelected, 
  label = "Upload Image",
  shape = 'circle',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getShapeClasses = () => {
    switch(shape) {
      case 'circle': return 'rounded-full w-24 h-24';
      case 'square': return 'rounded-xl w-32 h-32';
      case 'rect': return 'rounded-xl w-full h-40';
      default: return 'rounded-xl w-32 h-32';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer overflow-hidden border-2 border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50 transition-all bg-zinc-900/30 flex items-center justify-center shrink-0 ${getShapeClasses()}`}
      >
        {currentImage ? (
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 p-4 text-center">
             {shape === 'circle' ? <Camera size={24} /> : <ImageIcon size={32} />}
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <Upload size={20} className="text-white" />
        </div>
      </div>
      {label && <button onClick={() => fileInputRef.current?.click()} className="text-xs text-primary hover:text-white font-medium transition-colors">{label}</button>}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
    </div>
  );
};