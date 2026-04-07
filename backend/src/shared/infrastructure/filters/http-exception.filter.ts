// backend\src\common\filters\http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      // 🔥 ACA está la clave: respetar el mensaje real
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse;
      } else {
        message = { message: exceptionResponse };
      }
    }
    console.error('🔥 ERROR COMPLETO:', exception);

    if ((exception as any)?.stack) {
      console.error('🔥 STACK:', (exception as any).stack);
    }
    response.status(status).json({
      success: false,
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : Array.isArray(message?.message)
            ? message.message
            : message?.message || 'Error interno del servidor',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
