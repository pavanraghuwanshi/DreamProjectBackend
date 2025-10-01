import mongoose from 'mongoose';

import { dbConnections } from '../Database/db.js';

const report_tripSchema = new mongoose.Schema(
    {
        deviceId: {
            type: Number,
        },
        name: {
            type: String,
            default: '',
        },
        startTime: {
            type: Date,

        },
        endTime: {
            type: Date,

        },
        duration: {
            type: String,
        },
        maxSpeed: {
            type: Number,
            default: 0,
        },
        avgSpeed: {
            type: Number,
            default: 0,
        },
        distance: {
            type: String,
        },
        totalDistance: {
            type: String,
        },
        startLongitude: {
            type: Number,
        },
        startLatitude: {
            type: Number,
        },
        endLongitude: {
            type: Number,
        },
        endLatitude: {
            type: Number,
        },
    },
    {
        versionKey: false
    }
);

export default dbConnections.db2.model("Report_trip", report_tripSchema);
