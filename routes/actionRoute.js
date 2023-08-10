import express from "express";
import {
  GetExport,
  SaveExport,
  UpdateExport,
  syncAction,
  DeleteExport,
  SaveExportTransfer,
  UpdateExportTransfer,
  TransferProduct,
} from "../controller/Action.js";
const router = express.Router();

router.get("/getaction", syncAction);
router.get("/getexport", GetExport);
router.get("/getexport/:id", GetExport);

router.post("/saveexport", SaveExport);
router.post("/updateaction", UpdateExport);
router.post("/deleteaction", DeleteExport);

router.post("/saveexport/transfer", SaveExportTransfer, TransferProduct);
router.post("/updateaction/transfer", UpdateExportTransfer, TransferProduct);
router.post("/transfer");
export default router;
