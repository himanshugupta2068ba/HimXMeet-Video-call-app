import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import {hash} from "bcrypt";

const login=async(req,res)=>{
    const {username,password}=req.body;

    if(!username || !password){
        return res.status(httpStatus.BadRequest).json({ message: "Username and password are required" });
    }
   try{
     const user=await User.findOne({ username });
    if(!user){
        return res.status(httpStatus.Not_Found).json({ message: "User not found" });
    }

    if(bcrypt.compare(password,user.password)){
        let token=crypto.randomBytes(20).toString("hex");

        user.token=token;
        await user.save();
        return res.status(httpStatus.OK).json({ message: "Login successful", token });
    }
   }
   catch(err){
       return res.status(httpStatus.InternalServerError).json({ message: "Internal server error" });
   }
}
const register=async(req,res)=>{
    const {name, username, password}=req.body;  

    try{
        const existingUser=await User.findOne({ username });
        if(existingUser){
            return res.status(httpStatus.Found).json({ message: "User already exists" });
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            name:name,
            username:username,
            password:hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.Created).json({ message: "User registered successfully" });
    }
    catch(e){
        res.status(httpStatus.InternalServerError).json({ message: "Internal server error" });
    }
}

export {login,register};