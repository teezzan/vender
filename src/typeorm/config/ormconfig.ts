import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
const prod = process.env.NODE_ENV == 'production';
const config: ConnectionOptions = {
  type: 'postgres',
  host: prod ? process.env.PG_HOST : process.env.TEST_PG_HOST,
  port: Number(process.env.PG_PORT),
  username: prod ? process.env.POSTGRES_USER : process.env.TEST_POSTGRES_USER,
  password: prod ? process.env.POSTGRES_PASSWORD : process.env.TEST_POSTGRES_PASSWORD,
  database: prod ? process.env.POSTGRES_DB : process.env.TEST_POSTGRES_DB,
  extra: {
    ssl: prod ? true : false,
  },
  synchronize: false,
  logging: false,
  entities: ['src/typeorm/entities/*.ts'],
  migrations: ['src/typeorm/migrations/**/*.ts'],
  subscribers: ['src/typeorm/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/typeorm/entities',
    migrationsDir: 'src/typeorm/migrations',
    subscribersDir: 'src/typeorm/subscriber',
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export = config;
