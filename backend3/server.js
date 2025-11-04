// backend3/server.js
const express = require("express");
const cors = require("cors");
const pool = require("./db/postgres");  // ← aquí ya no uses { pool }

const app = express();
app.use(cors());
app.use(express.json());

// ✅ GET → obtener personajes desde Neon
app.get("/personajes_hunter", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personajes_hunter ORDER BY id ASC;");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error consultando PostgreSQL", detalle: error.message });
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

const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`✅ backend3 listening on http://localhost:${PORT}`)
);
