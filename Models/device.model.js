import mongoose from 'mongoose';
import  {dbConnections}  from "../Database/db.js"; 

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true
  },
  sim: {
    type: String,
    default: ""
  },
  speed: {
    type: String,
    default: ""
  },
  average: {
    type: String,
    default: ""
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    default: null,
    set: v => v === "" ? null : v,
  },

  model: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: ""
  },
  deviceId: {
    type: String,
    // required: true, 
    // unique: true
  },
  routeNo:{
    type: String,
  },
  status: {
    type: String,
    // required: true, 
  },
  lastUpdate: {
    type: String,
    // required: true, 
  },
  positionId: {
    type: String,
    // required: true, 
  },
  status: {
    type: String,
    // required: true, 
  },
  parkingMode: {
    type: Boolean,
    default: false
  },
  toeingMode: {
    type: Boolean,
    default: false
  },
  keyFeature: {
    type: Boolean,
    default: true
  },
  TD: {
    type: Number,
    default: 0 
  },
  TDTime: {
    type: Date,
    default: Date.now() 
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"School"
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Branch"
   
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Supervisor"
  },

}, {
  timestamps: true
}
);

const Device = dbConnections.db2.model('Device', deviceSchema);
export { Device };
