// backend\src\database\typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [
    __dirname + '/../**/*.entity.{ts,js}',
    __dirname + '/../**/*.orm-entity.{ts,js}',
  ],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],

  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  autoLoadEntities: true,
};

export default ormconfig;
