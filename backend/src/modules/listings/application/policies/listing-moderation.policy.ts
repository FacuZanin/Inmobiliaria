import { BadRequestException, Injectable } from '@nestjs/common';

import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';

@Injectable()
export class ListingModerationPolicy {
  assertValidDecision(status: ModerationStatus, reason?: string): void {
    if (
      [
        ModerationStatus.REJECTED,
        ModerationStatus.OBSERVED,
        ModerationStatus.SUSPENDED,
      ].includes(status) &&
      !reason?.trim()
    ) {
      throw new BadRequestException(
        'A moderation reason is required for this decision',
      );
    }
  }
}
