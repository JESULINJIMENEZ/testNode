import { Router } from "express";
import {
  createEnterprise,
  deleteEnterprise,
  getEnterpriseById,
  getEnterprises,
  updateEnterprise,
  // exportEnterpriseToExcel
} from "../controllers/enterprises.controller.js";

const router = Router();

router.get("/enterprises", getEnterprises);
router.get("/enterprises/:id", getEnterpriseById);
router.post("/enterprises", createEnterprise);
router.patch("/enterprises/:id", updateEnterprise);
router.delete("/enterprises/:id", deleteEnterprise);
// router.get("/enterprises_exportar", exportEnterpriseToExcel);

export default router;