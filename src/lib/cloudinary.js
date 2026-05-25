const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || import.meta.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const BASE_URL   = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`;

/**
 * Upload any image file to Cloudinary.
 * Returns { url: string, error: string|null }
 */
export async function uploadImage(file, preset, onProgress) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    return await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/image/upload`);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, error: null });
        } else {
          const err = JSON.parse(xhr.responseText);
          console.error('[Cloudinary]', err);
          resolve({ url: null, error: 'Upload failed. Please try again.' });
        }
      };

      xhr.onerror = () => {
        resolve({ url: null, error: 'Network error during upload.' });
      };

      xhr.send(formData);
    });
  } catch (err) {
    console.error('[Cloudinary]', err);
    return { url: null, error: 'Upload failed. Please try again.' };
  }
}

/**
 * Upload any file (PDF, DWG, ZIP) to Cloudinary.
 * Uses raw upload endpoint.
 */
export async function uploadFile(file, preset, onProgress) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    return await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/raw/upload`);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, error: null });
        } else {
          resolve({ url: null, error: 'File upload failed.' });
        }
      };

      xhr.onerror = () =>
        resolve({ url: null, error: 'Network error during upload.' });

      xhr.send(formData);
    });
  } catch (err) {
    console.error('[Cloudinary]', err);
    return { url: null, error: 'Upload failed.' };
  }
}

export const PRESETS = {
  AVATAR: import.meta.env.VITE_CLOUDINARY_AVATAR_PRESET || import.meta.env.REACT_APP_CLOUDINARY_AVATAR_PRESET || 'archive_avatars',
  BANNER: import.meta.env.VITE_CLOUDINARY_BANNER_PRESET || import.meta.env.REACT_APP_CLOUDINARY_BANNER_PRESET || 'archive_banners',
  UPLOADS: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
};
