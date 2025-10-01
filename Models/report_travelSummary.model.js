import mongoose from 'mongoose';
import { dbConnections } from '../Database/db.js';

const report_travelsummarySchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        deviceId: {
            type: Number,
            required: true,
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
        distance: {
            type: String,
            required: true,
        },
        startLatitude: {
            type: Number,
            required: true,
        },
        startLongitude: {
            type: Number,
            required: true,
        },
        endLatitude: {
            type: Number,
            required: true,
        },
        endLongitude: {
            type: Number,
            required: true,
        },
        maxSpeed: {
            type: Number,
            required: true,
        },
        avgSpeed: {
            type: Number,
            required: true,
        },
        workingHours: {
            type: String,
            required: true,
        },
        runningTime: {
            type: String,
            required: true,
        },
        stopTime: {
            type: String,
            required: true,
        },
        idleTime: {
            type: String,
            required: true,
        }
    },
    { versionKey: false }
);

export default dbConnections.db2.model("Report_travelsummary", report_travelsummarySchema);

