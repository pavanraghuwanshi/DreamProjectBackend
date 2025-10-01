// import jwt from "jsonwebtoken";
// import Superadmin from "../Models/superAdmin.js";
// import School from "../Models/school.js";
// import Branch from "../Models/branch.js";
// import BranchGroup from "../Models/branchGroup.js";
// import Supervisor from "../Models/supervisor.js";
// import mongoose from "mongoose";
// import Parents from "../Models/parents.js";
// import Driver from "../Models/driver.js";
// import superAdmin from "../Models/superAdmin.js";
// import parents from "../Models/parents.js";
// import BusRouteNo from "../Models/BusRouteNo.js";
// import Child from "../Models/child.js";
// import { Device } from "../Models/device.model.js";


// export const authenticateUser = async (req, res, next) => {
//   try {
//     const authorization = req.headers["authorization"];
//     if (!authorization) {
//       return res
//         .status(401)
//         .json({ message: "Access denied. No token provided." });
//     }

//     const token = authorization.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized. Token missing." });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded || !decoded.id) {
//       return res.status(400).json({ message: "Invalid token." });
//     }

//     const ObjectId = mongoose.Types.ObjectId;
//     const userId = new ObjectId(decoded.id);

//     const roleModels = [
//       { model: Superadmin, role: "superadmin" },
//       { model: School, role: "school" },
//       { model: BranchGroup, role: "branchGroup" },
//       { model: Branch, role: "branch" },
//       { model: Parents, role: "parent" },
//       { model: Driver, role: "driver" },
//       { model: Supervisor, role: "supervisor" },
//     ];

//     for (const { model, role } of roleModels) {
//       const user = await model.findById(userId);
//       if (user) {
//         req.user = user;
//         req.userType = role;
//         return next();
//       }
//     }

//     return res.status(404).json({ message: "User not found." });
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return res.status(400).json({ message: "Invalid token." });
//     } else if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token expired." });
//     }
//     return res
//       .status(500)
//       .json({ message: "Internal server error." + error.message });
//   }
// };

// export default authenticateUser;

