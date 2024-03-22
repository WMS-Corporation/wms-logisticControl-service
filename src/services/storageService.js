const asyncHandler = require("express-async-handler");
const {createStorageFromData} = require("../factories/storageFactory");
const {generateUniqueStorageCode, createStorage, getStorages, findStorageByCode, updateStorageData, deleteStorage} = require("../repositories/storageRepository");

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

/**
 * Retrieves storage by code.
 *
 * This function handles the retrieval of storage based on the provided code.
 * It extracts the storage code from the request parameters.
 * If the storage is provided, it calls the findStorageByCode function to search for the storage in the database.
 * If the storage is found, it returns the storage data with HTTP status code 200 (OK).
 * If the storage is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the storage code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the storage data or an error message in JSON format.
 */
const getStorageByCode = asyncHandler(async (req, res) => {
    const storageCode = req.params.codStorage
    if(storageCode){
        const storage = await findStorageByCode(storageCode)
        if(storage){
            res.status(200).json(storage)
        } else{
            res.status(401).json({message: 'Storage not found'})
        }
    }else{
        res.status(401).json({message:'Invalid storage data'})
    }
})

/**
 * Updates storage data by code.
 *
 * This function updates the storage data based on the provided storage code.
 * It extracts the storage code from the request parameters.
 * If the storage code is provided, it retrieves the storage data using findStorageByCode function.
 * If the storage is found, it updates the storage data in the database and returns the updated storage data with HTTP status code 200 (OK).
 * If the storage is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the storage code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing storage data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the updated storage data or an error message in JSON format.
 */
const updateStorageByCode = asyncHandler(async (req, res) => {
    const codStorage = req.params.codStorage
    if(codStorage){
        const storage = await findStorageByCode(codStorage)
        if(storage){
            const filter = { _codStorage: codStorage }
            const update = { $set: req.body}
            const updatedOrder = await updateStorageData(filter, update)
            res.status(200).json(updatedOrder)
        } else{
            res.status(401).json({message: 'Storage not found'})
        }
    }else{
        res.status(401).json({message:'Invalid storage data'})
    }
})

/**
 * Deletes storage by storage code.
 *
 * This function deletes a storage based on the provided storage code.
 * It extracts the storage code from the request parameters.
 * If the storage code is provided, it retrieves the storage data using findStorageByCode function.
 * If the storage is found, it deletes the storage from the database and returns the deleted storage code with HTTP status code 200 (OK).
 * If the storage is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the storage code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing storage data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the deleted storage code or an error message in JSON format.
 */
const deleteStorageByCode = asyncHandler(async (req, res) => {
    const codStorage = req.params.codStorage
    if(codStorage){
        const storage = await findStorageByCode(codStorage)
        if(storage){
            const storageCode = storage._codStorage
            await deleteStorage(storageCode)
            res.status(200).json(storageCode)
        } else{
            res.status(401).json({message: 'Storage not found'})
        }
    }else{
        res.status(401).json({message:'Invalid storage data'})
    }
})

module.exports = {
    generateStorage,
    getAll,
    getStorageByCode,
    updateStorageByCode,
    deleteStorageByCode
}