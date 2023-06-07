import { io } from "socket.io-client";
import dns from "dns";
export const socketconnect = io("http://localhost:7080");

export function checkInternet(cb) {
  dns.lookup("google.com", function (err) {
    if (err && err.code == "ENOTFOUND") {
      cb(false);
    } else {
      cb(true);
    }
  });
}
