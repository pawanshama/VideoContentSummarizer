// import {Request,Response,NextFunction} from "express"
// import jwt from "jsonwebtoken";
// // import dotenv,{config} from "dotenv";
// // dotenv.config();
// export const checkAdmin = (req:Request,res:Response,next:NextFunction)=>{
//     // console.log(req.body);
//     try{
//         const token = req.cookies.token;
//         if(!token){
//             return res.status(400).json({message:"do not have token"});
//         }
//         if(process.env.JWT_SECRET){
//             const decode = jwt.verify(token , process.env.JWT_SECRET);
//             if(!decode){
//                 return res.status(400).json({message:"token verification failed"});
//             }
//         }
//         else{
//             return res.status(400).json({message:"problem with jwt"});
//         }
//         next();
//     }
//     catch(error){
//         return res.status(500).json({message:"error in jwt verify"});
//     }
// }

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware to check for admin token
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
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
