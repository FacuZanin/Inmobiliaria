// backend\src\database\typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME, // ✅ FIX
  password: process.env.DB_PASSWORD, // ✅ FIX
  database: process.env.DB_NAME,

  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],

  synchronize: true,
  autoLoadEntities: false,
};

export default ormconfig;
