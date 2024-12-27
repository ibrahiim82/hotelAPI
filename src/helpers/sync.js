"use strict";

const mongoose = require("mongoose");
const User = require("../models/user");

/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// sync():

module.exports = async function () {
  // return null;
  /* CLEAR DATABASE */

  //! await mongoose.connection.dropDatabase();
  await User.deleteMany();
  console.log("- Database and all data DELETED!");
  /* CLEAR DATABASE */
  try {
    const users = require("./user.json");

    await User.insertMany(users);
    console.log("users added");
  } catch (error) {
    console.log("user couldn't add");
    console.log(error);
  }
  
};
