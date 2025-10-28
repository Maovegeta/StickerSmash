import mongoose from "mongoose";

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
  { timestamps: true }
);

export const Caballero = mongoose.model("Caballero", CaballeroSchema);
