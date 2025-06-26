
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware to check for admin token
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  console.log("user is here in protected route");
  try {
    const token = req.cookies.token;
    console.log(token);
    // ✅ Token existence check
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ JWT_SECRET existence check
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    console.log(secret);
    // ✅ Token verification
    const decoded = jwt.verify(token, secret);
    
    // Optionally attach user to request object
    (req as any).user = decoded;

    // ✅ Proceed to next middleware or route
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
