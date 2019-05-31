const express = require('express');
const User = require('../models/user');
const authCheck = require('../middleware/authCheck');
const router = new express.Router();

router.post('/admin/register', async (req, res) => {
  let userCount = 0;
  await User.find().then(documents => userCount=documents.length);
  if(userCount === 0 ) {
    const user = new User(req.body);
    try {
      await user.save();
      const token = await user.generateAuthToken();
      return res.status(201).json({user, token})
    } catch (e) {
      return res.status(400).send(e)
    }
  }
  res.status(400).json({message: "Registration not allowed"})
});

router.post('/admin', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.username, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, token })
  } catch (e) {
    res.status(400).json({
      error: "Invalid Credentials"
    })
  }
});

router.post('/admin/logout', authCheck, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    });
    await req.user.save();

    res.send()
  } catch (e) {
    res.status(500).send()
  }
});

router.post('/admin/logoutAll', authCheck, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send()
  } catch (e) {
    res.status(500).send()
  }
});

module.exports = router;
