// backend\src\modules\documents\application\ports\file-storage.port.ts
export interface StorageFile {
  originalName: string;

  mimeType: string;

  buffer: Buffer;

  size?: number;
}

export interface FileStoragePort {
  upload(file: StorageFile, folder?: string): Promise<string>;

  save(file: StorageFile): Promise<string>;

  delete(fileUrl: string): Promise<void>;
}
