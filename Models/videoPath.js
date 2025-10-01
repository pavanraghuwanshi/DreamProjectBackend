import mongoose from "mongoose";
import  {dbConnections}  from "../Database/db.js"; 

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true, // stored 360p path
    },
  },
  { timestamps: true }
);


export default dbConnections.db2.model("Video", videoSchema);