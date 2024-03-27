const express = require('express');
const { getUser , getCase, deleteUser , getPatientCase , getCurrentUserInfo} = require('../controller/patient');
const router = express.Router()

router.get("/getUser", getUser);
router.get("/getCase", getCase);
router.delete("/delete_acc/:id", deleteUser);
router.post("/getPatientCase", getPatientCase);
router.post("/getCurrentUserInfo", getCurrentUserInfo);

module.exports = router