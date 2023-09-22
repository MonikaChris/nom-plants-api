const User = require('../models/User');
const bcrypt = require('bcrypt');

async function registerUser(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) res.status(400).send('Username and password required');

  const user = await User.findOne({ username });
  if (user) res.status(409).send('Username taken');

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashedPwd
    });

    res.status(201).send('Registered new user');

  } catch(error) {
    next(error);
  }
}

module.exports = registerUser;
