const express = require('express');
const {generateStorage, getAll} = require("../services/storageService");
const {verifyToken} = require("./authMiddleware");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('OK');
})
router.post('/generation', verifyToken, generateStorage)
router.get("/all", verifyToken, getAll)
module.exports = router