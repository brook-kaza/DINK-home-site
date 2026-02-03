require('dotenv').config();
const { Sequelize } = require('sequelize');

// Supabase uses PostgreSQL. Use DATABASE_URL (connection string) or individual DB_* vars.
const useConnectionString = process.env.DATABASE_URL;

const commonOptions = {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

const sequelize = useConnectionString
    ? new Sequelize(process.env.DATABASE_URL, commonOptions)
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            ...commonOptions
        }
    );

module.exports = sequelize;
