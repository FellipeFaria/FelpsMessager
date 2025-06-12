import { Router } from "express";
import UserController from "../controllers/UserController.js";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.get("/", AuthController.verifyToken, UserController.listUsers);

router.post("/", UserController.addUser);

export default router;
