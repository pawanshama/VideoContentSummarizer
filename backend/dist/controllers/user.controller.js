"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.signUsers = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User"); // Import your User entity
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import dotenv, { config } from "dotenv";
// dotenv.config();
const signUsers = async (req, res) => {
    try {
        const { name, email, password_hash } = req.body;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const users = await userRepository.findOneBy({ email }); // Find all users
        if (users) {
            return res.status(409).json({ message: "Users already exists" });
        }
        //hashing the password for protection
        const hashedPassword = await bcryptjs_1.default.hash(password_hash, 10);
        const newUser = userRepository.create({ name, email, password_hash: hashedPassword });
        await userRepository.save(newUser);
        // console.log(newUser);
        if (process.env.JWT_SECRET) {
            const signing = jsonwebtoken_1.default.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7h' });
            res.cookie("token", signing, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
                httpOnly: true
            });
        }
        else {
            return res.status(500).json({ message: "error in backend" });
        }
        // console.log(newUser);
        if (!newUser) {
            return res.json(404).json({ message: "User parameter not matched" });
        }
        return res.status(201).json({ newUser, message: "User Created" });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};
exports.signUsers = signUsers;
const loginUser = async (req, res) => {
    try {
        const { email, password_hash } = req.body;
        // console.log(email,password_hash);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const newUser = await userRepository.findOneBy({ email });
        if (!newUser) {
            return res.status(401).json({ message: "User not found" });
        }
        // console.log("position 2",newUser)
        const verify = await bcryptjs_1.default.compare(password_hash, newUser.password_hash);
        // console.log("position 3",verify);
        if (!verify) {
            return res.status(400).json({ message: "password not matched" });
        }
        if (process.env.JWT_SECRET) {
            const signing = jsonwebtoken_1.default.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7h' });
            res.cookie("token", signing, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
                httpOnly: true
            });
        }
        else {
            return res.status(500).json({ message: "error in backend" });
        }
        return res.status(201).json({ newUser, message: "User logged In" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};
exports.loginUser = loginUser;
