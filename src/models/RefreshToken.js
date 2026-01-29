import mongoose from "mongoose";
const { Schema, model } = mongoose;

const RefreshTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    provider: { type: String, required: true },
    providerUserId: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("RefreshToken", RefreshTokenSchema);
