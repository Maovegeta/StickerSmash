import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

jest.unstable_mockModule("../models/Hunter.js", () => ({
  Hunter: {
    find: jest.fn(), // ✅ mock de función find()
  },
}));

const { Hunter } = await import("../models/Hunter.js");

const app = express();
app.use(express.json());

app.get("/hunters", async (req, res) => {
  const hunters = await Hunter.find();
  res.json(hunters);
});

describe("✅ TEST usando MOCK de Mongoose", () => {
  test("should return mocked hunter list", async () => {
       console.log("🎭 TEST MOCK: simulando respuesta de Mongoose");
    Hunter.find.mockResolvedValue([
      { nombre: "Gon", edad: 12 },
      { nombre: "Killua", edad: 12 },
    ]);

    const response = await request(app).get("/hunters");
     console.log("➡️  Datos mock retornados:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].nombre).toBe("Gon");
  });
});
