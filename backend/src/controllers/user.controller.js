import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

const login=async(req,res)=>{
    const {username,password}=req.body;

    if(!username || !password){
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and password are required" });
    }
   try{
     const user=await User.findOne({ username });
    if(!user){
        return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }
       let passwordMatch=await bcrypt.compare(password,user.password);
    if(passwordMatch){
        let token=crypto.randomBytes(20).toString("hex");

        user.token=token;
        await user.save();
        return res.status(httpStatus.OK).json({ message: "Login successful", token });
    }else{
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }
   }
   catch(err){
       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
   }
}
const register=async(req,res)=>{
    const {name, username, password}=req.body;  

    try{
        const existingUser=await User.findOne({ username });
        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            name:name,
            username:username,
            password:hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
    }
    catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

export {login,register};