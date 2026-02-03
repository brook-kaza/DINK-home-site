const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register Page
router.get('/register', (req, res) => {
    res.render('auth/register', {
        title: 'Sign Up | Dink Home',
        error: null
    });
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            return res.render('auth/register', {
                title: 'Sign Up | Dink Home',
                error: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Sign Up | Dink Home',
                error: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.render('auth/register', {
                title: 'Sign Up | Dink Home',
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [require('sequelize').Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.render('auth/register', {
                title: 'Sign Up | Dink Home',
                error: 'Username or email already exists'
            });
        }

        // Create user
        await User.create({ username, email, password });

        res.redirect('/auth/login?registered=true');

    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            title: 'Sign Up | Dink Home',
            error: 'An error occurred. Please try again.'
        });
    }
});

// Login Page
router.get('/login', (req, res) => {
    const registered = req.query.registered === 'true';
    res.render('auth/login', {
        title: 'Login | Dink Home',
        error: null,
        success: registered ? 'Registration successful! Please login.' : null
    });
});

// Login POST
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('auth/login', {
                title: 'Login | Dink Home',
                error: 'Please enter username and password',
                success: null
            });
        }

        // Find user
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.render('auth/login', {
                title: 'Login | Dink Home',
                error: 'Invalid username or password',
                success: null
            });
        }

        // Validate password
        const isValid = await user.validPassword(password);

        if (!isValid) {
            return res.render('auth/login', {
                title: 'Login | Dink Home',
                error: 'Invalid username or password',
                success: null
            });
        }

        // Set session
        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login | Dink Home',
            error: 'An error occurred. Please try again.',
            success: null
        });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});

module.exports = router;
