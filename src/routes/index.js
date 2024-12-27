"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// ROUTER INDEX:

// URL: /
//!
/*------------------------------------------- */
// auth:
router.use("/auth", require("./auth"));
// user:
router.use("/user", require("./user"));
// token:
router.use("/token", require("./token"));

// resarvation:
router.use("/resarvation", require("./resarvation"));
// room:
router.use("/room", require("./room"));

// document:
router.use("/document", require("./document"));

/* ------------------------------------------------------- */
module.exports = router;
