import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import {
  uploadToCloudinary,
  getStoredCloudinaryConfig,
  CloudinaryUploadResult,
} from '../../services/cloudinaryService';
import { useToast } from '../../context/ToastContext';

interface CloudinaryUploaderProps {
  onUploadSuccess: (secureUrl: string, result?: CloudinaryUploadResult) => void;
  currentImageUrl?: string;
  folder?: string;
  compact?: boolean;
  label?: string;
  helperText?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  onUploadSuccess,
  currentImageUrl,
  folder = 'novamobile_products',
  compact = false,
  label = 'Upload Product Image',
  helperText = 'PNG, JPG, WEBP, or AVIF up to 10MB',
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');

  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP, AVIF)');
      showToast('Invalid file format. Please upload an image.', 'error');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 10MB limit.');
      showToast('File too large (max 10MB)', 'error');
      return;
    }

    // Local instant preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Check configuration
    const config = getStoredCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      setErrorMsg('Image upload storage not configured. Please check environment configuration.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const result = await uploadToCloudinary(file, {
        folder,
        tags: 'novamobile,smartphone_catalogue',
        onProgress: (percent) => {
          setUploadProgress(Math.max(10, percent));
        },
      });

      setUploadProgress(100);
      setPreviewUrl(result.secureUrl);
      onUploadSuccess(result.secureUrl, result);
      showToast('Image uploaded successfully!', 'success');
    } catch (err: any) {
      const isUnsignedError = err.message?.includes('whitelisted for unsigned uploads');
      const friendlyMsg = isUnsignedError
        ? 'Your Cloudinary Upload Preset is currently set to "Signed". In your Cloudinary Console (Settings > Upload > Upload presets), please edit your preset and change Signing Mode to "Unsigned".'
        : (err.message || 'Upload failed. Please check network connection.');
      setErrorMsg(friendlyMsg);
      showToast(isUnsignedError ? 'Preset is Signed. Using image data directly.' : `Upload failed: ${err.message}`, isUnsignedError ? 'info' : 'error');

      // Local fallback: convert file to image data URL so product creation is never blocked
      if (typeof file !== 'string') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            setPreviewUrl(dataUrl);
            onUploadSuccess(dataUrl);
          }
        };
        reader.readAsDataURL(file as File);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      showToast('Image URL copied to clipboard!', 'success');
    }
  };

  const handleClearImage = () => {
    setPreviewUrl('');
    setErrorMsg(null);
    onUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-slate-800 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-blue-600" />
          <span>{label}</span>
        </label>
      </div>

      {/* Main Upload Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
        } ${compact ? 'p-3' : 'p-5'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        {previewUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
              <img
                src={previewUrl}
                alt="Smartphone preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0 space-y-1.5 text-left w-full">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                  <ImageIcon className="w-3 h-3" />
                  <span>Media Asset</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>High-Speed CDN</span>
                </span>
              </div>

              <p className="text-xs font-mono text-slate-700 truncate" title={previewUrl}>
                {previewUrl}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl();
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy URL</span>
                </button>

                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 flex items-center gap-1 shadow-2xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View</span>
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearImage();
                  }}
                  className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-2 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              {isUploading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                {isUploading ? 'Uploading image...' : 'Click or drag & drop smartphone photo'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-3 space-y-1">
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Uploading image...</span>
              <span>{uploadProgress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="text-[11px]">{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
