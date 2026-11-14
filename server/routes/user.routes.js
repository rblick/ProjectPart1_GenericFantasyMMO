import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

router.param("userId", userCtrl.userByID);

router.post("/api/users", userCtrl.create);
router.get(
  "/api/users/:userId",
  authCtrl.requireSignin,
  authCtrl.hasAuthorization,
  userCtrl.read,
);
router.put(
  "/api/users/:userId",
  authCtrl.requireSignin,
  authCtrl.hasAuthorization,
  userCtrl.update,
);

export default router;
