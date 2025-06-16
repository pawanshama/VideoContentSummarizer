import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken";
// import dotenv,{config} from "dotenv";
// dotenv.config();
export const checkAdmin = (req:Request,res:Response,next:NextFunction)=>{
    console.log(req.body);
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"do not have token"});
        }
        if(process.env.JWT_SECRET){

            const decode = jwt.verify(token , process.env.JWT_SECRET);
            if(!decode){
                return res.status(400).json({message:"token verification failed"});
            }
        }
        else{
            return res.status(400).json({message:"problem with jwt"});
        }
        next();
    }
    catch(error){
        return res.status(500).json({message:"error in jwt verify"});
    }
}