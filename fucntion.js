import { scheduleJob } from "node-schedule";
import { PrismaClient } from "@prisma/client";
import { url } from "./url.js";
import axios from "axios";

const prisma = new PrismaClient();

const syncAction = async () => {
  try {
    const data = await prisma.action.findMany({
      where: {
        IsOnline: false,
        actionid: 1,
      },
      include: {
        actionDetail: {
          select: {
            barcode: true,
            amout: true,
          },
        },
      },
      orderBy: {
        time: "asc",
      },
    });

    if (data.length === 0) return;
    const sent = data[0].actionDetail.map((e) => ({
      barcode: e.barcode,
      importqty: e.amout,
    }));
    const reqBody = {
      time: data[0].time,
      sent: sent,
    };

    const res = await axios.post(`${url}/stock/StockIn`, reqBody);
    if (res.status === 200) {
      await prisma.action.update({
        where: {
          id: data[0].id,
        },
        data: {
          IsOnline: true,
        },
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

scheduleJob("0 * * * * *", () => {
  syncAction();
});

scheduleJob("30 * * * * *", () => {
  syncAction();
});
