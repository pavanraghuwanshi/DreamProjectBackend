import mongoose from 'mongoose';
import { dbConnections } from '../Database/db.js';
const report_idleSchema = new mongoose.Schema(
    {
        deviceId: { type: Number, required: true },
        latitude: { type: Number },
        longitude: { type: Number },
        speed: { type: Number },
        idleStartTime: { type: Date },
        idleEndTime: { type: Date },
        duration: { type: String }
    },
    { versionKey: false }
);

export default dbConnections.db2.model("Report_idle", report_idleSchema);