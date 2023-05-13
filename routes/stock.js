import express from "express";
import {
  ListProduct,
  StockIn,
  StockOut,
  UpdateProductData,
  barcodeCheck,
} from "../controller/StockController.js";
const router = express.Router();

router.get("/updateproductdata", UpdateProductData, barcodeCheck);
router.get("/listproducts", ListProduct);
router.post("/stockin", StockIn);
router.post("/stockout", StockOut);

export default router;
