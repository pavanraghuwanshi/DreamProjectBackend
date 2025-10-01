import mongoose from 'mongoose';
import  {dbConnections}  from "../Database/db.js"; 

const geofenceSchema = new mongoose.Schema({
  geofenceName: {
    type: String,
    required: true,
    trim: true,
  },
  area: {
    center: {
      type: [Number],
      required: true,
    },
    radius: {
      type: Number,
      required: true,
      min: [0, "Radius must be a positive number"],
    },
  },
   pickupTime:{
  type: String,
  validate: {
    validator: function (v) {
     
      return /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(v);
    },
    message: props => `${props.value} is not a valid time in hh:mm AM/PM format!`
  }
},
dropTime:{
  type: String,
  validate: {
    validator: function (v) {
     
      return /^(0[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(v);
    },
    message: props => `${props.value} is not a valid time in hh:mm AM/PM format!`
  }
},
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Parent",
  },
  routeObjId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
  createdAt: { type: Date, default: () => new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000))},

},);
export const Geofence = dbConnections.db2.model("Geofence", geofenceSchema);

