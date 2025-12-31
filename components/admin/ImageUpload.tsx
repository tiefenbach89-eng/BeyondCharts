'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onFileSelect?: (file: File) => void;
}

export function ImageUpload({ value, onChange, onFileSelect }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Bitte nur Bilder hochladen!');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);

    // Optional callback for file processing
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`
              p-4 rounded-2xl transition-all duration-200
              ${isDragging ? 'bg-blue-100 scale-110' : 'bg-white'}
            `}>
              <Upload className={`h-8 w-8 ${isDragging ? 'text-blue-600' : 'text-slate-400'}`} />
            </div>
            
            <div>
              <p className="text-base font-semibold text-slate-700 mb-1">
                {isDragging ? 'Jetzt loslassen!' : 'Bild hochladen'}
              </p>
              <p className="text-sm text-slate-500">
                Klicken oder Drag & Drop
              </p>
              <p className="text-xs text-slate-400 mt-2">
                PNG, JPG, WEBP bis zu 10MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-3 right-3 px-4 py-2 bg-white text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Ersetzen
          </button>
        </div>
      )}
    </div>
  );
}
