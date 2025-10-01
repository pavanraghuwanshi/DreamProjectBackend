import mongoose from 'mongoose';
import { dbConnections } from "../Database/db.js";

const attendanceSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Parent",
      required: true,    
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    pickupDropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PickupDrop",
      required: false,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now, 
    },
    present: {
      type: Boolean,
      default: false, 
    },
    absent: {
      type: Boolean,
      default: false,
    },
    leaveRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveRequest", 
      required: false,
    },
    reason: {
      type: String,
      trim: true,
      required: false, 
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ childId: 1, date: 1 }, { unique: true });

export const Attendance = dbConnections.db2.model("Attendance", attendanceSchema);