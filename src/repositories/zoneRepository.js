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

module.exports = {
    createZone
}