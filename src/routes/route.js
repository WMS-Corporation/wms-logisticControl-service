const express = require('express');
const {generateStorage, getAll, getStorageByCode, updateStorageByCode, deleteStorageByCode} = require("../services/storageService");
const {verifyToken} = require("./authMiddleware");
const {generateZone} = require("../services/zoneService");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('OK');
})
router.post('/storage/generation', verifyToken, generateStorage)
router.get("/storage/all", verifyToken, getAll)
router.get('/storage/:codStorage', verifyToken, getStorageByCode)
router.put('/storage/:codStorage', verifyToken, updateStorageByCode)
router.delete("/storage/:codStorage", verifyToken, deleteStorageByCode)

router.post('/storage/:codStorage/zone', verifyToken, generateZone)
module.exports = router