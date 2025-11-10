// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Hunter } from "./models/Hunter.js";

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
    title: "API Hunters (backend2)",
    version: "1.0.0",
    description:
      "Documentación OpenAPI del backend2 para personajes de Hunter. Reemplace los valores de `servers` por las URLs reales desplegadas en la nube.",
  },
  servers: [
    {
      url: "https://hunter-backent.onrender.com",
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

// Esquema Hunter
swaggerSpec.components = {
  schemas: {
    Hunter: {
      type: "object",
      properties: {
        _id: { type: "string" },
        nombre: { type: "string" },
        edad: { type: "integer" },
        anime: { type: "string" },
        tiponen: { type: "string" }, 
        habilidad: { type: "string" },
        personalidad: { type: "string" },
        objetivo: { type: "string" },
        mejorAmigo: { type: "string" },
        imagen: { type: "string", format: "uri" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      example: {
        nombre: "Gon Freecss",
        edad: 12,
        anime: "Hunter x Hunter",
        tiponen: "Reforzador", 
        habilidad: "Jajanken",
        personalidad: "Optimista, determinado e inocente.",
        objetivo: "Encontrar a su padre Ging Freecss.",
        mejorAmigo: "Killua Zoldyck",
        imagen: "https://static.wikia.nocookie.net/hunterxhunter/images/2/26/Gon_2011.png",
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
  "/hunters": {
    get: {
      summary: "Obtener todos los personajes (hunters)",
      responses: {
        200: {
          description: "Lista de personajes",
          content: {
            "application/json": {
              schema: { type: "array", items: { $ref: "#/components/schemas/Hunter" } },
            },
          },
        },
      },
    },
    post: {
      summary: "Agregar un nuevo personaje",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Hunter" } },
        },
      },
      responses: {
        201: { description: "Personaje creado" },
        400: { description: "Datos inválidos" },
      },
    },
  },
  "/hunters/{id}": {
    put: {
      summary: "Actualizar personaje por ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del personaje (MongoDB ObjectId)",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Hunter" } },
        },
      },
      responses: {
        200: {
          description: "Personaje actualizado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  mensaje: { type: "string" },
                  data: { $ref: "#/components/schemas/Hunter" },
                },
              },
            },
          },
        },
        404: { description: "Personaje no encontrado" },
        400: { description: "Error de validación o actualización" },
      },
    },
    delete: {
      summary: "Eliminar personaje por ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "ID del personaje (MongoDB ObjectId)",
        },
      ],
      responses: {
        200: {
          description: "Personaje eliminado correctamente",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  mensaje: { type: "string" },
                },
              },
            },
          },
        },
        404: { description: "Personaje no encontrado" },
        500: { description: "Error al eliminar personaje" },
      },
    },
  },
  "/hunters/search": {
    get: {
      summary: "Buscar personajes por nombre",
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
              schema: { type: "array", items: { $ref: "#/components/schemas/Hunter" } },
            },
          },
        },
        400: { description: "Falta el parámetro name" },
      },
    },
  },
};

// Swagger UI y JSON (activar explorer para navegación más fácil)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

// ---------------------------------------------------------------------------
// Conexión a MongoDB Atlas y arranque del servidor
// Encapsulamos la conexión y el listen en una función `start()` para más control
const conectarMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error?.message ?? error);
    throw error;
  }
};

const start = async () => {
  try {
    await conectarMongo();

    const host = process.env.BASE_URL || `http://localhost:${PORT}`;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en ${host}`);
      console.log(`📘 Swagger Docs disponibles en ${host}/api-docs`);
    });
  } catch (error) {
    console.error("No fue posible iniciar la aplicación:", error);
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// Rutas API

app.get('/', (req, res) => {
  res.send('🛡️ API Hunters (backend2) funcionando correctamente');
});

// Obtener todos los hunters
app.get('/hunters', async (req, res) => {
  try {
    const hunters = await Hunter.find();
    res.json(hunters);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener personajes', detalle: error.message });
  }
});

// Buscar hunters por nombre
app.get('/hunters/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Falta el parámetro name' });

    const regex = new RegExp(String(name), 'i');
    const resultados = await Hunter.find({ nombre: regex }).limit(50);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error en búsqueda', detalle: error.message });
  }
});

// Agregar un nuevo hunter
app.post('/hunters', async (req, res) => {
  try {
    const nuevo = new Hunter(req.body);
    await nuevo.save();
    res.status(201).json({ mensaje: 'Personaje agregado correctamente', data: nuevo });
  } catch (error) {
    res.status(400).json({ error: 'Error al agregar personaje', detalle: error.message });
  }
});
// Actualizar un hunter existente
app.put('/hunters/:id', async (req, res) => {
  try {
    const actualizado = await Hunter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!actualizado) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    res.json({ mensaje: "Personaje actualizado correctamente", data: actualizado });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar personaje', detalle: error.message });
  }
});

app.delete('/hunters/:id', async (req, res) => {
  try {
    const eliminado = await Hunter.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Personaje no encontrado" });

    res.json({ mensaje: "Personaje eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar personaje", detalle: error.message });
  }
});

// ---------------------------------------------------------------------------
// Iniciar servidor (arranca la conexión y luego el listen)
if (process.env.NODE_ENV !== "test") {
  start();
}
