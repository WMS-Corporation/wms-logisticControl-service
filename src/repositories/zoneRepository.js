const {collections} = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");

/**
 * Creates a new zone.
 *
 * This function inserts a new zone into the database.
 *
 * @param {Object} zone - The zone object to create.
 * @returns {Object} The result of the zone creation operation.
 * @throws {Error} If failed to create zone.
 */
const createZone = asyncHandler(async (zone) => {
    return await collections?.zones?.insertOne(zone)
});

/**
 * Retrieves all zones about specific storage.
 *
 * This function handles the retrieval of all zones, about specific storage, from the database.
 *
 * @returns {Array|null} An array containing zone data if retrieval is successful, otherwise null.
 */
const getZonesByStorageCode = asyncHandler(async (codStorage) => {
    let storage = await collections?.storage?.findOne({_codStorage:codStorage})
    return storage._zoneCodeList
})

/**
 * Finds a zone by code.
 *
 * This function queries the database to find a zone based on the provided code.
 *
 * @param {string} codZone - The code of the zone to find.
 * @returns {Object|null} The zone object if found, or null if not found.
 */
const findZoneByCode = asyncHandler(async (codZone) => {
    return await collections?.zones?.findOne({ _codZone: codZone })
});

module.exports = {
    createZone,
    getZonesByStorageCode,
    findZoneByCode
}