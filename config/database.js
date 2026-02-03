require('dotenv').config();
const { Sequelize } = require('sequelize');

// Supabase uses PostgreSQL. Use DATABASE_URL (connection string) or individual DB_* vars.
// On Vercel: set DATABASE_URL in Project Settings > Environment Variables (Session pooler, port 6543).
const useConnectionString = process.env.DATABASE_URL && process.env.DATABASE_URL.trim();

const commonOptions = {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
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
    },
    // Don't connect immediately - lazy connection
    retry: {
        max: 3
    }
};

let sequelize;

try {
    if (useConnectionString) {
        sequelize = new Sequelize(process.env.DATABASE_URL, commonOptions);
    } else if (process.env.DB_HOST && process.env.DB_NAME) {
        sequelize = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASS,
            {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 5432,
                ...commonOptions
            }
        );
    } else {
        // Create a dummy sequelize instance if no DB config (for non-DB routes)
        console.warn('⚠️  No database configuration found. Database features will not work.');
        sequelize = new Sequelize('sqlite::memory:', {
            dialect: 'sqlite',
            logging: false
        });
    }
} catch (error) {
    console.error('❌ Database initialization error:', error.message);
    // Create a dummy instance to prevent app crash
    sequelize = new Sequelize('sqlite::memory:', {
        dialect: 'sqlite',
        logging: false
    });
}

module.exports = sequelize;
