import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    logging: false,
});

export { sequelize };
export default sequelize;