import mongoose from "mongoose";

// Definición del esquema (estructura del documento)
const caballeroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    constelacion: {
      type: String,
      required: true,
      trim: true,
    },
    nivel: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    imagen: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    versionKey: false, // elimina el campo __v
    collection: 'cualities', // usar la colección 'cualities' en la base de datos
  }
);

// Exportar el modelo
export const Caballero = mongoose.model("Caballero", caballeroSchema, 'cualities');