
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware to check for admin token
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    // ✅ Token existence check
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ JWT_SECRET existence check
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }
    // ✅ Token verification
    const decoded = jwt.verify(token, secret);
    if (decoded && typeof decoded === "object" && "id" in decoded) {
        const id = decoded.id;
        if(req.params.id && req.params.id !== id){
          console.log("Unauthorized access attempt by user:", id);
            return res.status(403).json({ message: "You are not authorized to access this user",id });
        } 
    }
    // console.log(decoded);
    // Optionally attach user to request object
    (req as any).user = decoded;
    // ✅ Proceed to next middleware or route
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
