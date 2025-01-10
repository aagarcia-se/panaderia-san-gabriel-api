import express from "express";
import cors from "cors"; // Importa cors como una función

const app = express();
app.use(express.json());
app.use(cors());



export default app;