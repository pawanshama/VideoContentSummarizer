// src/controllers/userController.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User'; // Import your User entity
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
// import dotenv, { config } from "dotenv";
// dotenv.config();

export const signUsers = async (req: Request, res: Response) => {
  try {
    const {name,email,password_hash} = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.findOneBy({email}); // Find all users
    if(users){
        return res.status(409).json({message:"Users already exists"});
    }
    //hashing the password for protection
    const hashedPassword = await bcrypt.hash(password_hash,10);
    const newUser = userRepository.create({ name, email,password_hash:hashedPassword});
    await userRepository.save(newUser);
    // console.log(newUser);
    if(process.env.JWT_SECRET){
      const signing = jwt.sign({id:newUser.id}, process.env.JWT_SECRET ,{expiresIn:'7h'});
      
      res.cookie("token",signing,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite:'strict',
        httpOnly:true
      });
    }
    else{
      return res.status(500).json({message:"error in backend"})
    }
    // console.log(newUser);
    if(!newUser){
      return res.json(404).json({message:"User parameter not matched"});
    }
    return res.status(201).json({newUser,message:"User Created"});
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password_hash } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const newUser = await userRepository.findOneBy({ email});
    if(!newUser){
      return res.status(401).json({message:"User not found"});
    }
    
    const verify = await bcrypt.compare(password_hash,newUser.password_hash);
    // console.log("position 3",verify);
    if(!verify){
      return res.status(400).json({message:"password not matched"});
    }
    if(process.env.JWT_SECRET){
      const signing = jwt.sign({id:newUser.id}, process.env.JWT_SECRET ,{expiresIn:'7h'});
      
      res.cookie("token",signing,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite:'strict',
        httpOnly:true
      });
    }
    else{
      return res.status(500).json({message:"error in backend"})
    }
    
    return res.status(201).json({newUser,message:"User logged In"});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};