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
export const addSize = async (data) => {
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
