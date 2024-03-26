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

/**
 * Updates zone data based on a filter.
 *
 * This function updates zone data based on the provided filter criteria and the update object.
 *
 * @param {Object} filter - The filter criteria to find the zone(s) to update.
 * @param {Object} update - The update object containing the fields to update and their new values.
 * @returns {Object|null} The updated zone data if the zone is found, otherwise null.
 */
const updateZoneData = asyncHandler(async(filter, update) => {
    const options = { returnOriginal: false}
    await collections?.zones?.findOneAndUpdate(filter, update, options)
    return await collections?.zones?.findOne(filter)
})

module.exports = {
    createZone,
    getZonesByStorageCode,
    findZoneByCode,
    updateZoneData
}