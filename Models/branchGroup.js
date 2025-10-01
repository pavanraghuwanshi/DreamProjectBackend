import mongoose from 'mongoose';
import  {dbConnections}  from "../Database/db.js"; 

const branchSchema = new mongoose.Schema({
  branchGroupName: {
    type: String,
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  AssignedBranch:[{
     type:mongoose.Schema.Types.ObjectId,
     ref:'Branch'
  }],
 mobileNo:{
    type: String,
   default: ''
  },
  username: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true
  },
  password:{
    type: String,
    default: ''
  },
  email:{
    type: String,
    default: ''
  },
  role: {
    type: String,  default: 'branchGroup'
  },
  fcmToken: [{ type: String, default: null }],
});


export default dbConnections.db2.model('BranchGroup', branchSchema);
