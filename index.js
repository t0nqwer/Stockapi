import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import stockRoutes from "./routes/stock.js";
import axios from "axios";
import morgan from "morgan";
import settingRoutes from "./routes/setting.js";
import actionRoutes from "./routes/actionRoute.js";
import { addProduct, updatePrice } from "./socket.io/controller.js";
import "./fucntion.js";
import { socketconnect } from "./socket.io/SentData.js";
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
axios.defaults.headers.common["token"] = "kVdeNbeYcdcHPXGt";
app.use("/", stockRoutes);
app.use("/setting", settingRoutes);
app.use("/action", actionRoutes);

const port = parseInt(process.env.PORT) || 8585;

app.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});

// const socket = io("http://localhost:7080");
socketconnect.on("price", (data) => {
  updatePrice(data.barcode, data.price);
});
socketconnect.on("addProduct", (data) => {
  addProduct(data);
});
socketconnect.on("Notification", (data) => {
  console.log(data);
});
socketconnect.on("deleteProduct", (data) => {});
socketconnect.emit(
  "connectToServer",
  "สต๊อคศูนย์การเรียนรู้ขวัญตา",
  (response) => {
    console.log(response);
  }
);
socketconnect.on("error", (error) => {
  console.log(error);
});
