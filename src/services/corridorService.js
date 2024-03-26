const asyncHandler = require("express-async-handler");
const {createCorridorFromData} = require("../factories/corridorFactory");
const {findZoneByCode, updateZoneData} = require("../repositories/zoneRepository");
const {generateUniqueCode} = require("../repositories/storageRepository");
const {createCorridor} = require("../repositories/corridorRepository");

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
    const corridor = createCorridorFromData(req.body)
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

module.exports = {
    generateCorridor
}