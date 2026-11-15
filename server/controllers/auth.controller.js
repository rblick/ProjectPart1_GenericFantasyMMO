import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../../config/config.js";

const signin = async (req, res) => {
  try {
    if (
      typeof req.body?.email !== "string" ||
      typeof req.body?.password !== "string"
    ) {
      return res.status(401).json({ error: "Email and password are required." });
    }

    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !user.authenticate(req.body.password)) {
      return res.status(401).json({ error: "Email and password don't match." });
    }

    const token = jwt.sign(
      { _id: user._id.toString() },
      config.jwtSecret,
      { algorithm: "HS256", expiresIn: "1h" }
    );
    res.cookie("t", token, {
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });
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
  res.clearCookie("t", {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Signed out" });
};

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  if (!req.auth?._id) {
    return res.status(401).json({ error: "Sign in is required" });
  }
  const authorized =
    req.profile && String(req.profile._id) === String(req.auth._id);
  if (!authorized) {
    return res.status(403).json({ error: "User is not authorized" });
  }
  return next();
};

export default { signin, signout, requireSignin, hasAuthorization };
