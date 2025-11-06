// backend3/server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db/postgres");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares con opciones de seguridad
app.use(cors({
  origin: ['http://localhost:3003', 'https://hunter-backent.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'accept'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Swagger / OpenAPI setup -------------------------------------------------
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Neon - Personajes Hunter",
    version: "1.0.0",
    description:
      "Documentación OpenAPI para el servicio Neon (PostgreSQL) que expone la tabla personajes_hunter.",
  },
  servers: [
    { url: "https://hunter-backent.onrender.com", description: "Backend desplegado en producción" },
    { url: "http://localhost:3003", description: "Servidor local (desarrollo)" }
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

// Schema para Personaje (Neon)
swaggerSpec.components = {
  schemas: {
    PersonajeHunter: {
      type: "object",
      properties: {
        id: { type: "integer" },
        nombre: { type: "string" },
        edad: { type: "integer" },
        anime: { type: "string" },
        tiponen: { type: "string" },
        habilidadnen: { type: "string" },
        personalidad: { type: "string" },
        objetivo: { type: "string" },
        mejoramigo: { type: "string" },
        imagen: { type: "string", format: "uri" },
      },
      example: {
        id: 1,
        nombre: "Gon Freecss",
        edad: 12,
        anime: "Hunter x Hunter",
        tiponen: "Reforzador",
        habilidadnen: "Jajanken",
        personalidad: "Optimista",
        objetivo: "Encontrar a su padre",
        mejoramigo: "Killua",
        imagen: "https://.../gon.png",
      },
    },
  },
};

// Paths documentadas
swaggerSpec.paths = {
  "/personajes_hunter": {
    get: {
      summary: "Obtener todos los personajes (Neon/Postgres)",
      responses: {
        200: {
          description: "Lista de personajes",
          content: {
            "application/json": { 
              schema: { 
                type: "array", 
                items: { $ref: "#/components/schemas/PersonajeHunter" } 
              } 
            },
          },
        },
        500: {
          description: "Error del servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Error consultando PostgreSQL" },
                  detalle: { type: "string" }
                }
              }
            }
          }
        }
      },
    },
    post: {
      summary: "Crear nuevo personaje",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/PersonajeHunter" } },
        },
      },
      responses: {
        201: {
          description: "Personaje creado exitosamente",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PersonajeHunter" }
            }
          }
        },
        400: {
          description: "Datos inválidos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Error insertando personaje" },
                  detalle: { type: "string" }
                }
              }
            }
          }
        },
        500: {
          description: "Error del servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  detalle: { type: "string" }
                }
              }
            }
          }
        }
      },
    },
  },
  "/personajes_hunter/{id}": {
    put: {
      summary: "Actualizar personaje por ID",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/PersonajeHunter" } } },
      },
      responses: { 200: { description: "Personaje actualizado" }, 404: { description: "No encontrado" } },
    },
    delete: {
      summary: "Eliminar personaje por ID",
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      responses: { 200: { description: "Eliminado" }, 404: { description: "No encontrado" } },
    },
  },
};

// Servir Swagger UI y JSON
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

// Ruta base de la API
const router = express.Router();

// Rutas principales
router.get('/', (req, res) => {
  res.json({ 
    message: '🛡️ API Hunters (backend3) funcionando correctamente',
    docs: '/api-docs',
    endpoints: {
      getAll: '/personajes_hunter',
      getById: '/personajes_hunter/:id',
      create: '/personajes_hunter',
      update: '/personajes_hunter/:id',
      delete: '/personajes_hunter/:id'
    }
  });
});


// Middleware para verificar conexión a DB
const checkDbConnection = async (req, res, next) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    next();
  } catch (error) {
    console.error("Error de conexión:", error);
    res.status(500).json({ 
      message: "Error de conexión a la base de datos",
      detalle: error.message 
    });
  }
};

// ✅ GET → obtener personajes desde Neon
router.get("/personajes_hunter", checkDbConnection, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personajes_hunter ORDER BY id ASC;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error en GET /personajes_hunter:", error);
    res.status(500).json({ 
      message: "Error consultando PostgreSQL", 
      detalle: error.message 
    });
  }
});

// ✅ PUT actualizar personaje en PostgreSQL (Neon)
app.put("/personajes_hunter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, anime, tiponen, habilidadnen, personalidad, objetivo, mejoramigo, imagen } = req.body;

    const result = await pool.query(
      `UPDATE personajes_hunter
        SET nombre=$1, edad=$2, anime=$3, tiponen=$4, habilidadnen=$5, personalidad=$6, objetivo=$7, mejoramigo=$8, imagen=$9
       WHERE id=$10 RETURNING *`,
      [nombre, edad, anime, tiponen, habilidadnen, personalidad, objetivo, mejoramigo, imagen, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "No encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "❌ Error actualizando en Neon", detalle: error.message });
  }
});

// ✅ POST → crear personaje
app.post("/personajes_hunter", async (req, res) => {
  try {
    const {
      nombre, edad, anime, tiponen, habilidadnen,
      personalidad, objetivo, mejoramigo, imagen
    } = req.body;

    const result = await pool.query(
      `INSERT INTO personajes_hunter (nombre, edad, anime, tiponen, habilidadnen, personalidad, objetivo, mejoramigo, imagen)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nombre, edad, anime, tiponen, habilidadnen, personalidad, objetivo, mejoramigo, imagen]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error insertando personaje", detalle: error.message });
  }
});

// ✅ DELETE → eliminar personaje por ID
app.delete("/personajes_hunter/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM personajes_hunter WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Personaje no encontrado" });

    res.json({ message: "Eliminado correctamente", eliminado: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando personaje", detalle: error.message });
  }
});

// ---------------------------------------------------------------------------
// Funciones de conexión y arranque
const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log("✅ Conectado a PostgreSQL:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error?.message ?? error);
    throw error;
  }
};

const start = async () => {
  try {
    // Verificar conexión a la base de datos
    await testDbConnection();

    // Iniciar servidor
    const host = process.env.BASE_URL || "https://hunter-backent.onrender.com";
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en ${host}`);
      console.log(`📘 Swagger Docs disponibles en ${host}/api-docs`);
      console.log(`💡 API endpoints disponibles en ${host}/personajes_hunter`);
    });
  } catch (error) {
    console.error("❌ No fue posible iniciar la aplicación:", error);
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// Iniciar servidor
start();
