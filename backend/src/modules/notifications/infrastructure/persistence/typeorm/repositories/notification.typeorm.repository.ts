import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotificationEntity } from '@/modules/notifications/domain/entities/notification.entity';
import { NotificationRepositoryPort } from '@/modules/notifications/domain/repositories/notification.repository.port';
import { NotificationMapper } from '@/modules/notifications/infrastructure/mappers/notification.mapper';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';

@Injectable()
export class NotificationTypeOrmRepository extends NotificationRepositoryPort {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    private readonly repository: Repository<NotificationOrmEntity>,
  ) {
    super();
  }

  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    const saved = await this.repository.save(NotificationMapper.toOrm(notification));

    return NotificationMapper.toDomain(saved);
  }

  async findById(id: number): Promise<NotificationEntity | null> {
    const entity = await this.repository.findOne({
      where: {
        id,
      },
    });

    return entity ? NotificationMapper.toDomain(entity) : null;
  }

  async findByRecipient(recipientId: number): Promise<NotificationEntity[]> {
    const entities = await this.repository.find({
      where: {
        recipientId,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 100,
    });

    return entities.map((entity) => NotificationMapper.toDomain(entity));
  }

  async markAllAsRead(recipientId: number): Promise<void> {
    await this.repository.update(
      {
        recipientId,
        readAt: IsNull(),
      },
      {
        readAt: new Date(),
      },
    );
  }
}
