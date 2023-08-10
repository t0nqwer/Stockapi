import { PrismaClient } from "@prisma/client";
import { barcodeCh } from "../controller/StockController.js";

const prisma = new PrismaClient();
export const updatePrice = async (barcode, price) => {
  console.log(barcode, price);
  try {
    prisma.$transaction(
      barcode.map((item) =>
        prisma.product.update({
          where: { barcode: item },
          data: { price: +price },
        })
      )
    );
  } catch (error) {
    console.log(error.message);
  }
};
export const addProduct = async (data) => {
  try {
    console.log(data);
    await prisma.$transaction([
      ...data.map((item) =>
        prisma.product.create({
          data: {
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
        })
      ),
      ...data.map((item) =>
        prisma.stock.create({
          data: {
            barcode: item.barcode,
            qty: 0,
          },
        })
      ),
    ]);
  } catch (error) {
    console.log(error.message);
  }
};
export const addCloth = async (data) => {
  try {
    await prisma.$transaction([
      prisma.product.create({
        data: {
          barcode: data.barcode,
          cloth: data.cloth,
          size: data.size,
          code: data.code,
          fabric: data.fabric,
          price: +data.price,
          name: data.name,
          brand: data.brand,
        },
      }),
      prisma.stock.create({
        data: {
          barcode: data.barcode,
          qty: 0,
        },
      }),
    ]);
  } catch (error) {}
};
