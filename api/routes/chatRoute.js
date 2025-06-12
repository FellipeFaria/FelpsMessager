import { Router } from "express";
import ChatController from "../controllers/ChatController.js";

const router = Router();

router.get("/", ChatController.listChats);

router.post("/", ChatController.createChat);

export default router;
