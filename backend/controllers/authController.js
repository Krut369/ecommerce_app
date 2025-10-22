import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  if(!username || !email || !password){
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "user already exists" });
  }
  const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS));
  const user = await prisma.users.create({
    data: { name: username, email, passwordHash: hash, role: role || "customer" },
  });

  res.status(201).json({ id: user.id, email: user.email });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
};

export const profile = async (req, res) => {
  res.json({ id: req.user.id, name: req.user.name, role: req.user.role });
};