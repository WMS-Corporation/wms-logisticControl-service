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
 * Retrieves all storages.
 *
 * This function handles the retrieval of all storages from the database.
 *
 * @returns {Array|null} An array containing storage data if retrieval is successful, otherwise null.
 */
const getStorages = asyncHandler(async () => {
    return await collections?.storage?.find().toArray()
})

/**
 * Finds a storage by code.
 *
 * This function queries the database to find a storage based on the provided code.
 *
 * @param {string} codStorage - The code of the storage to find.
 * @returns {Object|null} The storage object if found, or null if not found.
 */
const findStorageByCode = asyncHandler(async (codStorage) => {
    return await collections?.storage?.findOne({ _codStorage: codStorage })
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

/**
 * Updates storage data based on a filter.
 *
 * This function updates storage data based on the provided filter criteria and the update object.
 *
 * @param {Object} filter - The filter criteria to find the storage(s) to update.
 * @param {Object} update - The update object containing the fields to update and their new values.
 * @returns {Object|null} The updated storage data if the storage is found, otherwise null.
 */
const updateStorageData = asyncHandler(async(filter, update) => {
    const options = { returnOriginal: false}
    await collections?.storage?.findOneAndUpdate(filter, update, options)
    return await collections?.storage?.findOne(filter)
})

module.exports = {
    createStorage,
    generateUniqueStorageCode,
    getStorages,
    findStorageByCode,
    updateStorageData
}