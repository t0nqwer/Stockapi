import express from "express";
import {
  GetExport,
  SaveExport,
  UpdateExport,
  syncAction,
} from "../controller/Action.js";
const router = express.Router();

router.get("/getaction", syncAction);
router.get("/getexport", GetExport);
router.get("/getexport/:id", GetExport);

router.post("/saveexport", SaveExport);
router.post("/updateaction", UpdateExport);
router.post("/transfer");
export default router;
