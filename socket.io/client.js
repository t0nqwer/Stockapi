import { io } from "socket.io-client";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { updatePrice } from "./controller.js";
const prisma = new PrismaClient();
// const socket = io("http://localhost:7080");

// prisma.programSetting
//   .findFirst({
//     select: {
//       ShopName: true,
//     },
//   })
//   .then((data) => {
//     socket?.emit("newUser", data.ShopName);
//   });

// socket.on("price", (data) => {
//   updatePrice(data.barcode, data.price);
// });
