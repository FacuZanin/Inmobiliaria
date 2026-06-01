import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ListingAuthOperation(summary: string) {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({ summary }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
