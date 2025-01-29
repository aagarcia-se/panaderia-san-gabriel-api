import { Router } from "express";
import { sendSMSController } from "./enviarsms.controller.js";

export const smsRoute = Router();

smsRoute.post("/send-sms", sendSMSController);
