// backend\src\modules\uploads\application\ports\file-storage.port.ts
export interface FileStoragePort {
  save(file: Express.Multer.File): Promise<string>;
  delete(path: string): Promise<void>;
}
