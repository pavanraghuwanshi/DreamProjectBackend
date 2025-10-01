import mongoose from 'mongoose';
import { dbConnections } from '../Database/db.js';
const report_distanceSchema = new mongoose.Schema(
    {
        deviceId: { type: Number, required: true },
        distance: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now, required: true }
    },
    { versionKey: false }
);


export default dbConnections.db2.model("Report_distance", report_distanceSchema);
