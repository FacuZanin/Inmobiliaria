export type MediaStorageFile = {
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
};

export type MediaStorageResult = {
  url: string;
  storageKey: string;
};

export interface MediaStoragePort {
  save(file: MediaStorageFile, folder: string): Promise<MediaStorageResult>;
  delete(storageKey: string): Promise<void>;
}
