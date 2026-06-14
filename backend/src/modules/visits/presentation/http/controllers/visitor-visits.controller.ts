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
import { CancelVisitDto } from '@/modules/visits/application/dto/cancel-visit.dto';
import { RequestVisitDto } from '@/modules/visits/application/dto/request-visit.dto';
import { RescheduleVisitDto } from '@/modules/visits/application/dto/reschedule-visit.dto';
import { CancelVisitUseCase } from '@/modules/visits/application/use-cases/cancel-visit.usecase';
import { ListMyVisitsUseCase } from '@/modules/visits/application/use-cases/list-my-visits.usecase';
import { RequestVisitUseCase } from '@/modules/visits/application/use-cases/request-visit.usecase';
import { RescheduleVisitUseCase } from '@/modules/visits/application/use-cases/reschedule-visit.usecase';
import { VisitPresenter } from '../presenters/visit.presenter';

@Controller('visits')
@Auth()
export class VisitorVisitsController {
  constructor(
    private readonly requestVisit: RequestVisitUseCase,
    private readonly listMyVisits: ListMyVisitsUseCase,
    private readonly cancelVisit: CancelVisitUseCase,
    private readonly rescheduleVisit: RescheduleVisitUseCase,
  ) {}

  @Post('listing/:listingId')
  @Auth(Permission.VISIT_CREATE)
  async request(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() dto: RequestVisitDto,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const visit = await this.requestVisit.execute({
      listingId,
      requesterId: user.id ?? user.sub,
      desiredAt: new Date(dto.desiredAt),
      message: dto.message,
    });

    return VisitPresenter.toHttp(visit);
  }

  @Get('my')
  @Auth(Permission.VISIT_READ_OWN)
  async mine(@CurrentUser() user: JwtPayload & { id?: number }) {
    const visits = await this.listMyVisits.execute(user.id ?? user.sub);

    return VisitPresenter.collection(visits);
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
}
