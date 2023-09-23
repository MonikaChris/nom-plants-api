const User = require("../models/User");

async function logout(req, res, next) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  try {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

module.exports = logout;
