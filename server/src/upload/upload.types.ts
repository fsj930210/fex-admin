export interface UploadResult {
  uploadId: string;
  name: string;
  size: number;
  storedAt: string;
  md5?: string;
  instant: boolean;
}

export interface PartResult {
  index: number;
  partNumber: number;
  size: number;
}
