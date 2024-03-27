const express = require('express');
const { createQuestion , getQuestion , updateQuestion , deleteQuestion} = require('../controller/question');
const router = express.Router()

router.post("/createQuestion", createQuestion);
router.post("/updateQuestion", updateQuestion);
router.delete("/delete_question/:id", deleteQuestion);
router.get("/getQuestion", getQuestion);

module.exports = router