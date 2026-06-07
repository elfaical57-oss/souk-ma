import { Router } from "express";
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { authenticate, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authenticate, requireRole("SELLER", "ADMIN"), createProduct);
router.put("/:id", authenticate, requireRole("SELLER", "ADMIN"), updateProduct);
router.delete("/:id", authenticate, requireRole("SELLER", "ADMIN"), deleteProduct);

export default router;
