import pkg from "@prisma/client";

const prisma = new pkg.PrismaClient();

const reset = async () => {
  try {
    const getaction = await prisma.actionDetail.findMany();
    await prisma.stock
      .updateMany({
        data: {
          qty: 0,
        },
      })
      .then(async (data) => {
        const data1 = await prisma.$transaction(
          getaction.map((e) =>
            prisma.stock.update({
              where: {
                barcode: e.barcode,
              },
              data: {
                qty: {
                  increment: e.amout,
                },
              },
            })
          )
        );
        console.log(data1);
      });
  } catch (error) {
    console.log(error.message);
  }
};

reset();
