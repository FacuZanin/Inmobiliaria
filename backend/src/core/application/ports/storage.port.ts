// backend/src/core/application/ports/storage.port.ts
export interface UploadResult {
  url: string;
  key: string;
  size: number;
}

export interface IStoragePort {
  // Sube un archivo y retorna la URL pública
  upload(file: Buffer, key: string, mimeType: string): Promise<UploadResult>;
  // Elimina el archivo del storage
  delete(key: string): Promise<void>;
  // URL firmada con expiración (para documentos privados: escrituras, etc.)
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
  // Verifica si un archivo existe
  exists(key: string): Promise<boolean>;
}

export const STORAGE_PORT = Symbol('IStoragePort');
