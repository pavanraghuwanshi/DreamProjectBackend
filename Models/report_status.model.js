import mongoose from 'mongoose';
import { dbConnections } from '../Database/db.js';
const report_statusSchema = new mongoose.Schema(
    {
        deviceId: { type: Number, required: true },
        vehicleStatus: { type: String },
        time: { type: String },
        distance: { type: Number },
        maxSpeed: { type: Number },
        startLocation: { type: String },
        endLocation: { type: String },
        startDateTime: { type: Date },
        endDateTime: { type: Date }
    },
    { versionKey: false }
);

export default dbConnections.db2.model("Report_status", report_statusSchema);