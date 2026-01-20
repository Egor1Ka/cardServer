import express from "express";
import routes from "./routes/routes.js";
import cors from "cors";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";

const { PORT } = process.env;
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

connectDB();

if (process.env.API_PREFIX) {
  app.use(`/${process.env.API_PREFIX}`, routes);
} else {
  app.use(routes);
}

app.set("trust proxy", true);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
