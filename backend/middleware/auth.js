import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "no token" });
  }
  const token = header.split(" ")[1];  
  try{
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  }catch(err){
    return res.status(403).json({ message: "invalid token" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}