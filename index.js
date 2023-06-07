import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import stockRoutes from "./routes/stock.js";
import axios from "axios";
import morgan from "morgan";
import settingRoutes from "./routes/setting.js";
import "./socket.io/client.js";
import { barcodeCh, checkcheck } from "./controller/StockController.js";
import { Server } from "socket.io";
import { addCloth, addSize, updatePrice } from "./socket.io/controller.js";
import { io } from "socket.io-client";
import dns from "dns";
const app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
axios.defaults.headers.common["token"] = "kVdeNbeYcdcHPXGt";
app.use("/", stockRoutes);
app.use("/setting", settingRoutes);
const port = parseInt(process.env.PORT) || 8585;
checkcheck()
  .then(barcodeCh())
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`helloworld: listening on http://localhost:${port}`);
    });
    const io = new Server(server);
    io.on("connection", (socket) => {
      console.log(socket.id);
      socket.on("price", (data) => {
        // updatePrice(data.barcode, data.price);
      });
      socket.on("addSize", (data) => {
        // addSize(data);
      });
      socket.on("newCloth", (data) => {
        // addSize(data);
      });
    });
  });

const socket = io("http://167.172.69.153");
socket.on("price", (data) => {
  updatePrice(data.barcode, data.price);
});
socket.on("addSize", (data) => {
  addSize(data);
});
socket.on("newCloth", (data) => {
  addSize(data);
});

socket.on("newexample", (data) => {
  console.log(data);
  addCloth(data);
});

function checkInternet(cb) {
  dns.lookup("google.com", function (err) {
    if (err && err.code == "ENOTFOUND") {
      return false;
    } else {
      return true;
    }
  });
}

// example usage:
checkInternet(function (isConnected) {
  if (isConnected) {
    console.log("connected to the internet");
  } else {
    console.log("not connected to the internet");
  }
});
