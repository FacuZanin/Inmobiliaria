// backend\src\shared\application\dto\response.dto.ts
export class ResponseDto<T> {
  success!: boolean;
  data?: T;
  error?: string;
}
