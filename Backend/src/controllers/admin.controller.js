import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';

export const createOrganizer = async (req, res)=>{ 
  
  try{
    const {fullName, email, password}=req.body;
    
    if(!fullName || !email || !password){
      res.status(400).json({
        message: "All fields are required"
      });
    }
    
    const existingUser = await User.findOne({email});
    if(existingUser){
      res.status(409).json({
        message: "User already exists"
      })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const organizer = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "ORGANIZER",
      createdBy: req.user.userId
    });
    
    return res.status(201).json({
      message: "Organizer created successfully",
      organizer: {
        id: organizer._id,
        fullName: organizer.fullName,
        email: organizer.email,
        role: organizer.role
      }
    });
    
  }
  catch(error){
    console.log("create organizer error");
    res.status(500).json({
      message: "Server error"
    })
  }
};