import mongoose from 'mongoose';
import { dbConnections } from "../Database/db.js";  


const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  deviceObjId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
    },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default dbConnections.db2.model('Route', routeSchema);
