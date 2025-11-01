import mongoose from 'mongoose';

const hunterSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    edad: { type: Number },
    anime: { type: String, trim: true, default: 'Hunter x Hunter' },
    nen: {
      tipo: { type: String, trim: true },
      habilidad: { type: String, trim: true },
    },
    personalidad: { type: String, trim: true },
    objetivo: { type: String, trim: true },
    mejorAmigo: { type: String, trim: true },
    imagen: {
      type: String,
      trim: true,
      validate: {
        validator: (url) => /^(https?:)?\/\/[^\s]+(png|jpg|jpeg|webp|gif|svg)$/i.test(String(url)),
        message: 'La URL de la imagen no es válida',
      },
    },
  },
  { timestamps: true, versionKey: false, collection: 'hunters' }
);

export const Hunter = mongoose.model('Hunter', hunterSchema, 'hunters');

const CaballeroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    constelacion: {
      type: String,
      required: [true, "La constelación es obligatoria"],
      trim: true,
    },
    nivel: {
      type: String,
      required: [true, "El nivel es obligatorio"],
      enum: ["Bronce", "Plata", "Oro"], // valores válidos
    },
    descripcion: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },
    imagen: {
      type: String,
      required: [true, "La URL de la imagen es obligatoria"],
      validate: {
        validator: (url) =>
          /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg))$/i.test(url),
        message: "La URL de la imagen no es válida o no apunta a una imagen",
      },
    },
  },
  { timestamps: true, 
    versionKey: false, // elimina el campo __v
    collection: 'cualities', // usar la colección 'cualities' en la base de datos
    }
);

export const Caballero = mongoose.model("Caballero", caballeroSchema, 'cualities');
