const express = require('express');
const {generateStorage, getAll, getStorageByCode, updateStorageByCode} = require("../services/storageService");
const {verifyToken} = require("./authMiddleware");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('OK');
})
router.post('/generation', verifyToken, generateStorage)
router.get("/all", verifyToken, getAll)
router.get('/:codStorage', verifyToken, getStorageByCode)
router.put('/:codStorage', verifyToken, updateStorageByCode)
module.exports = router