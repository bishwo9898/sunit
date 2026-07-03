import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'das25qoma',
  api_key:    '984563355597783',
  api_secret: 'JZvJFqR7ugrYpVKLe6dxgvMVHaw',
  secure:     true,
});

async function test() {
  try {
    const result = await cloudinary.api.root_folders();
    console.log('Folders found:', result.folders.map(f => f.name));
  } catch (err) {
    console.error('Cloudinary connection failed:', err);
  }
}

test();
