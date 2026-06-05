// backend\src\modules\documents\application\ports\file-storage.port.ts
export interface FileStoragePort {
  upload(file: Express.Multer.File, folder?: string): Promise<string>;

  delete(fileUrl: string): Promise<void>;

  save(file: Express.Multer.File): Promise<string>;
}
