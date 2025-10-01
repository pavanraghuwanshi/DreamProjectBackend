// models/chat.js
import { dbConnections } from "../Database/db.js";
import mongoose from 'mongoose';

// Import your Mongoose models directly
import School from '../Models/school.js';
import Branch from '../Models/branch.js'
import Child from '../Models/child.js';
import Parent from '../Models/parents.js';

const ChatModel = {

  getSchoolById: async (schoolId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        return null;
      }
      return await School.findById(schoolId).lean();
    } catch (error) {
      console.error("Error in getSchoolById:", error);
      return null;
    }
  },

  getSchoolByName: async (schoolName, userRole, userId) => {


   try {
  if (userRole === 'school') {
    // Direct access for school user
    return await School.findOne({
      _id: userId,
      schoolName: { $regex: schoolName, $options: 'i' }
    }).lean();
  } else if (userRole === 'parent') {
    const parent = await Parent.findById(userId)
      .select('schoolId')
      .populate('schoolId', 'schoolName email')
      .lean();
    if (!parent) return null;
    return parent;
  } else if (userRole === 'superadmin') {
    
    if (schoolName && schoolName.trim().toLowerCase() === 'all') {
  return await School.find({}).lean();
}

return await School.findOne({
  schoolName: { $regex: schoolName, $options: 'i' }
}).lean();
  } else {
    // Unsupported role
    return null;
  }
} catch (error) {
  console.error("Error in getSchoolByName:", error);
  return null;
}

  },


  // --- Branch Functions ---
  getBranchById: async (branchId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(branchId)) {
        return null;
      }
      return await Branch.findById(branchId).populate('schoolId').lean(); // Populate school details
    } catch (error) {
      console.error("Error in getBranchById:", error);
      return null;
    }
  },

  getBranchByName: async (branchName) => {
    try {
      return await Branch.findOne({ branchName: { $regex: branchName, $options: 'i' } }).populate('schoolId').lean();
    } catch (error) {
      console.error("Error in getBranchByName:", error);
      return null;
    }
  },
  getBranchBySchoolName: async (schoolName) => {
    try {
      const school = await School.findOne({schoolName:schoolName})
      console.log("sssssssssssss",school)
      return await Branch.find({schoolId:school._id}).lean();
    } catch (error) {
      console.error("Error in getBranchByName:", error);
      return null;
    }
  },

getBranchesWithChildrenBySchoolName: async (schoolName) => {
  try {
    // Find the school by name
    const school = await School.findOne({ schoolName }).lean();
    if (!school || !school._id) {
      return { message: "School not found", branches: [] };
    }

    // Find all branches of this school
    const branches = await Branch.find({ schoolId: school._id }).lean();

    // For each branch, find children
    const branchesWithChildren = await Promise.all(
      branches.map(async (branch) => {
        const children = await Child.find({ branchId: branch._id })
          .select('childName className section gender statusOfRegister')
          .lean();
        return {
          ...branch,
          children,
        };
      })
    );

    return {
      school: {
        _id: school._id,
        schoolName: school.schoolName,
      },
      branches: branchesWithChildren,
    };

  } catch (error) {
    console.error("Error in getBranchesWithChildrenBySchoolName:", error);
    return { message: "Error occurred", branches: [] };
  }
},

  // --- Child Functions ---
  getChildById: async (childId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(childId)) {
        return null;
      }
      return await Child.findById(childId)
        .populate('parentId') // If you need parent details
        .populate('schoolId') // If you need school details
        .populate('branchId') // If you need branch details
        .lean();
    } catch (error) {
      console.error("Error in getChildById:", error);
      return null;
    }
  },

  getChildByName: async (childName, branchId = null, schoolId = null) => {
    try {
      const query = { childName: { $regex: childName, $options: 'i' } };
      if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        query.branchId = branchId;
      }
      if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
        query.schoolId = schoolId;
      }
      return await Child.findOne(query)
        .populate('parentId')
        .populate('schoolId')
        .populate('branchId')
        .lean();
    } catch (error) {
      console.error("Error in getChildByName:", error);
      return null;
    }
  },

  getChildrenByClassAndSection: async (className, section = null, branchId = null, schoolId = null) => {
    try {
      const query = { className: { $regex: className, $options: 'i' } };
      if (section) {
        query.section = { $regex: section, $options: 'i' };
      }
      if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        query.branchId = branchId;
      }
      if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
        query.schoolId = schoolId;
      }
      return await Child.find(query).lean();
    } catch (error) {
      console.error("Error in getChildrenByClassAndSection:", error);
      return [];
    }
  },

  getChildrenByParentId: async (parentId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return [];
      }
      return await Child.find({ parentId: parentId }).lean();
    } catch (error) {
      console.error("Error in getChildrenByParentId:", error);
      return [];
    }
  },

  getChildrenByRegistrationStatus: async (status, branchId = null, schoolId = null) => {
    try {
      const query = { statusOfRegister: status };
      if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
        query.branchId = branchId;
      }
      if (schoolId && mongoose.Types.ObjectId.isValid(schoolId)) {
        query.schoolId = schoolId;
      }
      return await Child.find(query).lean();
    } catch (error) {
      console.error("Error in getChildrenByRegistrationStatus:", error);
      return [];
    }
  },

  // Add more specific functions as needed, e.g.,
  // getChildByDOB, getChildByGender, etc.


  //my ones created by me

