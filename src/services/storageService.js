const asyncHandler = require("express-async-handler");
const {createStorageFromData} = require("../factories/storageFactory");
const {generateUniqueStorageCode, createStorage, getStorages} = require("../repositories/storageRepository");

/**
 * Generate a new storage.
 *
 * This function handles the generation of a storage based on the data provided in the request body.
 * It validates the storage data and generates a unique storage code before inserting the storage into the database.
 * If the storage is successfully inserted, it returns a success message along with the assigned storage details.
 * If the storage data is invalid or insertion fails, it returns an error message.
 *
 * @param {Object} req - The request object containing the storage data in the body.
 * @param {Object} res - The response object used to send the result of the assignment process.
 * @returns {Object} The HTTP response with the storage created.
 */
const generateStorage = asyncHandler(async(req, res) => {
    const storage = createStorageFromData(req.body)
    if(!storage.zoneCodeList){
        return res.status(401).json({ message: 'Invalid storage data' })
    }

    storage.codStorage = await generateUniqueStorageCode()
    const resultInsert = await createStorage(storage)
    if(resultInsert){
        res.status(200).json({ message: 'Storage generation successful', order: storage})
    }else{
        return res.status(401).json({ message: 'Invalid storage data' })
    }
})

/**
 * Retrieves all storages.
 *
 * This function handles the retrieval of all storages from the database.
 * It calls the getStorages function to fetch the storage data.
 * If the retrieval is successful, it returns the storage data with HTTP status code 200 (OK).
 * If the retrieval fails (e.g., invalid storage data), it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the storage data or an error message in JSON format.
 */
const getAll = asyncHandler(async(req, res) => {
    const result = await getStorages()
    if(result){
        res.status(200).json(result)
    } else {
        res.status(401).json({message: 'Invalid storage data'})
    }
})

module.exports = {
    generateStorage,
    getAll
}