const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register', { user: req.user || null, content: 'register' });
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).send('All fields are required');
    if (password.length < 6) return res.status(400).send('Password must be at least 6 characters');

    try {
        await User.create({ username, email, password });
        res.redirect('/login');
    } catch (err) {
        res.status(400).send('Error registering user');
    }
});

router.get('/login', (req, res) => {
    res.render('login', { user: req.user || null, content: 'login' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    res.render('dashboard', { user: req.user, content: 'dashboard' });
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/login');
    });
});

router.get('/', (req, res) => {
    res.render('index', { user: req.user || null, content: 'index' });
});



module.exports = router;
