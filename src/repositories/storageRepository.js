const {collections} = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");

/**
 * Creates a new storage.
 *
 * This function inserts a new storage into the database.
 *
 * @param {Object} storage - The storage object to create.
 * @returns {Object} The result of the storage creation operation.
 * @throws {Error} If failed to create storage.
 */
const createStorage = asyncHandler(async (storage) => {
    return await collections?.storage?.insertOne(storage)
});

/**
 * Generates a unique storage code.
 *
 * This function generates a unique storage code by retrieving the next available code from the counter collection,
 * incrementing the count, and returning the next code as a string padded with zeros to ensure a fixed length of 6 characters.
 *
 * @returns {string} The next unique storage code.
 */
const generateUniqueStorageCode = asyncHandler (async () => {
    const nextCode = await collections?.counter?.findOne()
    await collections.counter.updateOne({}, { $inc: {count: 1}})
    return nextCode.count.toString().padStart(6, '0')
})

module.exports = {
    createStorage,
    generateUniqueStorageCode
}