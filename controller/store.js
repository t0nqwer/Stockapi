import { PrismaClient } from "@prisma/client";
import axios from "axios";
const prisma = new PrismaClient();
import { url } from "../url.js";

export const getStoreList = async (req, res) => {
  try {
    const storeList = await prisma.shop.findMany({
      where: {
        shopName: {
          not: "สต๊อคศูนย์การเรียนรู้ขวัญตา",
        },
      },
    });
    res.status(200).json(storeList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
