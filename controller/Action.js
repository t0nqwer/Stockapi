import { PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();
import moment from "moment-timezone";

export const queryActin = async (req, res) => {
  console.log("Asda");
  try {
    const data = await prisma.action.deleteMany({
      where: {
        time: {
          lt: new Date("2023-08-01"),
        },
      },
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const syncAction = async (req, res) => {
  try {
    const data = await prisma.action.findMany({
      where: {
        IsOnline: false,
      },
      include: {
        actionDetail: true,
      },
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

export const GetExport = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.action.findMany({
      where: {
        id: {
          contains: id ? id : "",
        },
        actionid: 2,
      },
      include: {
        actionDetail: true,
      },
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};
export const SaveExport = async (req, res) => {
  const day = moment.tz(Date.now(), "Asia/Bangkok").format();

  const { store, product } = req.body;
  console.log(req.body, day);
  try {
    const actionDetail = product.map((item) =>
      prisma.actionDetail.create({
        data: {
          actionid: day
            .split("-")
            .join("")
            .split(":")
            .join("")
            .split("+")
            .join(""),
          barcode: item.barcode,
          amout: item.importqty,
        },
      })
    );
    const action = prisma.action.create({
      data: {
        id: day.split("-").join("").split(":").join("").split("+").join(""),
        actionid: 2,
        shopName: store,
        time: day,
        username: "admin",
        status: "draft",
      },
    });
    await prisma.$transaction([action, ...actionDetail]);
    res.status(200).json(req.body);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};
export const UpdateExport = async (req, res) => {
  const { id, product } = req.body;
  try {
    console.log(id, product);
    const deleteMany = prisma.actionDetail.deleteMany({
      where: {
        actionid: id,
      },
    });
    const actionDetail = product.map((item) =>
      prisma.actionDetail.create({
        data: {
          actionid: id,
          barcode: item.barcode,
          amout: item.importqty,
        },
      })
    );
    await prisma.$transaction([deleteMany, ...actionDetail]);
    res.status(200).json("success");
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error);
  }
};
export const TransferProduct = async (req, res) => {};
const deleteMany = async (req, res) => {
  try {
    await prisma.action.deleteMany({
      where: {
        actionid: 2,
      },
    });
    console.log("done");
  } catch (error) {}
};

// deleteMany();
