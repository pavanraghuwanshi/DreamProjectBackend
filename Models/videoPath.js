import mongoose from "mongoose";


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
  },
  { timestamps: true }
);


export default mongoose.model("Video", videoSchema);