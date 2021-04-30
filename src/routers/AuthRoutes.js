const express = require("express");
const router = express.Router();

const { AuthControllers } = require("./../controllers");
const {
  verifyTokenAccess,
  verifyEmailforget,
} = require("./../helpers/verifyToken");
// const { changeUser } = require("../connection/mysqldb");

const { Register, login, deactiveAccount, activeAcount } = AuthControllers;

router.post("/register", Register);
router.post("/login", login);
router.patch("/deactive", deactiveAccount);
router.patch("/activate", activeAcount);

module.exports = router;
