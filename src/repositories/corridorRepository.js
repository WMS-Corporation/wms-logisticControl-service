const {collections} = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");

/**
 * Creates a new corridor.
 *
 * This function inserts a new corridor into the database.
 *
 * @param {Object} corridor - The corridor object to create.
 * @returns {Object} The result of the corridor creation operation.
 * @throws {Error} If failed to create corridor.
 */
const createCorridor = asyncHandler(async (corridor) => {
    return await collections?.corridors?.insertOne(corridor)
});

/**
 * Retrieves all corridors about specific zone.
 *
 * This function handles the retrieval of all corridors, about specific zone, from the database.
 *
 * @returns {Array|null} An array containing corridor data if retrieval is successful, otherwise null.
 */
const getCorridorsByZoneCode = asyncHandler(async (codZone) => {
    let zone = await collections?.zones?.findOne({_codZone:codZone})
    return zone._corridorCodeList
})

module.exports = {
    createCorridor,
    getCorridorsByZoneCode
}