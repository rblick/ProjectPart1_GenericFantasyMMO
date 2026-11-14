import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import characterCreateCtrl from "../controllers/character-create.controller.js";

const router = express.Router();

router.post("/api/characters", authCtrl.requireSignin, characterCreateCtrl.create);

export default router;