import mongoose from "mongoose";
const { Schema, model, ObjectId } = mongoose;

const ImageSchema = new Schema(
  {
    url: { type: String },
    imageType: { type: String },
    alt: { type: String },
  },
  { _id: false }
);

const CardSchema = new Schema(
  {
    front: {
      img: ImageSchema,
      text: { type: String, required: true },
      description: { type: String },
    },
    back: {
      img: ImageSchema,
      text: { type: String, required: true },
      description: { type: String },
    },
    tags: [String],
    notes: { type: String },
    source: { type: String },
    statusList: {
      type: [String],
      enum: ["draft", "published", "archived"],
      default: ["draft"],
    },
    containers: [{ type: ObjectId, ref: "Container" }],
    userId: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Card", CardSchema);
