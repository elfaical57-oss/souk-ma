import express from "express";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import reviewRoutes from "./routes/reviews";
import chatRoutes from "./routes/chat";
import sellerRoutes from "./routes/sellers";
import adminRoutes from "./routes/admin";
import categoryRoutes from "./routes/categories";
import uploadRoutes from "./routes/upload";
import { setupSocketHandlers } from "./services/socketService";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:3001", process.env.CLIENT_URL].filter(Boolean) as string[];

const io = new Server(httpServer, {
  cors: { origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] },
});

app.use(compression());
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// No caching — always return fresh data
app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
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
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "JemlaMaroc API running" });
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { io };
