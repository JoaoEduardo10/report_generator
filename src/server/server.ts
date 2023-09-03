import express from "express";
import { prisma } from "../database/prismaClient";

const server = express();

server.use(express.json());

server.get("/", async (req, res) => {
  const products = await prisma.product.findMany();

  res.status(200).json({ data: products });
});

export { server };
