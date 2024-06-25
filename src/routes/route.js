const express = require('express');
const {generateStorage, getAll, getStorageByCode, updateStorageByCode, deleteStorageByCode} = require("../services/storageService");
const {verifyToken} = require("./authMiddleware");
const {generateZone, getAllZones, getZoneByCode, updateZoneByCode, deleteZoneByCode} = require("../services/zoneService");
const {generateCorridor, getAllCorridors, getCorridorByCode, updateCorridorByCode, deleteCorridorByCode} = require("../services/corridorService");
const {generateShelf, getAllShelfs, getShelfByCode, updateShelfByCode, deleteShelfByCode, productTransfer,
    addProductToShelf, updateProductInShelf
} = require("../services/shelfService");
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
router.get("/storage/:codStorage/zone", verifyToken, getAllZones)
router.get('/zone/:codZone', verifyToken, getZoneByCode)
router.put('/zone/:codZone', verifyToken, updateZoneByCode)
router.delete("/zone/:codZone", verifyToken, deleteZoneByCode)

router.post('/zone/:codZone/corridor', verifyToken, generateCorridor)
router.get("/zone/:codZone/corridor", verifyToken, getAllCorridors)
router.get('/corridor/:codCorridor', verifyToken, getCorridorByCode)
router.put('/corridor/:codCorridor', verifyToken, updateCorridorByCode)
router.delete("/corridor/:codCorridor", verifyToken, deleteCorridorByCode)

router.post('/corridor/:codCorridor/shelf', verifyToken, generateShelf)
router.get("/corridor/:codCorridor/shelf", verifyToken, getAllShelfs)
router.get('/shelf/:codShelf', verifyToken, getShelfByCode)
router.put('/shelf/transfer', verifyToken, productTransfer)
router.put('/shelf/:codShelf', verifyToken, updateShelfByCode)
router.put('/shelf/:codShelf/product', verifyToken, addProductToShelf)
router.put('/shelf/:codShelf/product/:codProduct', verifyToken, updateProductInShelf)
router.delete("/shelf/:codShelf", verifyToken, deleteShelfByCode)

module.exports = router