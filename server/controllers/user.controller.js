import mongoose from "mongoose";
import User from "../models/user.model.js";
import dbErrorHandler from "../helpers/dbErrorHandler.js";

const safeProfile = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  created: user.created,
  updated: user.updated,
});

const create = async (req, res) => {
  // Explicitly whitelist registration fields; ignore all other request data.
  const user = new User({
    name: req.body?.name,
    email: req.body?.email,
    password: req.body?.password,
  });

  try {
    await user.save();
    return res.status(201).json({ message: "Account created" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    return res.status(400).json({ error: dbErrorHandler.getErrorMessage(err) });
  }
};

const userByID = async (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Account not found" });
    }
    req.profile = user;
    return next();
  } catch (err) {
    return res.status(400).json({ error: "Could not retrieve account" });
  }
};

const read = (req, res) => res.json(safeProfile(req.profile));

const update = async (req, res) => {
  try {
    const user = req.profile;

    if (req.body?.name !== undefined) user.name = req.body.name;
    if (req.body?.email !== undefined) user.email = req.body.email;
    if (typeof req.body?.password === "string" && req.body.password.length > 0) {
      user.password = req.body.password;
    }

    user.updated = new Date();
    await user.save();
    return res.json(safeProfile(user));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username or email already exists" });
    }
    return res.status(400).json({ error: dbErrorHandler.getErrorMessage(err) });
  }
};

export default { create, userByID, read, update };
