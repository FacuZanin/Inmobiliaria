// backend\src\modules\documents\presentation\http\filters\document-domain-exception.filter.ts
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';

import { DocumentNotFoundException } from '@modules/documents/domain/exceptions/document-not-found.exception';
import { InvalidDocumentFileException } from '@modules/documents/domain/exceptions/invalid-document-file.exception';
import { InvalidDocumentOwnerException } from '@modules/documents/domain/exceptions/invalid-document-owner.exception';
import { InvalidDocumentStatusException } from '@modules/documents/domain/exceptions/invalid-document-status.exception';
import { UnsupportedDocumentTypeException } from '@modules/documents/domain/exceptions/unsupported-document-type.exception';

type DocumentDomainException =
  | DocumentNotFoundException
  | InvalidDocumentFileException
  | InvalidDocumentOwnerException
  | InvalidDocumentStatusException
  | UnsupportedDocumentTypeException;

@Catch(
  DocumentNotFoundException,
  InvalidDocumentFileException,
  InvalidDocumentOwnerException,
  InvalidDocumentStatusException,
  UnsupportedDocumentTypeException,
)
export class DocumentDomainExceptionFilter implements ExceptionFilter {
  catch(exception: DocumentDomainException, host: ArgumentsHost): void {
    const httpException =
      exception instanceof DocumentNotFoundException
        ? new NotFoundException(exception.message)
        : new BadRequestException(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exceptionResponse = httpException.getResponse();
    const payload =
      typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { message: exceptionResponse };

    response.status(httpException.getStatus()).json({
      success: false,
      statusCode: httpException.getStatus(),
      message: Array.isArray((payload as { message?: unknown }).message)
        ? (payload as { message: string[] }).message
        : ((payload as { message?: string }).message ?? exception.message),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
