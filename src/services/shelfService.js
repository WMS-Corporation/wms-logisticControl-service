const asyncHandler = require("express-async-handler");
const {createShelfFromData} = require("../factories/shelfFactory");
const {findCorridorByCode, updateCorridorData, getCorridors} = require("../repositories/corridorRepository");
const {generateUniqueCode} = require("../repositories/storageRepository");
const {createShelf, getShelfsByCorridorCode, findShelfByCode, updateShelfData, deleteShelf, getShelf} = require("../repositories/shelfRepository");

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
    let shelf

    if(verifyBodyFields(req.body, "Create", shelfValidFields, productValidFields)){
        shelf = createShelfFromData(req.body)
    } else {
        return res.status(401).json({ message: 'Invalid request body. Please ensure all required fields are included and in the correct format.' })
    }

    if(!shelf.name){
        return res.status(401).json({ message: 'Invalid shelf name' })
    }

    if(!shelf.productList){
        shelf.productList = []
    } else {
        if(!Array.isArray(shelf.productList) && shelf.productList.every(item => typeof item === 'object' && item !== null)){
            return res.status(401).json({ message: 'Invalid format of product list' })
        }
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

/**
 * Updates shelf data by code.
 *
 * This function updates the shelf data based on the provided shelf code.
 * It extracts the shelf code from the request parameters.
 * If the shelf code is provided, it retrieves the shelf data using findShelfByCode function.
 * If the shelf is found and the field(s) that try to update is correct, it updates the shelf data in the database and returns the updated shelf data with HTTP status code 200 (OK).
 * If the shelf is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the shelf code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing shelf data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the updated shelf data or an error message in JSON format.
 */
const updateShelfByCode = asyncHandler(async (req, res) => {
    const codShelf = req.params.codShelf

    if(!verifyBodyFields(req.body, "Update", shelfValidFields, productValidFields)){
        res.status(401).json({message: 'Invalid request body. Please ensure all required fields are included and in the correct format.'})
    } else {
        if(codShelf){
            const shelf = await findShelfByCode(codShelf)
            if(shelf){
                const updateData = handleUpdateData(req.body, shelf)
                if(!updateData){
                    res.status(401).json({message: 'The products specified in the request body does not exist in the shelf\'s product list.'})
                    return
                }
                const filter = { _codShelf: codShelf }
                const updatedShelf = await updateShelfData(filter, updateData)
                res.status(200).json(updatedShelf)
            } else{
                res.status(401).json({message: 'Shelf not found'})
            }
        }else{
            res.status(401).json({message:'Invalid shelf data'})
        }
    }

})

/**
 * Deletes shelf by it code.
 *
 * This function deletes a shelf based on the provided shelf code.
 * It extracts the shelf code from the request parameters.
 * If the shelf code is provided, it retrieves the shelf data using findShelfByCode function.
 * If the shelf is found, it deletes the shelf from the database and returns the deleted shelf code with HTTP status code 200 (OK).
 * If the shelf is not found, it returns an error message with HTTP status code 401 (Unauthorized).
 * If the shelf code is invalid or missing, it returns an error message with HTTP status code 401 (Unauthorized).
 *
 * @param {Object} req - The request object containing shelf data.
 * @param {Object} res - The response object used to send the response.
 * @returns {Object} The HTTP response containing either the deleted shelf code or an error message in JSON format.
 */
const deleteShelfByCode = asyncHandler(async (req, res) => {
    const codShelf = req.params.codShelf

    if(codShelf){
        const shelf = await findShelfByCode(codShelf)
        if(shelf){
            const shelfCode = shelf._codShelf
            await deleteShelf(shelfCode)
            let corridors = await getCorridors();
            for (const corridor of corridors){
                const index = corridor._shelfCodeList.indexOf(codShelf);
                if (index !== -1) {
                    corridor._shelfCodeList.splice(index, 1);
                    const filter = { _codCorridor: corridor._codCorridor }
                    const update = { $set: {_shelfCodeList: corridor._shelfCodeList}}
                    await updateCorridorData(filter, update)
                }
            }
            res.status(200).json(shelfCode)
        } else{
            res.status(401).json({message: 'Shelf not found'})
        }
    }else{
        res.status(401).json({message:'Invalid shelf data'})
    }
})

/**
 * Function to verify the fields in the request body based on the operation type.
 *
 * @param {Object} body - The request body to be verified.
 * @param {string} operation - The type of operation (e.g., "Create" or "Update").
 * @param {Array} validFields - The array of valid fields for the main entity.
 * @param {Array} subEntityValidFields - The array of valid fields for sub-entities.
 * @return {boolean} - Indicates whether the fields in the body are valid for the specified operation.
 **/
const verifyBodyFields = (body, operation, validFields, subEntityValidFields) => {

    const validateFields = (fields, body, requireAll) => {
        const presentFields = Object.keys(body);
        const missingFields = fields.filter(field => !presentFields.includes(field));

        if (requireAll) {
            return missingFields.length === 0 && presentFields.length === fields.length;
        } else {
            return presentFields.every(field => fields.includes(field));
        }
    };

    const isArrayOfJSON = Object.values(body).some(value => Array.isArray(value) &&
        value.every(item => typeof item === 'object' && item !== null))

    if (operation === "Create") {
        return validateFields(validFields, body, true) &&
            (!isArrayOfJSON || Object.values(body).some(value => Array.isArray(value) &&
                value.every(item => validateFields(subEntityValidFields, item, true))))
    } else {
        return validateFields(validFields, body) &&
            (!isArrayOfJSON || Object.values(body).some(value => Array.isArray(value) &&
                value.every(item => (validateFields(subEntityValidFields, item)) && item._codProduct)));
    }

}

/**
 * Function to handle updating shelf data based on the provided body and existing shelf.
 *
 * @param {Object} body - The body containing the update data.
 * @param {Object} shelf - The existing shelf data.
 * @return {Object|null} - The update object or null if any product to be updated does not exist.
 **/
const handleUpdateData = (body, shelf) => {
    if (body._productList) {
        const shelfProductList = shelf._productList
        const productListToUpdate  = body._productList

        const allProductsExist   = productListToUpdate.every(productToUpdate =>
            shelfProductList.some(shelfProduct => shelfProduct._codProduct === productToUpdate._codProduct)
        );

        if (allProductsExist) {
            const update = { $set: {} };
            Object.keys(body).forEach(key => {
                if (key !== '_productList') {
                    update.$set[key] = body[key];
                }

            });

            productListToUpdate.forEach(productToUpdate => {
                shelfProductList.forEach(product => {
                    if(product._codProduct === productToUpdate._codProduct){
                        Object.keys(productToUpdate).forEach(field => {
                            product[field] = productToUpdate[field]
                        });
                    }
                })
            })

            update.$set["_productList"] = shelfProductList;
            return update;
        } else {
            return null;
        }
    } else {
        const update = { $set: body };
        return update;
    }
}

/**
 * Handles the transfer of products between shelves.
 * Retrieves the list of products to transfer from the request body,
 * fetches the list of all shelves, and iterates through each transfer operation.
 * For each transfer, it updates the stock of the products on the shelves
 * and updates the shelf data in the database accordingly.
 * Finally, it responds with an array of products that have been updated after the transfer operation.
 *
 * @param {Object} req - The request object containing the list of products to transfer.
 * @param {Object} res - The response object to send back the updated products.
 * @returns {Object} An array of products that have been updated after the transfer operation.
 */
const productTransfer = asyncHandler(async (req, res) => {
    const productsToTransfer = req.body._productList
    const shelf = await getShelf()
    const update = { $set: {} }
    const productsUpdated = []

    for (const transfer of productsToTransfer) {
        const fromShelf = shelf.find(s => s._codShelf === transfer._from);
        const toShelf = shelf.find(s => s._codShelf === transfer._to);

        if (fromShelf) {
            const productFromShelf = fromShelf._productList.find(product => product._codProduct === transfer._codProduct);
            productFromShelf._stock -= transfer._quantity;
            productsUpdated.push(productFromShelf)
            const filter = { _codShelf: fromShelf._codShelf }
            update.$set["_productList"] = fromShelf._productList
            await updateShelfData(filter, update)
        }

        if (toShelf) {
            const productToShelf = toShelf._productList.find(product => product._codProduct === transfer._codProduct);
            productToShelf._stock += transfer._quantity;
            productsUpdated.push(productToShelf)
            const filter = { _codShelf: toShelf._codShelf }
            update.$set["_productList"] = toShelf._productList
            await updateShelfData(filter, update)
        }
    }

    res.status(200).json(productsUpdated)
})

const shelfValidFields = [
    "_name",
    "_productList"
];

const productValidFields = [
    "_codProduct",
    "_stock"
];

module.exports = {
    generateShelf,
    getAllShelfs,
    getShelfByCode,
    updateShelfByCode,
    deleteShelfByCode,
    verifyBodyFields,
    productTransfer
}