import express from "express";
import employeesRoutes from "./routes/employees.routes.js";
import indexRoutes from "./routes/index.routes.js";
import './config.js';
import dotenv from 'dotenv';
dotenv.config();



const app = express();

app.use(express.json());

app.use(indexRoutes);
app.use('/api',employeesRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Endpoint no encontrado",
  });
});

export default app;