import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { AcceptVisitDto } from '@/modules/visits/application/dto/accept-visit.dto';
import { CancelVisitDto } from '@/modules/visits/application/dto/cancel-visit.dto';
import { RejectVisitDto } from '@/modules/visits/application/dto/reject-visit.dto';
import { RescheduleVisitDto } from '@/modules/visits/application/dto/reschedule-visit.dto';
import { AcceptVisitUseCase } from '@/modules/visits/application/use-cases/accept-visit.usecase';
import { CancelVisitUseCase } from '@/modules/visits/application/use-cases/cancel-visit.usecase';
import { ListOwnerVisitsUseCase } from '@/modules/visits/application/use-cases/list-owner-visits.usecase';
import { MarkVisitDoneUseCase } from '@/modules/visits/application/use-cases/mark-visit-done.usecase';
import { RejectVisitUseCase } from '@/modules/visits/application/use-cases/reject-visit.usecase';
import { RescheduleVisitUseCase } from '@/modules/visits/application/use-cases/reschedule-visit.usecase';
import { VisitPresenter } from '../presenters/visit.presenter';

@Controller('owner/visits')
@Auth()
export class OwnerVisitsController {
  constructor(
    private readonly listOwnerVisits: ListOwnerVisitsUseCase,
    private readonly acceptVisit: AcceptVisitUseCase,
    private readonly rejectVisit: RejectVisitUseCase,
    private readonly cancelVisit: CancelVisitUseCase,
    private readonly rescheduleVisit: RescheduleVisitUseCase,
    private readonly markVisitDone: MarkVisitDoneUseCase,
  ) {}

  @Get()
  @Auth(Permission.VISIT_READ_PRIVATE)
  async list(@CurrentUser() user: JwtPayload & { id?: number }) {
    const visits = await this.listOwnerVisits.execute(
      user.id ?? user.sub,
      user.agencia?.id ?? null,
    );

    return VisitPresenter.collection(visits);
  }

  @Post(':id/accept')
  @Auth(Permission.VISIT_ACCEPT)
  async accept(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AcceptVisitDto,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const visit = await this.acceptVisit.execute(
      id,
      user,
      dto.scheduledAt ? new Date(dto.scheduledAt) : null,
    );

    return VisitPresenter.toHttp(visit);
  }

  @Post(':id/reject')
  @Auth(Permission.VISIT_REJECT)
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectVisitDto,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const visit = await this.rejectVisit.execute(id, user, dto.reason);

    return VisitPresenter.toHttp(visit);
  }

  @Patch(':id/reschedule')
  @Auth(Permission.VISIT_RESCHEDULE)
  async reschedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RescheduleVisitDto,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const visit = await this.rescheduleVisit.execute(
      id,
      user,
      new Date(dto.desiredAt),
      dto.message,
    );

    return VisitPresenter.toHttp(visit);
  }

  @Post(':id/cancel')
  @Auth(Permission.VISIT_CANCEL)
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelVisitDto,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const visit = await this.cancelVisit.execute(id, user, dto.reason);

    return VisitPresenter.toHttp(visit);
  }

  @Post(':id/done')
  @Auth(Permission.VISIT_DONE)
  async done(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const visit = await this.markVisitDone.execute(id, user);

    return VisitPresenter.toHttp(visit);
  }
}
