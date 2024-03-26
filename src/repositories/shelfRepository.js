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

module.exports = {
    createShelf
}