import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, enum: ["user", "seller", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default model("User", UserSchema);
