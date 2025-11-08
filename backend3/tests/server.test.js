// tests/server.test.js

const request = require("supertest");

// ✅ MOCK explícito de la BD
jest.mock("../db/postgres", () => ({
  query: jest.fn(),
  connect: jest.fn().mockResolvedValue({
    release: jest.fn(),
    query: jest.fn().mockResolvedValue({ rows: [{ now: "2025-01-01" }] })
  }),
}));

// Importamos el servidor SIN levantarlo
const app = require("../server");

describe("🧪 API Neon - Microservicio Personajes Hunter", () => {

  test("GET /personajes_hunter → ✅ devuelve lista de personajes (mock BD)", async () => {

    // Simular respuesta del SELECT
    const mockRows = [
      { id: 1, nombre: "Gon", anime: "HxH" },
      { id: 2, nombre: "Killua", anime: "HxH" }
    ];

    const pool = require("../db/postgres");
    pool.query.mockResolvedValueOnce({ rows: mockRows });

    const res = await request(app).get("/personajes_hunter");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);

    console.log("🟢 Test 1 → GET /personajes_hunter funciona correctamente usando MOCK");
  });


  test("POST /personajes_hunter → ✅ crea nuevo personaje", async () => {

    const newPersonaje = {
      nombre: "Kurapika",
      edad: 17,
      anime: "HxH",
      tiponen: "Especialista",
      habilidadnen: "Cadena de juicio",
      personalidad: "Serio",
      objetivo: "Vengar al clan Kurta",
      mejoramigo: "Leorio",
      imagen: "https://imagen.com"
    };

    const pool = require("../db/postgres");
    pool.query.mockResolvedValueOnce({ rows: [{ id: 99, ...newPersonaje }] });

    const res = await request(app).post("/personajes_hunter").send(newPersonaje);

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("Kurapika");

    console.log("🟢 Test 2 → POST /personajes_hunter inserta correctamente");
  });


  test("DELETE /personajes_hunter/:id → ✅ elimina personaje", async () => {

    const idToDelete = 10;

    const pool = require("../db/postgres");
    pool.query.mockResolvedValueOnce({
      rowCount: 1,
      rows: [{ id: idToDelete, nombre: "Personaje Eliminado" }]
    });

    const res = await request(app).delete(`/personajes_hunter/${idToDelete}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Eliminado correctamente");

    console.log("🟢 Test 3 → DELETE /personajes_hunter elimina correctamente");
  });

});