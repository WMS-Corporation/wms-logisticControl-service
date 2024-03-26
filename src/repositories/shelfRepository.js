const {collections} = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");

/**
 * Creates a new shelf.
 *
 * This function inserts a new shelf into the database.
 *
 * @param {Object} shelf - The shelf object to create.
 * @returns {Object} The result of the shelf creation operation.
 * @throws {Error} If failed to create shelf.
 */
const createShelf = asyncHandler(async (shelf) => {
    return await collections?.shelfs?.insertOne(shelf)
});

/**
 * Retrieves all shelfs about specific corridor.
 *
 * This function handles the retrieval of all shelfs, about specific corridor, from the database.
 *
 * @returns {Array|null} An array containing shelf data if retrieval is successful, otherwise null.
 */
const getShelfsByCorridorCode = asyncHandler(async (codCorridor) => {
    let corridor = await collections?.corridors?.findOne({_codCorridor:codCorridor})
    return corridor._shelfCodeList
})

module.exports = {
    createShelf,
    getShelfsByCorridorCode
}