getAllSchools: async (userRole, userId) => {
  return await School.find({}).select('schoolName').lean();
},
getBranchesBySchoolnameall: async (userRole, userId,school_name) => {
  try {
    // 📌 If role is "school", fetch only that school and its branches
    if (userRole === 'school') {
      const school = await School.findById(userId).select('schoolName').lean();
      if (!school) return [];

      const branches = await Branch.find({ schoolId: school._id }).select('branchName').lean();

      return [{
        schoolName: school.schoolName,
        branches: branches.map(b => b.branchName)
      }];
    }

    // 📌 If role is "branch", return only that branch and its school
    if (userRole === 'branch') {
      const branch = await Branch.findById(userId)
        .select('branchName schoolId')
        .populate('schoolId', 'schoolName')
        .lean();

      if (!branch || !branch.schoolId) return [];

      return [{
        schoolName: branch.schoolId.schoolName,
        branches: [branch.branchName]
      }];
    }


    // 📌 If role is "parent", fetch parent’s school and all its branches
    if (userRole === 'parent') {
      const parent = await Parent.findById(userId).select('schoolId').lean();
      if (!parent || !parent.schoolId) return [];

      const school = await School.findById(parent.schoolId).select('schoolName').lean();
      if (!school) return [];

      const branches = await Branch.find({ schoolId: parent.schoolId }).select('branchName').lean();

      return [{
        schoolName: school.schoolName,
        branches: branches.map(b => b.branchName)
      }];
    }

    // 📌 Default: Admin or others – return all schools with branches
    const allSchools = await School.find({}).select('schoolName').lean();

    const result = [];
    for (const school of allSchools) {
      const branches = await Branch.find({ schoolId: school._id }).select('branchName').lean();
      result.push({
        schoolName: school.schoolName,
        branches: branches.map(b => b.branchName)
      });
    }

    return result;

  } catch (err) {
    console.error("❌ Error in getBranchesBySchoolnameall:", err);
    return [];
  }
},

getChildrenBySchoolName: async (school_name) => {
    try {
const school = await School.findOne({ schoolName: school_name });
     return await Child.find({ schoolId: school._id })
        .select('childName className section gender statusOfRegister schoolId branchId')
        .populate('schoolId', 'schoolName')
        .populate('branchId', 'branchName')
        .lean();

    } catch (error) {
      console.error("Error in getChildrenBySchoolId:", error);
      return null;
    }
  },
getChildrenByBranchName: async (branch_name) => {
    try {
const branch = await Branch.findOne({ branchName: branch_name });
     return await Child.find({ branchId: branch._id })
        .select('childName className section gender statusOfRegister schoolId branchId')
        .populate('schoolId', 'schoolName')
        .populate('branchId', 'branchName')
        .lean();

    } catch (error) {
      console.error("Error in getChildrenBySchoolId:", error);
      return null;
    }
  },



};

export default ChatModel;