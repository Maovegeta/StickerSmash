// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Caballero } from "./models/Caballero.js";

// Cargar variables de entorno
dotenv.config();

// Inicializar app Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Swagger / OpenAPI setup -------------------------------------------------
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Caballeros del Zodiaco",
    version: "1.0.0",
    description:
      "Documentación OpenAPI de los microservicios: Backend Caballeros. Reemplace los valores de `servers` por las URLs reales desplegadas en la nube.",
  },
  servers: [
    {
      url: "https://caballeros-backend.onrender.com",
      description: "Backend desplegado ",
    },
    { url: "http://localhost:4000", description: "Servidor local de desarrollo" },
  ],
  externalDocs: {
    description:
      "MongoDB Atlas (no exponer credenciales). Añada aquí enlace a su cluster o documentación de Atlas.",
    url: "https://www.mongodb.com/cloud/atlas",
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [], // Si en el futuro agregas JSDoc, aquí van las rutas
};

const swaggerSpec = swaggerJsdoc(options);

// Esquema Caballero
swaggerSpec.components = {
  schemas: {
    Caballero: {
      type: "object",
      properties: {
        _id: { type: "string" },
        nombre: { type: "string" },
        constelacion: { type: "string" },
        nivel: { type: "string" },
        descripcion: { type: "string" },
        imagen: { type: "string", format: "uri" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      example: {
        nombre: "Seiya",
        constelacion: "Pegaso",
        nivel: "Bronce",
        descripcion: "Caballero de Pegaso, valiente defensor de Atenea.",
        imagen: "https://i.pinimg.com/736x/6b/ba/29/6bba296a6ff0a5e65e492dda34dcc6aa.jpg",
      },
    },
  },
};

// Rutas documentadas
swaggerSpec.paths = {
  "/": {
    get: {
      summary: "Estado del API",
      responses: { 200: { description: "OK" } },
    },
  },
  "/caballeros": {
    get: {
      summary: "Obtener todos los caballeros",
      responses: {
        200: {
          description: "Lista de caballeros",
          content: {
            "application/json": {
              schema: { type: "array", items: { $ref: "#/components/schemas/Caballero" } },
            },
          },
        },
      },
    },
    post: {
      summary: "Agregar un nuevo caballero",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Caballero" } },
        },
      },
      responses: {
        201: { description: "Caballero creado" },
        400: { description: "Datos inválidos" },
      },
    },
  },
  "/caballeros/search": {
    get: {
      summary: "Buscar caballeros por nombre",
      parameters: [
        {
          name: "name",
          in: "query",
          required: true,
          schema: { type: "string" },
          description: "Nombre o fragmento a buscar",
        },
      ],
      responses: {
        200: {
          description: "Resultados de búsqueda",
          content: {
            "application/json": {
              schema: { type: "array", items: { $ref: "#/components/schemas/Caballero" } },
            },
          },
        },
        400: { description: "Falta el parámetro name" },
      },
    },
  },
};

// Swagger UI y JSON
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

// ---------------------------------------------------------------------------
// Conexión a MongoDB Atlas
const conectarMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};
await conectarMongo();

// ---------------------------------------------------------------------------
// Rutas API
app.get("/", (req, res) => {
  res.send("🛡️ API Caballeros del Zodiaco funcionando correctamente");
});

// Obtener todos los caballeros
app.get("/caballeros", async (req, res) => {
  try {
    const caballeros = await Caballero.find();
    res.json(caballeros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener caballeros", detalle: error.message });
  }
});

// Buscar caballeros por nombre
app.get("/caballeros/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "Falta el parámetro name" });

    const regex = new RegExp(String(name), "i");
    const resultados = await Caballero.find({ nombre: regex }).limit(50);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error en búsqueda", detalle: error.message });
  }
});

// Agregar un nuevo caballero
app.post("/caballeros", async (req, res) => {
  try {
    const nuevoCaballero = new Caballero(req.body);
    await nuevoCaballero.save();
    res
      .status(201)
      .json({ mensaje: "Caballero agregado correctamente", data: nuevoCaballero });
  } catch (error) {
    res.status(400).json({ error: "Error al agregar caballero", detalle: error.message });
  }
});

// ---------------------------------------------------------------------------
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en https://caballeros-backend.onrender.com:${PORT}`);
  console.log(`📘 Swagger Docs disponibles en https://caballeros-backend.onrender.com:${PORT}/api-docs`);
});
