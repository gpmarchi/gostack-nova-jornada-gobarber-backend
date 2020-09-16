import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';

import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

class CloudinaryStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    await cloudinary.v2.uploader.upload(originalPath, {
      use_filename: true,
      unique_filename: false,
      folder: uploadConfig.config.cloudinary.folder,
    });

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filenameWithoutExtension = file.split('.')[0];
    const filePublicID = `${uploadConfig.config.cloudinary.folder}/${filenameWithoutExtension}`;

    await cloudinary.v2.uploader.destroy(filePublicID, { invalidate: true });
  }
}

export default CloudinaryStorageProvider;
