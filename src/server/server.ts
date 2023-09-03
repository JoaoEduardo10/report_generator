/* eslint-disable @typescript-eslint/no-array-constructor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express from "express";
import { prisma } from "../database/prismaClient";
import PdfPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
// import fs from "fs";

const server = express();

server.use(express.json());

server.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();

  res.status(200).json({ data: products });
});

server.get("/products/repot", async (req, res) => {
  const products = await prisma.product.findMany();
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const body = [];

  for await (const product of products) {
    const rows = new Array();

    rows.push(product.id);
    rows.push(product.description);
    rows.push(product.price.toFixed(2));
    rows.push(product.quantity);

    body.push(rows);
  }

  const printer = new PdfPrinter(fonts);

  const docDefinitions: TDocumentDefinitions = {
    defaultStyle: { font: "Helvetica" },
    content: [
      {
        columns: [
          {
            text: "relatório",
            style: "header",
          },
          {
            text: `${new Date().toLocaleDateString()}\n\n`,
            style: "header",
          },
        ],
      },
      {
        table: {
          heights: function (row) {
            return (row + 1) * 10;
          },
          body: [["id", "Descrição", "Preço", "Quantidade"], ...body],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinitions);

  // pdfDoc.pipe(fs.createWriteStream("Relatorio.pdf"));

  const chunks: any[] = [];

  pdfDoc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  pdfDoc.on("end", () => {
    const result = Buffer.concat(chunks);
    res.end(result);
  });

  pdfDoc.end();
});

export { server };
