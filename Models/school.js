import mongoose from 'mongoose';
// const { encrypt, decrypt } = require('./cryptoUtils'); 
import  {dbConnections}  from "../Database/db.js"; 

// Define the schema for the School model
const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  mobileNo:{
    type: String
  },
  fullAccess: {
    type:Boolean,
    default:false
  },
  role: {
    type: String,
    default: "school"
  },
  fcmToken:[{type: String, default: null}],
  createdAt: { type: Date, default: () => new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000))}

},); 


export default dbConnections.db2.model("School", schoolSchema);