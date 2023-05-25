import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { log } from "console";
import https from "https";
const prisma = new PrismaClient();

export const UpdateProductData = async (req, res, next) => {
  try {
    const response = await axios.get("http://167.172.69.153/barcode");

    response.data.map(async (item) => {
      const dat = await prisma.product.upsert({
        where: { barcode: item.barcode },
        update: {
          cloth: item.cloth,
          size: item.size,
          code: item.code,
          fabric: item.fabric,
          name: item.name,
          price: +item.price,
          brand: item.brand,
          sort: item.sort,
        },
        create: {
          barcode: item.barcode,
          cloth: item.cloth,
          size: item.size,
          code: item.code,
          fabric: item.fabric,
          name: item.name,
          price: +item.price,
          brand: item.brand,
          sort: item.sort,
        },
      });
      return dat;
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const barcodeCheck = async (req, res) => {
  try {
    const barcode = await prisma.product.findMany({
      select: {
        barcode: true,
      },
    });
    barcode.map(async (item) => {
      const check = await prisma.stock.findUnique({
        where: { barcode: item.barcode },
      });
      if (!check) {
        await prisma.stock.create({
          data: {
            barcode: item.barcode,
            qty: 0,
          },
        });
      }
    });
    res.status(200).json("done");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const checkcheck = async (req, res) => {
  try {
    const response = await axios.get("http://167.172.69.153/barcode");
    response.data.map(async (item) => {
      const dat = await prisma.product.upsert({
        where: { barcode: item.barcode },
        update: {
          cloth: item.cloth,
          size: item.size,
          code: item.code,
          fabric: item.fabric,
          name: item.name,
          price: +item.price,
          brand: item.brand,
          sort: item.sort,
        },
        create: {
          barcode: item.barcode,
          cloth: item.cloth,
          size: item.size,
          code: item.code,
          fabric: item.fabric,
          name: item.name,
          price: +item.price,
          brand: item.brand,
          sort: item.sort,
        },
      });

      return dat;
    });
    const items = response.data.map((e) => e.barcode);
    const currentbarcode = await prisma.product
      .findMany({
        select: { barcode: true },
      })
      .then((e) => e.map((e) => e.barcode));
    const deletedbarcode = currentbarcode.filter((e) => !items.includes(e));
    try {
      await prisma.$transaction([
        ...deletedbarcode.map((e) =>
          prisma.stock.delete({
            where: { barcode: e },
          })
        ),
        ...deletedbarcode.map((e) =>
          prisma.product.delete({
            where: { barcode: e },
            include: { stock: true, actionDetail: true },
          })
        ),
      ]);
    } catch (error) {
      console.log(error.message, 1);
    }
    console.log(1);
  } catch (error) {
    console.log(error);
  }
};
export const barcodeCh = async (req, res) => {
  try {
    const barcode = await prisma.product.findMany({
      select: {
        barcode: true,
      },
    });
    barcode.map(async (item) => {
      const check = await prisma.stock.findUnique({
        where: { barcode: item.barcode },
      });
      if (!check) {
        await prisma.stock.create({
          data: {
            barcode: item.barcode,
            qty: 0,
          },
        });
      }
    });
    console.log(2);
  } catch (error) {
    console.log(error.message);
  }
};
// setInterval(checkcheck, 10000);
// setInterval(barcodeCh, 10000);

export const ListProduct = async (req, res) => {
  const { search } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { barcode: { contains: search } },
          { size: { contains: search } },
          { code: { contains: search } },
          { name: { contains: search } },
          { fabric: { contains: search } },
          { brand: { contains: search } },
        ],
      },
      select: {
        barcode: true,
        cloth: true,
        size: true,
        code: true,
        name: true,
        fabric: true,
        sort: true,
        price: true,
        brand: true,
        stock: true,
      },
      orderBy: [{ code: "asc" }, { fabric: "asc" }, { sort: "asc" }],
    });
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
const agent = new https.Agent({
  rejectUnauthorized: false,
});
export const StockIn = async (req, res) => {
  const input = req.body;
  const d = new Date();
  const dformat = [
    d.getMonth() + 1,
    d.getDate(),
    d.getFullYear(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
  ].join("");

  try {
    const create = await prisma.$transaction([
      ...input.map((item) =>
        prisma.stock.update({
          where: { barcode: item.barcode },
          data: {
            qty: {
              increment: item.importqty,
            },
          },
        })
      ),
      prisma.action.create({
        data: {
          id: dformat,
          actionid: 1,
          username: "admin",
        },
      }),
      ...input.map((item) =>
        prisma.actionDetail.create({
          data: {
            actionid: dformat,
            barcode: item.barcode,
            amout: item.importqty,
          },
        })
      ),
    ]);
    console.log(input);
    res.status(200).json({ message: "Stock in", create });
  } catch (error) {
    log(error);
    res.status(500).json({ message: error.message });
  }
};

export const StockOut = async (req, res) => {
  try {
    res.status(200).json({ message: "Stock out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
