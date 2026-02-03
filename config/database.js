require('dotenv').config();
const { Sequelize } = require('sequelize');

// Supabase PostgreSQL only - no MySQL or SQLite
// On Vercel: set DATABASE_URL in Project Settings > Environment Variables (Session pooler, port 6543).
const DATABASE_URL = process.env.DATABASE_URL && process.env.DATABASE_URL.trim();

if (!DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not set. Database features (login/register/dashboard) will not work.');
    console.warn('⚠️  Set DATABASE_URL in Vercel: Project Settings > Environment Variables');
}

const sequelize = DATABASE_URL
    ? new Sequelize(DATABASE_URL, {
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
        retry: {
            max: 3
        }
    })
    : null; // No database connection if DATABASE_URL is missing

// Helper to check if database is available
sequelize && (sequelize.isAvailable = async () => {
    try {
        await sequelize.authenticate();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        return false;
    }
});

module.exports = sequelize;
