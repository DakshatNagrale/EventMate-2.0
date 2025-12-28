import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const registerUser = async(req, res)=>{
  try{
    
    const {fullName, email, password} = req.body;
    
    //1. Basic Validation
    if(!fullName || !email || !password){
      return res.status(400).json({
        message: "All fields are required"
      });
    }
    
    // user already exists or not
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(409).json({
        message: "User already exists with this email"
      });
    }
    
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });
    
    return res.status(201).json({
      message: "User registered successfully",
      user:{
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
    
    
  }catch(error){
    console.log("Register error: ", error);
    return res.status(500).json({
      message: "internal server error"
    });
  }
}

//Login

export const loginUser = async(req, res)=>{
  
  try{
    
    const {email, password}=req.body;
    
    //Check if user exists
    if(!email || !password){
      return res.status(400).json({
        message: "Email and password required"
      });
    }
    
    //Find user
    const user = await User.findOne({email}).select("+password");
    if(!user){
      res.status(401).json({
        message: "Invalid credentials"
      });
    }
    
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }
    
    //generate jwt token 
    const token = jwt.sign({
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
    );
    
    //response
    res.status(200).json({
      message: "Login successfull",
      token,
      user:{
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
    
  } catch(error){
    console.log("Login error: ", error);
    res.status(500).json({
      message: "Login error"
    });
  }
}

