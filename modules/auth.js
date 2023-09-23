const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function authenticateUser(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).send("Username and password required");

  const user = await User.findOne({ username });

  if (!user) return res.status(401).send("Unauthorized");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(401).send("Unauthorized");
  else {
    try {
      const { accessToken, refreshToken } = createTokens(user);
      
      //Save refresh token for user in database
      user.refreshToken = refreshToken;
      await user.save();

      //Send refresh token on httpOnly cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      //Send access token
      return res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}

function createTokens(user) {
  const accessToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken, refreshToken };
}

module.exports = authenticateUser;
