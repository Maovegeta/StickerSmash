import request from "supertest";

const BASE_URL = "https://hunter-backent.onrender.com";

describe("✅ Pruebas microservicio Hunters", () => {

  test("GET /hunters debe retornar lista de hunters", async () => {
    console.log("🔍 TEST 1: Consultando lista de hunters...");

    const response = await request(BASE_URL).get("/hunters");

    console.log("➡️  Respuesta recibida:", response.body);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    console.log("✅ TEST 1 OK: La API devuelve un array de hunters\n");
  });

  test("POST /hunters debe crear un nuevo hunter", async () => {
    console.log("🛠 TEST 2: Creando nuevo hunter...");

    const nuevoHunter = {
      nombre: "Test",
      edad: 20,
      anime: "Hunter x Hunter"
    };

    const response = await request(BASE_URL).post("/hunters").send(nuevoHunter);

    console.log("➡️  Respuesta del servidor:", response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("mensaje");
    expect(response.body.data).toHaveProperty("_id");

    // Guardamos el ID para el siguiente test
    global.hunterCreadoId = response.body.data._id;

    console.log("✅ TEST 2 OK: Hunter creado exitosamente\n");
  });

  test("DELETE /hunters/:id debe eliminar un hunter existente", async () => {
    console.log("🗑 TEST 3: Eliminando hunter creado en el test anterior...");

    const response = await request(BASE_URL).delete(`/hunters/${global.hunterCreadoId}`);

    console.log("➡️  Respuesta del servidor:", response.body);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("mensaje");

    console.log("✅ TEST 3 OK: Hunter eliminado correctamente\n");
  });

});
