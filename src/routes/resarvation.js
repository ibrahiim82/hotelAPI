"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/resarvation:

const resarvation = require('../controllers/resarvation')

// URL: /resarvation

const {isAdmin, isLogin} = require("../middlewares/permissions")

// URL: /room
router.route("/").get(isLogin,resarvation.list).post(isAdmin,resarvation.create)

router.route("/:id")
.get(isLogin, resarvation.read)
.put(isAdmin, resarvation.update)
.patch(isAdmin, resarvation.update)
.delete(isAdmin, resarvation.delete)

/* ------------------------------------------------------- */
module.exports = router