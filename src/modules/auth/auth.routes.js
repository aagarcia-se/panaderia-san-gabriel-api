import { Router } from "express";
import { iniciarSesionController } from "./auth.controller.js";

export const authRoute = Router();

authRoute.post("/login", iniciarSesionController);
