import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../../config/config.js";

const signin = async (req, res) => {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const user = await User.findOne({ email });
    if (!user || !user.authenticate(req.body?.password)) {
      return res.status(401).json({ error: "Email and password don't match." });
    }

    const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecret, { algorithm: "HS256" });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};

const signout = (req, res) => {
  res.clearCookie("t", { path: "/" });
  return res.status(200).json({ message: "Signed out" });
};

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: "Sign in is required" });
  }
  if (!req.profile || req.profile._id.toString() !== req.auth._id.toString()) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  return next();
};

export default { signin, signout, requireSignin, hasAuthorization };
