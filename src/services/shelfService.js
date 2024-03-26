const asyncHandler = require("express-async-handler");
const {createShelfFromData} = require("../factories/shelfFactory");
const {findCorridorByCode, updateCorridorData} = require("../repositories/corridorRepository");
const {generateUniqueCode} = require("../repositories/storageRepository");
const {createShelf, getShelfsByCorridorCode, findShelfByCode} = require("../repositories/shelfRepository");

/**
 * Generate a new shelf.
 *
 * This function handles the generation of a shelf based on the data provided in the request body.
 * It validates the shelf data and checks for the existence of the corresponding corridor.
 * If the shelf is found, it generates a unique code for the shelf, updates the corridor's shelf code list, and inserts the new shelf into the database.
 * If the shelf is successfully inserted, it returns a success message along with the assigned shelf details.
 * If the shelf data is invalid or insertion fails, it returns an error message.
 *
 * @param {Object} req - The request object containing the shelf data in the body.
 * @param {Object} res - The response object used to send the result of the assignment process.
 * @returns {Object} The HTTP response with the shelf created.
 */
const generateShelf = asyncHandler(async(req, res) => {
    const shelf = createShelfFromData(req.body)
    if(!shelf.name || !shelf.productCodeList){
        return res.status(401).json({ message: 'Invalid shelf data' })
    }

    const corridorCode = req.params.codCorridor
    if(corridorCode){
        const corridor = await findCorridorByCode(corridorCode)
        if(corridor){
            shelf.codShelf = await generateUniqueCode()
            corridor._shelfCodeList.push(shelf.codShelf)
            const filter = { _codCorridor: corridorCode }
            const update = { $set:{_shelfCodeList : corridor._shelfCodeList }}
            await updateCorridorData(filter, update)
            const resultInsert = await createShelf(shelf)
            if(resultInsert){
                res.status(200).json({ message: 'Shelf generation successful', corridor: corridor})
            }else{
                return res.status(401).json({ message: 'Invalid shelf data' })
            }
        } else{
            res.status(401).json({message: 'Corridor not found'})
        }
    }else{
        res.status(401).json({message:'Invalid corridor data'})
    }

})

/**
 * Retrieves all shelf of specific corridor.
 *
 * This function handles the retrieval of all shelf, of specific corridor, from the database.
 * It calls the getShelfsByCorridorCode function to fetch the shelf data.
 * If the retrieval is successful, it returns the shelf data with HTTP status code 200 (OK).
 * If the retrieval fails (e.g., invalid corridor data), it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the shelf data or an error message in JSON format.
 */
const getAllShelfs = asyncHandler(async(req, res) => {
    const corridor = await findCorridorByCode(req.params.codCorridor)
    if(corridor){
        const result = await getShelfsByCorridorCode(corridor._codCorridor)
        if(result){
            res.status(200).json(result)
        } else {
            res.status(401).json({message: 'Invalid shelf data'})
        }
    }else{
        res.status(401).json({message: 'Corridor not found'})
    }

})

/**
 * Retrieves shelf by code.
 *
 * This function handles the retrieval of shelf based on the provided code.
 * It extracts the shelf code from the request parameters.
 * If the shelf is provided, it calls the findShelfByCode function to search for the shelf in the database.
 * If the shelf is found, it returns the shelf data with HTTP status code 200 (OK).
 * If the shelf is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the shelf code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The HTTP response containing either the shelf data or an error message in JSON format.
 */
const getShelfByCode = asyncHandler(async (req, res) => {
    const shelfCode = req.params.codShelf
    if(shelfCode){
        const shelf = await findShelfByCode(shelfCode)
        if(shelf){
            res.status(200).json(shelf)
        } else{
            res.status(401).json({message: 'Shelf not found'})
        }
    }else{
        res.status(401).json({message:'Invalid shelf data'})
    }
})

module.exports = {
    generateShelf,
    getAllShelfs,
    getShelfByCode
}