import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload a file buffer or base64 string to Cloudinary.
 * Returns the secure URL and public_id.
 */
export async function uploadToCloudinary(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'khilafat-detergent',
      resource_type: 'image',
      transformation: [
        { width: 1600, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
      ],
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    if (Buffer.isBuffer(fileBuffer)) {
      uploadStream.end(fileBuffer);
    } else {
      reject(new Error('fileBuffer must be a Buffer'));
    }
  });
}

/**
 * Delete an asset from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}
