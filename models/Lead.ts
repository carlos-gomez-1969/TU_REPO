import { Schema, models, model } from "mongoose";

const LeadSchema = new Schema(
  {
    name:  { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// Evita recompilar el modelo si ya existe en caliente (Next dev)
export default models.Lead || model("Lead", LeadSchema);
