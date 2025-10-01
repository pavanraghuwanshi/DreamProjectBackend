import mongoose from 'mongoose';
import { dbConnections } from "../Database/db.js";



function normalizeTime(value) {
  if (!value) return value;
  // Match time and AM/PM parts
  const match = value.match(/^(\d{2}:\d{2})\s*(AM|PM|am|pm)$/i);
  if (!match) return value; // leave validation to Mongoose validator
  const timePart = match[1];
  const ampmPart = match[2].toUpperCase();
  return `${timePart} ${ampmPart}`;
}

const timeValidator = {
  validator: function(v) {
    return /^([0][1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(v);
  },
  message: props => `${props.value} is not a valid time in hh:mm AM/PM format!`
};








const childSchema = new mongoose.Schema({
  childName: {
    type: String,
    required: true,
    trim: true
  },
  className: {
    type: String,
    trim: true
  },
  rollNumber: {
    type: String,
    trim: true,
    unique: true,
  },
  section:{
    type: String,
    trim: true
  },
  DOB:{
    type: Date,
    default: null
  },
  age:{
    type: Number,
    default: null
  },
  gender:{
    type: String,
    enum: ['male','female'],
  },
  pickupGeoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence',
    default: null
  },
  dropGeoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence',
    default: null
  },
pickupTime: {
  type: String,
  set: normalizeTime,
  validate: timeValidator
},

dropTime: {
  type: String,
  set: normalizeTime,
  validate: timeValidator
},
routeObjId: {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  statusOfRegister: {
    type: String,
    enum: ['registered', 'pending', 'rejected'],
    default: 'pending'
  },
 
  role: {
    type: String,
    default: 'child'
  },
  createdAt: { type: Date, default: () => new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000))},

},{
  versionKey: false
});


export default dbConnections.db2.model('Child', childSchema);
