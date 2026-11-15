import mongoose from "mongoose";
import crypto from "node:crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Username is required",
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email is required",
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    if (password) {
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    }
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashed_password").validate(function () {
  if (this._password && this._password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods.makeSalt = function () {
  return crypto.randomBytes(16).toString("hex");
};

UserSchema.methods.encryptPassword = function (password) {
  if (!password || !this.salt) return "";
  return crypto.scryptSync(password, this.salt, 64).toString("hex");
};

UserSchema.methods.authenticate = function (plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
};

export default mongoose.model("User", UserSchema);
