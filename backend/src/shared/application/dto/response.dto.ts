export class ResponseDto<T> {
  success: boolean;
  data?: T;
  error?: string;
}