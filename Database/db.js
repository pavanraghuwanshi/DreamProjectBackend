import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 50, 
      minPoolSize: 10,
      // serverSelectionTimeoutMS: 10000,
      // socketTimeoutMS: 45000,   
      // connectTimeoutMS: 10000, 
      // autoIndex: false,  
      // retryWrites: true,  
      // w: "majority",  
      // readPreference: "primary",
      // tls: process.env.MONGO_TLS === "true",
      // tlsCAFile: process.env.MONGO_CA_FILE,
      // authSource: process.env.MONGO_AUTH_DB || "admin",
      // auth: {
      //   username: process.env.MONGO_USER,
      //   password: process.env.MONGO_PASS,
      // },
    });

    console.log("✅ MongoDB connected successfully (Production-ready)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// export default connectDB;
