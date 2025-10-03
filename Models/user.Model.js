import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
      trim : true,
      unique: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "advisor", "admin"],
      default: "user",
    },
    latitude: {
      type: Number,
      default: null,
  },
    longitude: {
      type: Number,
      default: null,
  },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
