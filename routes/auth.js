const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const UserModel = require('../models/UserModel');

const salt = 8; 

router.get('/register', (req, res) => {
  res.render('auth/register'); 
});

router.post('/register', async (req, res) => {
  try {
    const userRegistration = req.body;

    const hashPassword = bcrypt.hashSync(userRegistration.password, salt);

    const user = {
      username: userRegistration.username,
      password: hashPassword 
    };

    await UserModel.create(user);
    res.redirect('/auth/login'); 
  } catch (err) {
    console.error("Register error:", err);
    res.render('auth/register', { error: 'Registration failed. Username might exist.' }); 
  }
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  try {
    const userLogin = req.body;

    const user = await UserModel.findOne({ username: userLogin.username });

    if (user) {
      const passwordMatch = bcrypt.compareSync(userLogin.password, user.password);

      if (passwordMatch) {
        req.session.username = user.username;
        res.redirect('/product'); 
      } else {
        res.render('auth/login', { error: 'Invalid username or password.' });
      }
    } else {
      res.render('auth/login', { error: 'Invalid username or password.' });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("An error occurred during login.");
  }
});

// === ĐĂNG XUẤT (LOGOUT) ===

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;