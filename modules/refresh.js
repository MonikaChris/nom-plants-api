const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function refreshJWT(req, res, next) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).send("Not found");
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).send("Unauthorized");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || decoded.username !== user.username)
        return res.status(403).send("Unauthorized");

      const accessToken = jwt.sign(
        {
          username: decoded.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ accessToken });
    });
  } catch(error) {
    next(error);
  }
}

module.exports = refreshJWT;
