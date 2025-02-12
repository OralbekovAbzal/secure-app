const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('reset', { user: req.user || null, content: 'reset' });
});

router.post('/', async (req, res) => {
    if (!req.user) return res.redirect('/login');

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res.send('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    res.redirect('/dashboard');
});

module.exports = router;
