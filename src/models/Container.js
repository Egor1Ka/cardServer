import mongoose from "mongoose";
const { Schema, model, ObjectId } = mongoose;

const ContainerSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    cards: [{ type: ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

export default model("Container", ContainerSchema);
