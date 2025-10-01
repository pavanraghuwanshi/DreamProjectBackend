import Superadmin from "../Models/superAdmin.js";
import School from "../Models/school.js";
import BranchGroup from "../Models/branchGroup.js";
import Branch from "../Models/branch.js";
import Parents from "../Models/parents.js";
import Supervisor from "../Models/supervisor.js";
import Driver from "../Models/driver.js";
import jwt from "jsonwebtoken";
import {comparePassword, encrypt} from "../Utils/crypto.js";
import admin from "../config/firebaseadmin.js";



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



// export const storeFcmToken = async (req, res) => {
//   const { fcmToken: newToken } = req.body;
//   const { id, role } = req.user || {};

//   if (!id || !role || !newToken) {
//     return res.status(400).json({ message: 'Missing id, role, or token' });
//   }

//   // 🔍 Determine correct model
//   let Model;
//   if (role === 'superAdmin') Model = Superadmin;
//   else if (role === 'school') Model = School;
//   else if (role === 'branch') Model = Branch;
//   else if (role === 'parents') Model = Parents;
//   else if (role === 'driver') Model = Driver;
//   else if (role === 'supervisor') Model = Supervisor;
//   else {
//     return res.status(400).json({ message: `Unknown role: ${role}` });
//   }

//   try {
//     // 🔄 Load existing FCM token array
//     const doc = await Model.findById(id).select('fcmToken').lean();
//     if (!doc) {
//       return res.status(404).json({ message: `${role} not found` });
//     }

//     const existingTokens = doc.fcmToken || [];

//     // ❌ Remove invalid tokens (if any)
//     const invalidTokens = [];
//     await Promise.all(
//       existingTokens.map(async (token) => {
//         try {
//           await admin.messaging().sendToDevice(token, { data: {} }, { dryRun: true });
//         } catch (err) {
//           if (
//             ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']
//               .includes(err.code)
//           ) {
//             invalidTokens.push(token);
//           }
//         }
//       })
//     );

//     if (invalidTokens.length > 0) {
//       await Model.updateOne(
//         { _id: id },
//         { $pull: { fcmToken: { $in: invalidTokens } } }
//       );
//       console.log(`Invalid FCM tokens removed for ${role}:`, invalidTokens);
//     }

//     // ✅ Add new token if not already present
//     const updateResult = await Model.updateOne(
//       { _id: id },
//       { $addToSet: { fcmToken: newToken } }
//     );
//     console.log('FCM token update result:', updateResult);

//     return res.status(200).json({ message: 'FCM token stored successfully' });
//   } catch (err) {
//     console.error('Error in storeFcmToken:', err);
//     return res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// };


console.log()
// export const storeFcmToken = async (req, res) => {
//   const { fcmToken: newToken } = req.body;
//   const { id, role } = req.user || {};

//   console.log("store called with:", { id, role, newToken });

//   if (!id || !role || !newToken) {
//     return res.status(400).json({ message: 'Missing id, role or token' });
//   }

//   let Model;
//   if (role === 'superAdmin') Model = Superadmin;
//   else if (role === 'school') Model = School;
//   else if (role === 'branch') Model = Branch;
//   else return res.status(400).json({ message: 'Invalid role' });

//   try {
//     const user = await Model.findById(id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Ensure array format
//     user.fcmToken = Array.isArray(user.fcmToken) ? user.fcmToken : [];

//     // ✅ Step 1: Add newToken if not exists
//     if (!user.fcmToken.includes(newToken)) {
//       user.fcmToken.push(newToken);
//     }

//     // ✅ Step 2: Validate all tokens
//     const validTokens = [];
//     const removedTokens = [];

//     await Promise.all(
//       user.fcmToken.map(async (token) => {
//         try {
//           await admin.messaging().send({
//             token,
//             data: { type: 'ping' }, // silent test
//             android: { priority: 'high' },
//             apns: { headers: { 'apns-priority': '10' } },
//           });

//           validTokens.push(token);
//         } catch (err) {
//           console.log('Invalid token:', token);
//           removedTokens.push(token);
//         }
//       })
//     );

//     // ✅ Step 3: Save only valid tokens
//     user.fcmToken = validTokens;
//     await user.save();

//     res.status(200).json({
//       message: 'FCM token saved and expired tokens removed',
//       totalTokensStored: validTokens.length,
//       removedTokens,
//       updated: true,
//     });
//   } catch (error) {
//     console.error('Error storing FCM token:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


export const storeFcmToken = async (req, res) => {
  const { fcmToken: newToken } = req.body;
  const { id, role } = req.user || {};


  if (!id || !role || !newToken) {
    return res.status(400).json({ message: 'Missing id, role or token' });
  }

  let Model;
  if (role === 'superAdmin') Model = Superadmin;
  else if (role === 'school') Model = School;
  else if (role === 'branch') Model = Branch;
  else return res.status(400).json({ message: 'Invalid role' });

  try {
    const user = await Model.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fcmToken = Array.isArray(user.fcmToken) ? user.fcmToken : [];

    const validTokens = [];
    const removedTokens = [];

    // Step 1: Validate all existing tokens
    await Promise.all(
      user.fcmToken.map(async (token) => {
        try {
          await admin.messaging().send({
            token,
            data: { ping: '1' },
            android: { priority: 'high' },
            apns: {
              headers: {
                'apns-priority': '10',
                'apns-push-type': 'background',
              },
              payload: { aps: { 'content-available': 1 } },
            },
          });
          validTokens.push(token);
        } catch (err) {
          const code = err?.errorInfo?.code || err?.code;
          const message = err?.errorInfo?.message || err?.message;

          if (
            code === 'messaging/registration-token-not-registered' ||
            message?.includes('not registered')
          ) {
            removedTokens.push(token);
          } else {
            validTokens.push(token);
          }
        }
      })
    );

    // Step 2: Validate the new token before adding
    let newTokenValid = false;
    try {
      await admin.messaging().send({
        token: newToken,
        data: { ping: '1' },
        android: { priority: 'high' },
        apns: {
          headers: {
            'apns-priority': '10',
            'apns-push-type': 'background',
          },
          payload: { aps: { 'content-available': 1 } },
        },
      });
      newTokenValid = true;
    } catch (err) {
      const code = err?.errorInfo?.code || err?.code;
      const message = err?.errorInfo?.message || err?.message;
    }

    if (newTokenValid && !validTokens.includes(newToken)) {
      validTokens.push(newToken);
    }

    user.fcmToken = validTokens;
    await user.save();

    res.status(200).json({
      message: newTokenValid
        ? 'Token stored. Invalid tokens removed if any.'
        : 'New token is invalid. Existing tokens cleaned.',
      totalTokensStored: validTokens.length,
      removedTokens,
      updated: true,
      newTokenStored: newTokenValid,
    });
  } catch (error) {
    console.error('Error storing FCM token:', error);
    res.status(500).json({ message: 'Server error' });
  }
};








