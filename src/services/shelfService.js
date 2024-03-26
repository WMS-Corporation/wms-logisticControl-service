const asyncHandler = require("express-async-handler");
const {createShelfFromData} = require("../factories/shelfFactory");
const {findCorridorByCode, updateCorridorData} = require("../repositories/corridorRepository");
const {generateUniqueCode} = require("../repositories/storageRepository");
const {createShelf} = require("../repositories/shelfRepository");

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

module.exports = {
    generateShelf
}