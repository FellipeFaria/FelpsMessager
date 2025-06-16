import { Router } from "express";
import ChatController from "../controllers/ChatController.js";
import MessageController from "../controllers/MessageController.js";

const router = Router();

router.get("/", ChatController.listChats);

router.get("/:chatId", ChatController.getChat);

router.post("/", ChatController.createChat);

router.post("/msg", MessageController.sendMessage);

export default router;
