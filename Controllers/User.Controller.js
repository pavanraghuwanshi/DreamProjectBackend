import {User} from "../Models/user.Model.js";
import { comparePassword, encrypt } from "../Utils/crypto.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, mobileNo, password } = req.body;

    if (!username || !mobileNo || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) {
      return res.status(400).json({ error: "Mobile number already in use" });
    }

    const newUser = new User({
      username,
      mobileNo,
      password: encrypt(password),
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        username: savedUser.username,
        mobileNo: savedUser.mobileNo,
      },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};




export const loginUser = async (req, res) => {
     const { mobileNo, password } = req.body;
     let user;

   
     if (!mobileNo || !password) {
       return res.status(400).json({ message: 'Please enter valid details' });
     }
   
     try {

        const user = await User.findOne({ mobileNo });
      if (!user) {
        return res.status(400).json({ message: "Incorrect username or password" });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect username or password" });
      }
      
       // Generate JWT token
       const token = jwt.sign(
         {
           id: user._id,
           username: user.username,
            role: user.role,
         },
         process.env.JWT_SECRET,
       );
   
       res.status(200).json({
         message: "Successful Login",
         token,

       });
   
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
};








