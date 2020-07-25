import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  // tslint:disable-next-line:radix
  port: parseInt(process.env.TYPEORM_PORT),
  logging: process.env.TYPEORM_LOGGING,
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
}));
