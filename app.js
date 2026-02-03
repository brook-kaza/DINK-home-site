const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
require('dotenv').config();

// Database - Supabase PostgreSQL only
const sequelize = require('./config/database');
// Only load User model if database is configured
const User = sequelize ? require('./models/User') : null;

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true on HTTPS (Vercel)
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    }
}));

// --- ACTIVE STATE MIDDLEWARE ---
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    res.locals.session = req.session; // Make session available to all views
    next();
});

// --- DEBUG LOGGER ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] Request: ${req.method} ${req.url}`);
    next();
});

// --- DATA FETCHING ---
const getAllData = () => {
    try {
        const filePath = path.join(__dirname, 'data', 'products.json');
        const raw = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(raw);
        const categories = [...new Set(products.map(p => p.category))];
        return { products, categories };
    } catch (err) {
        console.error("CRITICAL DATA ERROR:", err.message);
        return { products: [], categories: [] };
    }
};

// --- ROUTES ---

// Import routes and middleware
const authRoutes = require('./routes/auth');
const { isAuthenticated } = require('./middleware/auth');

// Auth routes
app.use('/auth', authRoutes);

// Dashboard (protected route)
app.get('/dashboard', isAuthenticated, async (req, res) => {
    if (!sequelize) {
        return res.status(503).send('Database not configured. Please set DATABASE_URL in Vercel environment variables.');
    }
    try {
        await sequelize.authenticate();
        res.render('dashboard', {
            title: 'Dashboard | Dink Home',
            username: req.session.username
        });
    } catch (error) {
        console.error('Database error on dashboard:', error);
        res.status(500).send('Database connection failed. Please check your DATABASE_URL configuration.');
    }
});

// 1. HOME
app.get('/', (req, res) => {
    const data = getAllData();
    const featuredItems = (data.products || []).slice(0, 3);
    res.render('home', { title: 'Dink Home | Design that Excites', featured: featuredItems });
});

// 2. TESTIMONIALS
app.get('/testimonials', (req, res) => {
    res.render('testimonials', { title: 'Client Stories | Dink Home' });
});

// 3. CATALOG
app.get('/catalog', (req, res) => {
    const data = getAllData();
    res.render('catalog', { products: data.products, categories: data.categories, title: 'Showroom | Dink Home' });
});

// 4. PRODUCT DETAIL (FIXED)
app.get('/product/:code', (req, res) => {
    const data = getAllData();
    const product = data.products.find(p => p.code === req.params.code);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.render('product-view', {
        title: `${product.name} | Dink Home`,
        product: product,           // The specific product
        products: data.products,    // This fixes the "products is not defined" error
        categories: data.categories // This fixes the "categories is not defined" error
    });
});

// 5. ABOUT & CONTACT
app.get('/about', (req, res) => res.render('about', { title: 'Our Story | Dink Home' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact Us | Dink Home' }));
app.get('/privacy', (req, res) => res.render('privacy', { title: 'Privacy Policy | Dink Home' }));
app.get('/faq', (req, res) => res.render('faq', { title: 'Common Questions | Dink Home' }));
app.get('/impact', (req, res) => {
    // res.render looks in the "views" folder automatically
    res.render('impact', { title: 'Our Impact' });
});
// 6. ERROR HANDLER (catches errors passed to next(err))
app.use((err, req, res, next) => {
    console.error('Error handler:', err);
    console.error('Stack:', err.stack);
    if (!res.headersSent) {
        const isDev = process.env.NODE_ENV !== 'production';
        res.status(500).send(isDev ? `Error: ${err.message}\n\n${err.stack}` : 'Something went wrong. Please try again later.');
    }
});

// 7. SAFETY NET (404)
app.use((req, res) => {
    res.status(404).send(`Oops! Dink Home doesn't have a page at ${req.url}.`);
});

// Only run DB sync + server when executed directly (e.g. node app.js), not when required by Vercel
if (require.main === module) {
    if (sequelize) {
        sequelize.sync({ alter: true })
            .then(() => {
                console.log('✅ Database synced successfully');
                app.listen(PORT, () => {
                    console.log(`✅ Server running at http://localhost:${PORT}`);
                    console.log(`📝 Register at: http://localhost:${PORT}/auth/register`);
                    console.log(`🔐 Login at: http://localhost:${PORT}/auth/login`);
                });
            })
            .catch(err => {
                console.error('❌ Database sync failed:', err);
                console.error('⚠️  Starting server anyway (non-DB routes will work)');
                app.listen(PORT, () => {
                    console.log(`✅ Server running at http://localhost:${PORT} (without database)`);
                });
            });
    } else {
        console.warn('⚠️  DATABASE_URL not set. Starting server without database.');
        app.listen(PORT, () => {
            console.log(`✅ Server running at http://localhost:${PORT} (without database)`);
            console.log(`⚠️  Set DATABASE_URL to enable login/register/dashboard features`);
        });
    }
}

module.exports = app;