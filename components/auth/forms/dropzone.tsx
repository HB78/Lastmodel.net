'use client';

import { Camera, Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

const Dropzone = ({
  uploadedFiles,
  onFilesChange,
  maxFiles = 5,
  disabled = false,
  className = '',
}: DropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots = maxFiles - uploadedFiles.length;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      onFilesChange([...uploadedFiles, ...filesToAdd]);
    },
    [uploadedFiles, onFilesChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploadedFiles.length >= maxFiles || disabled,
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : uploadedFiles.length >= maxFiles
              ? 'cursor-not-allowed border-gray-200 bg-gray-50'
              : 'hover:border-primary/50 border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        {uploadedFiles.length >= maxFiles ? (
          <p className="text-sm text-gray-500">
            Limite atteinte ({maxFiles} photos max)
          </p>
        ) : isDragActive ? (
          <p className="text-primary text-sm">Déposez les photos ici...</p>
        ) : (
          <>
            <p className="text-sm text-gray-600">Glissez vos photos ici</p>
            <p className="mt-1 text-xs text-gray-500">
              ou cliquez pour sélectionner ({uploadedFiles.length}/{maxFiles})
            </p>
          </>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-2 rounded-lg bg-gray-50 p-2"
            >
              <Camera className="h-4 w-4 text-gray-400" />
              <span className="flex-1 truncate text-xs">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
                disabled={disabled}
              >
                <X className="h-4 w-4 text-red-500 hover:text-red-700" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropzone;
