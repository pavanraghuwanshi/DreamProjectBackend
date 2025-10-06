import mongoose from "mongoose";
import { type } from "os";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
    },
    // ✅ Add GeoJSON location field
    location: {
      type: {
        type: String,
        enum: ["Point"], // Must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    userId:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

videoSchema.index({ location: "2dsphere" });

export default mongoose.model("Video", videoSchema);
