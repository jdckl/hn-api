import { Dialect, Sequelize } from 'sequelize';
import defaultConfig from '../config/default.config';

const dbName = defaultConfig.dbName;
const dbUser = defaultConfig.dbUser;
const dbHost = defaultConfig.dbHost;
const dbDriver = defaultConfig.dbDriver as Dialect;
const dbPassword = defaultConfig.dbPassword;

const connection = new Sequelize(dbName, dbUser, dbPassword, 
    {
        host: dbHost,
        dialect: dbDriver
    })

export default connection;