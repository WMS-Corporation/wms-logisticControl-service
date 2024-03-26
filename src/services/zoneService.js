const asyncHandler = require("express-async-handler");
const {createZoneFromData} = require("../factories/zoneFactory");
const {findStorageByCode, generateUniqueCode, updateStorageData, getStorages} = require("../repositories/storageRepository");
const {createZone, getZonesByStorageCode, findZoneByCode, updateZoneData, deleteZone} = require("../repositories/zoneRepository");

/**
 * Generate a new zone.
 *
 * This function handles the generation of a zone based on the data provided in the request body.
 * It validates the zone data and checks for the existence of the corresponding storage.
 * If the storage is found, it generates a unique code for the zone, updates the storage's zone code list, and inserts the new zone into the database.
 * If the zone is successfully inserted, it returns a success message along with the assigned zone details.
 * If the zone data is invalid or insertion fails, it returns an error message.
 *
 * @param {Object} req - The request object containing the zone data in the body.
 * @param {Object} res - The response object used to send the result of the assignment process.
 * @returns {Object} The HTTP response with the zone created.
 */
const generateZone = asyncHandler(async(req, res) => {
    const zone = createZoneFromData(req.body)
    if(!zone.temperature || !zone.humidityLevel || !zone.coolingSystemStatus || !zone.corridorCodeList){
        return res.status(401).json({ message: 'Invalid zone data' })
    }

    const storageCode = req.params.codStorage
    if(storageCode){
        const storage = await findStorageByCode(storageCode)
        if(storage){
            zone.codZone = await generateUniqueCode()
            storage._zoneCodeList.push(zone.codZone)
            const filter = { _codStorage: storageCode }
            const update = { $set:{_zoneCodeList : storage._zoneCodeList }}
            await updateStorageData(filter, update)
            const resultInsert = await createZone(zone)
            if(resultInsert){
                res.status(200).json({ message: 'Zone generation successful', zone: zone})
            }else{
                return res.status(401).json({ message: 'Invalid zone data' })
            }
        } else{
            res.status(401).json({message: 'Storage not found'})
        }
    }else{
        res.status(401).json({message:'Invalid storage data'})
    }

})

/**
 * Retrieves all zones of specific storage.
 *
 * This function handles the retrieval of all zone, of specific storage, from the database.
 * It calls the getZonesByStorageCode function to fetch the zone data.
 * If the retrieval is successful, it returns the zone data with HTTP status code 200 (OK).
 * If the retrieval fails (e.g., invalid zone data), it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the zone data or an error message in JSON format.
 */
const getAllZones = asyncHandler(async(req, res) => {
    const storage = await findStorageByCode(req.params.codStorage)
    if(storage){
        const result = await getZonesByStorageCode(storage._codStorage)
        if(result){
            res.status(200).json(result)
        } else {
            res.status(401).json({message: 'Invalid storage data'})
        }
    }else{
        res.status(401).json({message: 'Storage not found'})
    }

})

/**
 * Retrieves zone by code.
 *
 * This function handles the retrieval of zone based on the provided code.
 * It extracts the zone code from the request parameters.
 * If the zone is provided, it calls the findZoneByCode function to search for the zone in the database.
 * If the zone is found, it returns the zone data with HTTP status code 200 (OK).
 * If the zone is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the zone code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the zone data or an error message in JSON format.
 */
const getZoneByCode = asyncHandler(async (req, res) => {
    const zoneCode = req.params.codZone
    if(zoneCode){
        const zone = await findZoneByCode(zoneCode)
        if(zone){
            res.status(200).json(zone)
        } else{
            res.status(401).json({message: 'Zone not found'})
        }
    }else{
        res.status(401).json({message:'Invalid zone data'})
    }
})

/**
 * Updates zone data by code.
 *
 * This function updates the zone data based on the provided zone code.
 * It extracts the zone code from the request parameters.
 * If the zone code is provided, it retrieves the zone data using findZoneByCode function.
 * If the zone is found, it updates the zone data in the database and returns the updated zone data with HTTP status code 200 (OK).
 * If the zone is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the zone code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing zone data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the updated zone data or an error message in JSON format.
 */
const updateZoneByCode = asyncHandler(async (req, res) => {
    const codZone = req.params.codZone
    if(codZone){
        const zone = await findZoneByCode(codZone)
        if(zone){
            const filter = { _codZone: codZone }
            const update = { $set: req.body}
            const updatedZone = await updateZoneData(filter, update)
            res.status(200).json(updatedZone)
        } else{
            res.status(401).json({message: 'Zone not found'})
        }
    }else{
        res.status(401).json({message:'Invalid zone data'})
    }
})

/**
 * Deletes zone by zone code.
 *
 * This function deletes a zone based on the provided zone code.
 * It extracts the zone code from the request parameters.
 * If the zone code is provided, it retrieves the zone data using findZoneByCode function.
 * If the zone is found, it deletes the zone from the database and returns the deleted zone code with HTTP status code 200 (OK).
 * If the zone is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the zone code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing zone data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the deleted zone code or an error message in JSON format.
 */
const deleteZoneByCode = asyncHandler(async (req, res) => {
    const codZone = req.params.codZone
    if(codZone){
        const zone = await findZoneByCode(codZone)
        if(zone){
            const zoneCode = zone._codZone
            await deleteZone(zoneCode)
            let storages = await getStorages();
            for (const storage of storages){
                const index = storage._zoneCodeList.indexOf(codZone);
                if (index !== -1) {
                    storage._zoneCodeList.splice(index, 1);
                    const filter = { _codStorage: storage._codStorage }
                    const update = { $set: {_zoneCodeList: storage._zoneCodeList}}
                    await updateStorageData(filter, update)
                }
            }
            res.status(200).json(zoneCode)
        } else{
            res.status(401).json({message: 'Zone not found'})
        }
    }else{
        res.status(401).json({message:'Invalid zone data'})
    }
})

module.exports = {
    generateZone,
    getAllZones,
    getZoneByCode,
    updateZoneByCode,
    deleteZoneByCode
}