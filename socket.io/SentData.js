import { io } from "socket.io-client";
import { url } from "../url.js";
export const socketconnect = io(url);
