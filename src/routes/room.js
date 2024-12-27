"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const router = require("express").Router();
/* ------------------------------------------------------- */
// routes/room:

//* UPLOADING * MULTER
// $ npm i multer
// https://expressjs.com/en/resources/middleware/multer.html

const multer = require('multer')
//  dosya yüklemek için yardımcı middleware
const upload = multer({
  // dest:"./upload",
  storage: multer.diskStorage({
    destination:"./upload",
    filename: function (req, file, returnCallback){
      returnCallback(null, Date.now() + "_" + file.originalname)
    }
  })
})

const room = require("../controllers/room");

const { isAdmin, isLogin } = require("../middlewares/permissions");

// URL: /room
router.route("/")
    .get(isLogin,room.list)
    // .post(upload.single('FieldName'), room.create);
    // .post(upload.single('image'), room.create);
    .post(isAdmin,upload.array('image'), room.create) // en çok kullanılacak yöntem;
    // .post(upload.any(''), room.create); // fieldname önemsiz

router
  .route("/:id")
  .get(isLogin, room.read)
  .put(isAdmin, room.update)
  .patch(isAdmin, room.update)
  .delete(isAdmin, room.delete);

/* ------------------------------------------------------- */
module.exports = router;