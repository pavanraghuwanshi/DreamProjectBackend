import mongoose from 'mongoose';
import { dbConnections } from "../Database/db.js";

const leaveRequestSchema = new mongoose.Schema(
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
    startDate: {
      type: Date,
      required: true, 
    },
    endDate: {
      type: Date,
      required: true, 
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "End date must be greater than or equal to start date",
      },
    },
    reason: {
      type: String,
      required: true,
      trim: true, 
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied", "cancelled"], 
      default: "pending",
    }
  },
  {
    timestamps: true,
  }
);

export const LeaveRequest = dbConnections.db2.model("LeaveRequest", leaveRequestSchema);