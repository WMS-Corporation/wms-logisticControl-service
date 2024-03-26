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

module.exports = {
    createCorridor
}