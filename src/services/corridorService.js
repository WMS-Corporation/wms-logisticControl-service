const asyncHandler = require("express-async-handler");
const {createCorridorFromData} = require("../factories/corridorFactory");
const {findZoneByCode, updateZoneData, getZones} = require("../repositories/zoneRepository");
const {generateUniqueCode} = require("../repositories/storageRepository");
const {createCorridor, getCorridorsByZoneCode, findCorridorByCode, updateCorridorData, deleteCorridor} = require("../repositories/corridorRepository");
const {verifyBodyFields} = require("./shelfService");

/**
 * Generate a new corridor.
 *
 * This function handles the generation of a corridor based on the data provided in the request body.
 * It validates the corridor data and checks for the existence of the corresponding zone.
 * If the zone is found, it generates a unique code for the corridor, updates the zone's corridor code list, and inserts the new corridor into the database.
 * If the corridor is successfully inserted, it returns a success message along with the assigned corridor details.
 * If the corridor data is invalid or insertion fails, it returns an error message.
 *
 * @param {Object} req - The request object containing the corridor data in the body.
 * @param {Object} res - The response object used to send the result of the assignment process.
 * @returns {Object} The HTTP response with the corridor created.
 */
const generateCorridor = asyncHandler(async(req, res) => {
    let corridor
    if(verifyBodyFields(req.body, "Create", corridorValidFields)){
        corridor = createCorridorFromData(req.body)
    } else {
        return res.status(401).json({ message: 'Please ensure all required fields are included and in the correct format.' })
    }
    if(!corridor.name || !corridor.shelfCodeList){
        return res.status(401).json({ message: 'Invalid corridor data' })
    }

    const zoneCode = req.params.codZone
    if(zoneCode){
        const zone = await findZoneByCode(zoneCode)
        if(zone){
            corridor.codCorridor = await generateUniqueCode()
            zone._corridorCodeList.push(corridor.codCorridor)
            const filter = { _codZone: zoneCode }
            const update = { $set:{_corridorCodeList : zone._corridorCodeList }}
            await updateZoneData(filter, update)
            const resultInsert = await createCorridor(corridor)
            if(resultInsert){
                res.status(200).json({ message: 'Corridor generation successful', corridor: corridor})
            }else{
                return res.status(401).json({ message: 'Invalid corridor data' })
            }
        } else{
            res.status(401).json({message: 'Zone not found'})
        }
    }else{
        res.status(401).json({message:'Invalid zone data'})
    }

})

/**
 * Retrieves all corridors of specific zone.
 *
 * This function handles the retrieval of all corridors, of specific zone, from the database.
 * It calls the getCorridorsByZoneCode function to fetch the corridor data.
 * If the retrieval is successful, it returns the corridor data with HTTP status code 200 (OK).
 * If the retrieval fails (e.g., invalid zone data), it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the corridor data or an error message in JSON format.
 */
const getAllCorridors = asyncHandler(async(req, res) => {
    const zone = await findZoneByCode(req.params.codZone)
    if(zone){
        const result = await getCorridorsByZoneCode(zone._codZone)
        if(result){
            res.status(200).json(result)
        } else {
            res.status(401).json({message: 'Invalid corridor data'})
        }
    }else{
        res.status(401).json({message: 'Zone not found'})
    }

})

/**
 * Retrieves corridor by code.
 *
 * This function handles the retrieval of corridor based on the provided code.
 * It extracts the corridor code from the request parameters.
 * If the corridor is provided, it calls the findCorridorByCode function to search for the corridor in the database.
 * If the corridor is found, it returns the corridor data with HTTP status code 200 (OK).
 * If the corridor is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the corridor code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the corridor data or an error message in JSON format.
 */
const getCorridorByCode = asyncHandler(async (req, res) => {
    const corridorCode = req.params.codCorridor
    if(corridorCode){
        const corridor = await findCorridorByCode(corridorCode)
        if(corridor){
            res.status(200).json(corridor)
        } else{
            res.status(401).json({message: 'Corridor not found'})
        }
    }else{
        res.status(401).json({message:'Invalid corridor data'})
    }
})

/**
 * Updates corridor data by code.
 *
 * This function updates the corridor data based on the provided corridor code.
 * It extracts the corridor code from the request parameters.
 * If the corridor code is provided, it retrieves the corridor data using findCorridorByCode function.
 * If the corridor is found and the field(s) that try to update is correct, it updates the corridor data in the database and returns the updated corridor data with HTTP status code 200 (OK).
 * If the corridor is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the corridor code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing corridor data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the updated corridor data or an error message in JSON format.
 */
const updateCorridorByCode = asyncHandler(async (req, res) => {
    const codCorridor = req.params.codCorridor

    if(!verifyBodyFields(req.body, "Update", corridorValidFields)){
        res.status(401).json({message: 'Please ensure all required fields are included and in the correct format.'})
        return
    }

    if(codCorridor){
        const corridor = await findCorridorByCode(codCorridor)
        if(corridor){
            const updateFields = {};
            for (const key in req.body) {
                if (
                    Object.prototype.hasOwnProperty.call(req.body, key) &&
                    req.body[key] !== undefined &&
                    req.body[key] !== null &&
                    req.body[key] !== ""
                ) {
                    updateFields[key] = req.body[key];
                }
            }

            const filter = { _codCorridor: codCorridor }
            const update = { $set: updateFields}
            const updatedCorridor = await updateCorridorData(filter, update)
            res.status(200).json(updatedCorridor)
        } else{
            res.status(401).json({message: 'Corridor not found'})
        }
    }else{
        res.status(401).json({message:'Invalid corridor data'})
    }
})

/**
 * Deletes corridor by it code.
 *
 * This function deletes a corridor based on the provided corridor code.
 * It extracts the corridor code from the request parameters.
 * If the corridor code is provided, it retrieves the corridor data using findCorridorByCode function.
 * If the corridor is found, it deletes the corridor from the database and returns the deleted corridor code with HTTP status code 200 (OK).
 * If the corridor is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the corridor code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing corridor data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the deleted corridor code or an error message in JSON format.
 */
const deleteCorridorByCode = asyncHandler(async (req, res) => {
    const codCorridor = req.params.codCorridor
    if(codCorridor){
        const corridor = await findCorridorByCode(codCorridor)
        if(corridor){
            const corridorCode = corridor._codCorridor
            await deleteCorridor(corridorCode)
            let zones = await getZones();
            for (const zone of zones){
                const index = zone._corridorCodeList.indexOf(codCorridor);
                if (index !== -1) {
                    zone._corridorCodeList.splice(index, 1);
                    const filter = { _codZone: zone._codZone }
                    const update = { $set: {_corridorCodeList: zone._corridorCodeList}}
                    await updateZoneData(filter, update)
                }
            }
            res.status(200).json(corridorCode)
        } else{
            res.status(401).json({message: 'Corridor not found'})
        }
    }else{
        res.status(401).json({message:'Invalid corridor data'})
    }
})

const corridorValidFields = [
    "_name",
    "_shelfCodeList"
];

module.exports = {
    generateCorridor,
    getAllCorridors,
    getCorridorByCode,
    updateCorridorByCode,
    deleteCorridorByCode
}