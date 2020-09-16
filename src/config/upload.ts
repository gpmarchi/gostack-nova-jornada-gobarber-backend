import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'cloudinary' | 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: unknown;
    cloudinary: {
      folder: string;
      cloudname: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    cloudinary: {
      folder: 'app-gobarber',
      cloudname: 'du8zd3lcs',
    },
  },
} as IUploadConfig;
