export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
  folder?: string;
}

export interface CloudinaryUploadResult {
  assetId: string;
  publicId: string;
  version: number;
  width: number;
  height: number;
  format: string;
  bytes: number;
  url: string;
  secureUrl: string;
  createdAt: string;
  originalFilename?: string;
}

export interface UploadedMediaAsset {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  name: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
  folder?: string;
  uploadedAt: string;
}

const CONFIG_STORAGE_KEY = 'novamobile_cloudinary_config';
const MEDIA_STORAGE_KEY = 'novamobile_cloudinary_media_library';

// Default configuration with fallback to environment variables or demo credentials
const DEFAULT_CONFIG: CloudinaryConfig = {
  cloudName: (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: (import.meta as any).env?.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  apiKey: (import.meta as any).env?.VITE_CLOUDINARY_API_KEY || '',
  folder: 'novamobile_products',
};

/**
 * Retrieve active Cloudinary configuration from LocalStorage or Vite Env
 */
export const getStoredCloudinaryConfig = (): CloudinaryConfig => {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cloudName: parsed.cloudName || DEFAULT_CONFIG.cloudName,
        uploadPreset: parsed.uploadPreset || DEFAULT_CONFIG.uploadPreset,
        apiKey: parsed.apiKey || DEFAULT_CONFIG.apiKey,
        folder: parsed.folder || DEFAULT_CONFIG.folder || 'novamobile_products',
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONFIG;
};

/**
 * Persist user Cloudinary credentials to LocalStorage
 */
export const saveStoredCloudinaryConfig = (config: CloudinaryConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save Cloudinary configuration to storage:', err);
  }
};

/**
 * Clear user Cloudinary credentials
 */
export const clearStoredCloudinaryConfig = (): void => {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear Cloudinary configuration:', err);
  }
};

/**
 * Upload an image file or base64 data to Cloudinary via direct unsigned REST upload
 */
export const uploadToCloudinary = async (
  file: File | Blob | string,
  options?: {
    folder?: string;
    tags?: string;
    onProgress?: (progressPercent: number) => void;
  }
): Promise<CloudinaryUploadResult> => {
  const config = getStoredCloudinaryConfig();

  if (!config.cloudName || !config.cloudName.trim()) {
    throw new Error('Cloudinary Cloud Name is not configured. Please open Cloudinary Setup to add your Cloud Name.');
  }

  if (!config.uploadPreset || !config.uploadPreset.trim()) {
    throw new Error('Cloudinary Upload Preset is not configured. An unsigned upload preset is required for client uploads.');
  }

  const cloudName = config.cloudName.trim();
  const uploadPreset = config.uploadPreset.trim();
  const targetFolder = options?.folder || config.folder || 'novamobile_products';

  const formData = new FormData();
  if (typeof file === 'string') {
    formData.append('file', file);
  } else {
    formData.append('file', file, (file as File).name || 'smartphone_upload.jpg');
  }

  formData.append('upload_preset', uploadPreset);
  if (targetFolder) {
    formData.append('folder', targetFolder);
  }
  if (options?.tags) {
    formData.append('tags', options.tags);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint, true);

    if (options?.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress?.(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          const result: CloudinaryUploadResult = {
            assetId: response.asset_id || response.public_id,
            publicId: response.public_id,
            version: response.version,
            width: response.width || 800,
            height: response.height || 600,
            format: response.format || 'jpg',
            bytes: response.bytes || 0,
            url: response.url,
            secureUrl: response.secure_url || response.url,
            createdAt: response.created_at || new Date().toISOString(),
            originalFilename: response.original_filename,
          };

          // Save to recent media library
          saveUploadedMediaAsset({
            id: result.assetId || result.publicId,
            publicId: result.publicId,
            url: result.url,
            secureUrl: result.secureUrl,
            name: typeof file !== 'string' ? (file as File).name : result.publicId,
            size: result.bytes,
            format: result.format,
            width: result.width,
            height: result.height,
            folder: targetFolder,
            uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

          resolve(result);
        } else {
          const errorMsg =
            response.error?.message ||
            `Cloudinary upload failed with status ${xhr.status}: ${xhr.statusText}`;
          reject(new Error(errorMsg));
        }
      } catch (err: any) {
        reject(new Error(`Failed to parse Cloudinary response: ${err.message}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload to Cloudinary. Please check your internet connection or Cloud Name.'));
    };

    xhr.send(formData);
  });
};

/**
 * Generate an optimized Cloudinary delivery URL with automatic format and quality (f_auto, q_auto)
 */
export const getOptimizedCloudinaryUrl = (
  rawUrl: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'png' | 'jpg';
  } = {}
): string => {
  if (!rawUrl || !rawUrl.includes('cloudinary.com')) {
    return rawUrl;
  }

  try {
    const parts = rawUrl.split('/upload/');
    if (parts.length !== 2) return rawUrl;

    const transformList: string[] = ['f_auto', 'q_auto'];

    if (transformations.width) transformList.push(`w_${transformations.width}`);
    if (transformations.height) transformList.push(`h_${transformations.height}`);
    if (transformations.crop) transformList.push(`c_${transformations.crop}`);
    if (transformations.quality && transformations.quality !== 'auto') {
      transformList.push(`q_${transformations.quality}`);
    }
    if (transformations.format && transformations.format !== 'auto') {
      transformList.push(`f_${transformations.format}`);
    }

    return `${parts[0]}/upload/${transformList.join(',')}/${parts[1]}`;
  } catch {
    return rawUrl;
  }
};

/**
 * Save an uploaded media item to local recent list
 */
export const saveUploadedMediaAsset = (asset: UploadedMediaAsset): void => {
  try {
    const list = getRecentUploadedMedia();
    const updated = [asset, ...list.filter((item) => item.publicId !== asset.publicId)].slice(0, 30);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save uploaded asset to media library:', err);
  }
};

/**
 * Get recent media items uploaded via Cloudinary
 */
export const getRecentUploadedMedia = (): UploadedMediaAsset[] => {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }

  // Initial curated samples for immediate demo exploration
  return [
    {
      id: 'cloud_demo_1',
      publicId: 'novamobile/s25_ultra_hero',
      url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      secureUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
      name: 'Samsung Galaxy S25 Ultra 5G.jpg',
      size: 342190,
      format: 'webp',
      width: 1200,
      height: 900,
      folder: 'novamobile_products',
      uploadedAt: 'Today, 10:15 AM',
    },
    {
      id: 'cloud_demo_2',
      publicId: 'novamobile/iphone16_promax_desert',
      url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      secureUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      name: 'iPhone 16 Pro Max Titanium.jpg',
      size: 412850,
      format: 'webp',
      width: 1200,
      height: 900,
      folder: 'novamobile_products',
      uploadedAt: 'Yesterday, 4:20 PM',
    },
    {
      id: 'cloud_demo_3',
      publicId: 'novamobile/xiaomi14_ultra_camera',
      url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      secureUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      name: 'Xiaomi 14 Ultra Quad Camera.jpg',
      size: 298400,
      format: 'webp',
      width: 1200,
      height: 900,
      folder: 'novamobile_products',
      uploadedAt: 'Oct 09, 2026',
    },
  ];
};

/**
 * Remove an item from the local media gallery
 */
export const removeMediaAsset = (assetId: string): void => {
  try {
    const list = getRecentUploadedMedia();
    const updated = list.filter((item) => item.id !== assetId && item.publicId !== assetId);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove asset:', err);
  }
};
