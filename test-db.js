const sequelize = require('./config/database');
const User = require('./models/User');

async function testConnection() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Connection to MySQL has been established successfully.');

        // Create tables (this will create the 'users' table automatically)
        await sequelize.sync({ force: true });
        console.log('✅ Database tables created successfully!');

        // Create a test user
        const testUser = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('✅ Test user created:', testUser.username);

        // Test password validation
        const isValid = await testUser.validPassword('password123');
        console.log('✅ Password validation works:', isValid);

        console.log('\n🎉 Everything is working perfectly!');
        console.log('You can now check phpMyAdmin to see the "users" table.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Troubleshooting:');
        console.log('1. Make sure XAMPP MySQL is running');
        console.log('2. Make sure you created the "dink_db" database in phpMyAdmin');
        console.log('3. Check your .env file has correct credentials');
    } finally {
        await sequelize.close();
    }
}

testConnection();
