const express = require('express');
const router = express.Router()
const { login , decodeToken , userRegister ,userUpdate} = require('../controller/auth');

router.post("/login", login);
router.post("/decodeToken", decodeToken);
router.post("/registerUser", userRegister);
router.post("/updateUser", userUpdate);

module.exports = router