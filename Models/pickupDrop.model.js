import mongoose from "mongoose";
import { dbConnections } from "../Database/db.js";

const pickupDropSchema = new mongoose.Schema(
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
    pickup: {
        type: Boolean,
        default: false,
    },
    drop: {
        type: Boolean,
        default: false,
      },
    pickupTime: {
        type: Date,
        required: false,
    },
    dropTime: {
        type: Date,
        required: false,
    },
  createdAt: { type: Date, default: () => new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000))}
  }
 
);

 const PickupDrop = dbConnections.db2.model(
  "PickupDrop",
  pickupDropSchema
);
export default PickupDrop
