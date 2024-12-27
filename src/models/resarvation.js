"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- */
// Resarvation Model:

const ResarvationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room"
    },
    arrivalDate: {
      type: Date,
      required: true,
      unique: true
    },
    departureDate: {
      type: Date,
      required: true,
      unique: true
    },
    guestNumber: {
      type: Number,
      required: true,
      unique: true,
      default: 1
    },
    night: {
      type: Number,
      required: true,
      unique: true,
      default: function(){
        //! Create
        return (this.departureDate - this.arrivalDate) / (1000 * 3600 * 24)
      },
      transform: function(){
        //! Update
        return (this.departureDate - this.arrivalDate) / (1000 * 3600 * 24)
      }
    },
    price: {
      type: Number,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      unique: true,
      default: function () {
        //! Create
        return this.price * this.night * this.guestNumber
      },
      transform: function () {
        //! Update
        return this.price * this.night * this.guestNumber
      }
    },
   
  },

  {
    collection: "resarvations",
    timestamps: true,
  }
);

// Model:
module.exports = mongoose.model("Resarvation", ResarvationSchema);
