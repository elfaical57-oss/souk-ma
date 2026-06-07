import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth";
import productRoutes from "../src/routes/products";
import orderRoutes from "../src/routes/orders";
import reviewRoutes from "../src/routes/reviews";
import chatRoutes from "../src/routes/chat";
import sellerRoutes from "../src/routes/sellers";
import adminRoutes from "../src/routes/admin";
import categoryRoutes from "../src/routes/categories";

dotenv.config();

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://jemlamaroc.com",
  "https://www.jemlamaroc.com",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(compression());
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/admin") && !req.path.startsWith("/api/auth")) {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "JemlaMaroc API running" });
});

export default app;
