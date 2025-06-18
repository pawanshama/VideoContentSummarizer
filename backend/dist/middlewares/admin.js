"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import dotenv,{config} from "dotenv";
// dotenv.config();
const checkAdmin = (req, res, next) => {
    console.log(req.body);
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "do not have token" });
        }
        if (process.env.JWT_SECRET) {
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (!decode) {
                return res.status(400).json({ message: "token verification failed" });
            }
        }
        else {
            return res.status(400).json({ message: "problem with jwt" });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: "error in jwt verify" });
    }
};
exports.checkAdmin = checkAdmin;
