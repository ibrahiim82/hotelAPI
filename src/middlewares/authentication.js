"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */

const Token = require("../models/token");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null; // Token ...Tokenkey... || Bearer ...AccessToken...
  const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...TokenKey...] || ['Bearer', '...AccessToken...]

  if (tokenKey) {
    if (tokenKey[0] == "Token") {
      // SIMPLE TOKEN:
      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
        "userId"
      );
      // console.log(tokenData);
      if (tokenData) req.user = tokenData.userId;
    }
  }

  // console.log("---------", req.user);
  next();
};
