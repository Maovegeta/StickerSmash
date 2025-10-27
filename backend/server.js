// server.js
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { Caballero } from './models/Caballero.js';

// Configuración de variables de entorno
dotenv.config();

// Inicializar app Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Conectado a MongoDB Atlas');
} catch (error) {
  console.error('❌ Error al conectar a MongoDB:', error.message);
  process.exit(1);
}

// Rutas API
app.get('/', (req, res) => {
  res.send('🛡️ API Caballeros del Zodiaco funcionando correctamente');
});

// Obtener todos los caballeros
app.get('/caballeros', async (req, res) => {
  try {
    const caballeros = await Caballero.find();
    res.json(caballeros);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener caballeros', detalle: error.message });
  }
});

// Buscar caballeros por nombre (query ?name=valor)
app.get('/caballeros/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Falta el parámetro name' });

    const regex = new RegExp(String(name), 'i');
    const resultados = await Caballero.find({ nombre: regex }).limit(50);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error en búsqueda', detalle: error.message });
  }
});

// Agregar un nuevo caballero
app.post('/caballeros', async (req, res) => {
  try {
    const nuevoCaballero = new Caballero(req.body);
    await nuevoCaballero.save();
    res.status(201).json({ mensaje: 'Caballero agregado correctamente', data: nuevoCaballero });
  } catch (error) {
    res.status(400).json({ error: 'Error al agregar caballero', detalle: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
