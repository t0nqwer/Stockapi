import express from "express";
import { PrismaClient } from "@prisma/client";
import { log } from "console";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const setting = await prisma.programSetting.findFirst();
    res.status(200).json(setting);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
router.post("/set", async (req, res) => {
  try {
    console.log(req.body.path);
    const setting = await prisma.programSetting.update({
      where: {
        id: 1,
      },
      data: {
        BarcodeFilePath: req.body.path,
      },
    });
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
