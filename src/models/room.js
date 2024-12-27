"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */
// Room Model:

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type:Number,
      required:true,
      unique:true
      
    },
    image: {
      type:Array,
      default:[]      
    },
    bedType: {
      type:Number,
      required:true,
      unique:true
      
    },
    price: {
      type:Number,
      required:true,
      unique:true
    },
    available:{
      type:Boolean,
      default:false,

    }
  },
  {
    collection: "rooms",
    timestamps: true,
  }
);

// Model:
module.exports = mongoose.model("Room", RoomSchema);
