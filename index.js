import express from "express";
import db from "./config/db.config.js";
import bukuRoutes from "./routes/buku.routes.js";
import prodiRoutes from "./routes/prodi.routes.js";
import mahasiswaRoutes from "./routes/mahasiswa.routes.js";
import pinjams from "./routes/pinjams.routes.js";
import detail_pinjams from "./routes/detail_pinjam.routes.js";
import User from "./routes/user.routes.js";
import { authenticateToken } from "./middleware/VerifyTokens.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/buk", authenticateToken, bukuRoutes);
app.use("/api/mahasiswa",authenticateToken, mahasiswaRoutes);
app.use("/api/prodi", prodiRoutes);
app.use("/api/pinjam", pinjams);
app.use("/api/detail_pinjam", detail_pinjams);
app.use("/api/user", User);

app.get("/", (req, res) => {
  res.json({
    message: "Hello coba backend untuk vercel",
  });
});

try {
  await db.authenticate();
  console.log("Database connected");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
} catch (error) {
  console.error(error);
}
