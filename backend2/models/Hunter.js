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


