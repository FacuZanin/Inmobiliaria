import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'postgres',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  // PRODUCCIÓN / BUILD
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],

  synchronize: false,
  autoLoadEntities: true,
};

export default ormconfig;
