// import Superadmin from "../Models/superAdmin.js";
// import School from "../Models/school.js";
// import BranchGroup from "../Models/branchGroup.js";
// import Branch from "../Models/branch.js";
// import Parents from "../Models/parents.js";
// import Supervisor from "../Models/supervisor.js";
// import Driver from "../Models/driver.js";
// import jwt from "jsonwebtoken";
// import {comparePassword, encrypt} from "../Utils/crypto.js";
// import admin from "../config/firebaseadmin.js";



// Add user controller
export const addAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new Superadmin({
      username,
      email,
      password:encrypt(password),
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};



export const loginUser = async (req, res) => {
     const { username, password } = req.body;
     let user;
    //  let isMatch = false;

   
     if (!username || !password) {
       return res.status(400).json({ message: 'Please enter valid details' });
     }
   
     try {
       // Find user in various collections
   const [superAdmin, school, branch, branchGroup, parent, supervisor, driver] = await Promise.all([
  Superadmin.findOne({ username }).lean(),
  School.findOne({ username }),
  Branch.findOne({ username }).populate("schoolId", "username"),
  BranchGroup.findOne({ username }).populate("AssignedBranch", "username"),
  Parents.findOne({ username }).populate("username"),
  Supervisor.findOne({ username }).populate("username"),
  Driver.findOne({ username }).populate("username"),
]);

let user = superAdmin || school || branch || branchGroup || parent || supervisor || driver;
   
       if (!user) {
         return res.status(400).json({ message: 'Invalid credentials' });
       }

     if (
      (supervisor && supervisor.username === username && supervisor.isApproved === false) ||
      (driver && driver.username === username && driver.isApproved === false)
    ) {
      return res.status(403).json({ message: "Your account is not approved yet." });
    }

       // Validate password
       const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password or username ID" });
    }
   
       // Generate JWT token
       const token = jwt.sign(
         {
           id: user._id,
           username: user.username,
            role: user.role,
            AssignedBranch: user?.AssignedBranch,
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








