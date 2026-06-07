import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const phoneSchema = z.string()
  .regex(/^(\+212|0)[0-9]{9}$/, "Numéro invalide (ex: 0612345678)")
  .transform((v) => v.startsWith("0") ? "+212" + v.slice(1) : v);

const registerSchema = z.object({
  name: z.string().min(2),
  phone: phoneSchema,
  password: z.string().min(6),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
  city: z.string().optional(),
});

const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { name, phone, password, role, city } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { phone } });
  if (exists) return res.status(409).json({ message: "Phone already registered" });

  const hashed = await bcrypt.hash(password, 12);
  // email is not required — generate a placeholder so DB unique constraint is satisfied if needed
  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email: `${phone.replace("+", "")}@jemlamaroc.ma`,
      password: hashed,
      role,
      city,
    },
    select: { id: true, name: true, phone: true, role: true, city: true },
  });

  if (role === "SELLER" && req.body.businessName) {
    await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        businessName: req.body.businessName,
        whatsapp: req.body.whatsapp || phone,
        city: city || "Casablanca",
        description: req.body.description || null,
        logo: req.body.logo || null,
      },
    });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as unknown as number,
  });

  return res.status(201).json({ user, token });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });

  const { phone, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  if (user.isBlocked) return res.status(403).json({ message: "Account blocked" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as unknown as number,
  });

  return res.json({
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role, avatar: user.avatar },
    token,
  });
};

export const getMe = async (req: Request & { user?: { id: string } }, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, phone: true, role: true, city: true, avatar: true, sellerProfile: true },
  });
  return res.json(user);
};
