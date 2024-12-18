import { Router } from "express";
import {
  createEmployees,
  deleteEmployees,
  getEmployeeById,
  getEmployees,
  updateEmployees,
  exportEmployeesToExcel,
} from "../controllers/employees.controller.js";
const router = Router();

router.get("/employees", getEmployees);

router.get("/employees/:id", getEmployeeById);

router.post("/employees", createEmployees);

router.patch("/employees/:id", updateEmployees);

router.delete("/employees/:id", deleteEmployees);

router.get("/employees_exportar", exportEmployeesToExcel);


export default router;
