import mongoose from 'mongoose';
import { dbConnections } from '../Database/db.js';
const report_stopageSchema = new mongoose.Schema(
    {
        deviceId: { type: Number, required: true },
        speed: { type: Number },
        course: { type: Number },
        latitude: { type: Number },
        longitude: { type: Number },
        arrivalTime: { type: Date },
        departureTime: { type: Date },
    },
    { versionKey: false }
);

report_stopageSchema
export default dbConnections.db2.model("Report_stopage", report_stopageSchema);
