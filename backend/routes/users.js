const express = require("express");
const { signUp, login, logout } = require("../controllers/userController.js");

const router = express.Router();

router.post("/auth/register", signUp);
router.post("/auth/login", login);
router.post("/logout", logout);

module.exports = router;
