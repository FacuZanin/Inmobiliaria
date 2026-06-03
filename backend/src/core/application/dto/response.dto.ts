// backend\src\core\application\dto\response.dto.ts
export class ResponseDto<T> {
  success!: boolean;
  data?: T;
  error?: string;
}
