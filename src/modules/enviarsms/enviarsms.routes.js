import { Router } from "express";
import { sendSMSController } from "./enviarsms.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

export const smsRoute = Router();

smsRoute.post("/send-sms", authMiddleware, sendSMSController);
