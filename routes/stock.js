import express from "express";
import {
  ListProduct,
  StockIn,
  StockOut,
  UpdateProductData,
  barcodeCh,
  barcodeCheck,
  checkcheck,
  getShopName,
  resetStock,
} from "../controller/StockController.js";
import { queryActin } from "../controller/Action.js";
import { getStoreList } from "../controller/store.js";
const router = express.Router();

router.get("/updateproductdata", UpdateProductData, barcodeCheck);
router.get("/listproducts", ListProduct);
router.get("/checkStock", checkcheck, getShopName, barcodeCh);
router.post("/stockin", StockIn);
router.post("/stockout", StockOut);
router.get("/resetstock", resetStock);
router.get("/queryaction", queryActin);
router.get("/liststores", getStoreList);

export default router;
