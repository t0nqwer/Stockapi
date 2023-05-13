import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { log } from "console";
const prisma = new PrismaClient();

export const UpdateProductData = async (req, res, next) => {
  try {
    const response = await axios.get(
      // "https://khwanta-api2546.com/stock/stockdata"
      "http://localhost:7070/stock//stockdata"
    );
    const data = response.data.map((item) => {
      return { ...item, qty: 0 };
    });

    const list = data.map(async (item) => {
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
          Sort: item.sort,
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
          Sort: item.sort,
        },
      });
      return dat;
    });
    // if (list) {
    //   data.map(async (item) => {
    //     const check = await prisma.stock.findUnique({
    //       where: { barcode: item.barcode },
    //     });
    //     if (!check) {
    //       await prisma.stock.create({
    //         data: {
    //           barcode: item.barcode,
    //           qty: 0,
    //         },
    //       });
    //     }
    //   });
    // }
    next();
    // res.status(200).json({ list, data });
  } catch (error) {
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

export const ListProduct = async (req, res) => {
  console.log("req.listproduct");
  const { search } = req.query;
  log(req.query);
  try {
    const products = await prisma.product.findMany({
      where: {
        cloth: true,
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
        Sort: true,
        price: true,
        brand: true,
        stock: true,
      },
      orderBy: [{ code: "asc" }, { fabric: "asc" }, { Sort: "asc" }],
    });
    res.status(200).json(products);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const StockIn = async (req, res) => {
  try {
    res.status(200).json({ message: "Stock In" });
  } catch (error) {
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
