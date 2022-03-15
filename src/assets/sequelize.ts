import { Sequelize } from 'sequelize';
import { db_host, db_password, db_user, donation_db_name } from './auth.json';

export const sequelize = new Sequelize(donation_db_name, db_user, db_password, {
    host: db_host,
    dialect: 'mysql',
    logging: false,
});