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

/**
 * Retrieves all shelf.
 *
 * This function handles the retrieval of all shelf from the database.
 *
 * @returns {Array|null} An array containing corridor data if retrieval is successful, otherwise null.
 */
const getShelf = asyncHandler(async () => {
    return await collections?.shelfs?.find().toArray()
})

/**
 * Finds a shelf by code.
 *
 * This function queries the database to find a shelf based on the provided code.
 *
 * @param {string} shelfCode - The code of the shelf to find.
 * @returns {Object|null} The shelf object if found, or null if not found.
 */
const findShelfByCode = asyncHandler(async (shelfCode) => {
    return await collections?.shelfs?.findOne({ _codShelf: shelfCode })
});

module.exports = {
    createShelf,
    getShelfsByCorridorCode,
    getShelf,
    findShelfByCode
}