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
        return res.status(401).json({ message: 'Please ensure all required fields are included and in the correct format.' })
    }

    if(!shelf.name){
        return res.status(401).json({ message: 'Invalid shelf name' })
    }

    if(!shelf.productList){
        shelf.productList = []
    } else {
        if(Array.isArray(shelf.productList) && !shelf.productList.every(item => typeof item === 'object' && item !== null)){
            return res.status(401).json({ message: 'Invalid format of product list' })
        }

        for(let product of shelf.productList){
            let responseProductService = await fetchData('http://localhost:4002/' + product._codProduct, req)
            if(responseProductService.status === 401){
                return res.status(401).json({ message: 'Product not defined.' })
            }
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

const addProductToShelf = asyncHandler(async(req, res) => {
    let productInShelf = req.body;
    if(productInShelf._codProduct === undefined || productInShelf._stock === undefined){
        return res.status(401).json({ message: 'Please ensure all required fields are included and in the correct format.' })
    }

    let responseProductService = await fetchData('http://localhost:4002/' + productInShelf._codProduct, req)
    if(responseProductService.status === 401){
        return res.status(401).json({ message: 'Product not defined.' })
    }

    const shelf = await findShelfByCode(req.params.codShelf)
    if (!shelf) {
        return res.status(404).json({ message: 'Shelf not found.' });
    }

    let existingProduct = null
    if(shelf._productList.length > 0){
        existingProduct = shelf._productList.find(product => product._codProduct === productInShelf._codProduct);
    }

    if (existingProduct) {
        existingProduct._stock = parseInt(existingProduct._stock, 10) + parseInt(productInShelf._stock, 10);
        console.log(existingProduct)
    } else {
        shelf._productList.push({
            _codProduct: productInShelf._codProduct,
            _stock: productInShelf._stock
        });
    }
    const filter = { _codShelf: req.params.codShelf };
    const update = { $set: { _productList: shelf._productList } };

    let updatedShelfList = await updateShelfData(filter, update)
    if(updatedShelfList){
        console.log(updatedShelfList)
        return res.status(200).json({ message: 'Add product to shelf', product: productInShelf})
    }else{
        return res.status(401).json({ message: 'Invalid shelf data' })
    }

})

const updateProductInShelf = asyncHandler(async (req, res) => {
    let stock = req.body._stock;
    const codShelf = req.params.codShelf
    const codProduct = req.params.codProduct

    if(!stock){
        return res.status(401).json({ message: 'Please ensure all required fields are included and in the correct format.' })
    }

    let responseProductService = await fetchData('http://localhost:4002/' + codProduct, req)
    if(responseProductService.status === 401){
        return res.status(401).json({ message: 'Product not defined.' })
    }

    const shelf = await findShelfByCode(codShelf)
    if (!shelf) {
        return res.status(404).json({ message: 'Shelf not found.' });
    }

    let index = shelf._productList.indexOf(codProduct);
    shelf._productList.splice(index, 1);
    shelf._productList.push({
        _codProduct: codProduct,
        _stock: stock
    });
    const filter = { _codShelf: req.params.codShelf };
    const update = { $set: { _productList: shelf._productList } };

    let updatedShelfList = await updateShelfData(filter, update)
    if(updatedShelfList){
        console.log(updatedShelfList)
        return res.status(200).json({ message: 'Update product in shelf', product: {
                _codProduct: codProduct,
                _stock: stock
            }})
    }else{
        return res.status(401).json({ message: 'Invalid shelf data' })
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
        return res.status(401).json({message: 'Please ensure all required fields are included and in the correct format.'})
    }

    if(req.body._productList){
        for(let product of req.body._productList){
            let responseProductService = await fetchData('http://localhost:4002/' + product._codProduct, req)
            if(responseProductService.status === 401){
                return res.status(401).json({ message: 'Product not defined.' })
            }
        }
    }

    if(codShelf){
        const shelf = await findShelfByCode(codShelf)
        if(shelf){
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
            
            const update = { $set: updateFields }
            const filter = { _codShelf: codShelf }
            const updatedShelf = await updateShelfData(filter, update)
            return res.status(200).json(updatedShelf)
        } else{
            return res.status(401).json({message: 'Shelf not found'})
        }
    }else{
        return res.status(401).json({message:'Invalid shelf data'})
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

const deleteProductOfShelf = asyncHandler(async (req, res) => {
    const codShelf = req.params.codShelf
    const codProduct = req.params.codProduct

    let responseProductService = await fetchData('http://localhost:4002/' + codProduct, req)
    if(responseProductService.status === 401){
        return res.status(401).json({ message: 'Product not defined.' })
    }

    const shelf = await findShelfByCode(codShelf)
    if (!shelf) {
        return res.status(404).json({ message: 'Shelf not found.' });
    }

    let index = shelf._productList.indexOf(codProduct);
    shelf._productList.splice(index, 1);
    const filter = { _codShelf: req.params.codShelf };
    const update = { $set: { _productList: shelf._productList } };

    let updatedShelfList = await updateShelfData(filter, update)
    if(updatedShelfList){
        return res.status(200).json({ message: 'Delete product in shelf', product: codProduct})
    }else{
        return res.status(401).json({ message: 'Invalid shelf data' })
    }
})

/**
 * Verifies the fields in the request body based on the operation type and the valid fields for the main entity and sub-entities.
 *
 * This function checks whether the fields in the request body are valid for the specified operation type ("Create" or "Update").
 * It validates the presence and correctness of required fields for the main entity and its sub-entities.
 * Returns true if all fields are valid; otherwise, returns false.
 *
 * @param {Object} body - The request body to be verified.
 * @param {string} operation - The type of operation (e.g., "Create" or "Update").
 * @param {Array} validFields - The array of valid fields for the main entity.
 * @param {Array} subEntityValidFields - The array of valid fields for sub-entities.
 * @return {boolean} - Indicates whether the fields in the body are valid for the specified operation.
 */
const verifyBodyFields = (body, operation, validFields, subEntityValidFields) => {

    const validateFields = (fields, body, requireAll) => {
        const presentFields = Object.keys(body);
        const missingFields = fields.filter(field => !presentFields.includes(field));

        if (requireAll) {
            return missingFields.length === 0 && presentFields.length === fields.length;
        } else {
            if(presentFields.length === 1 && presentFields[0] === "_codProduct")
                return false
            else
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
            if(productToShelf){
                productToShelf._stock += transfer._quantity;
            } else {
                toShelf._productList.push({
                    _codProduct: transfer._codProduct,
                    _stock: transfer._quantity
                })
            }

            productsUpdated.push(productToShelf)
            const filter = { _codShelf: toShelf._codShelf }
            update.$set["_productList"] = toShelf._productList
            await updateShelfData(filter, update)
        }
    }

    res.status(200).json(productsUpdated)
})

/**
 * Fetches data from the specified URL using the provided request options.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {Object} req - The request object containing headers and user information.
 * @returns {Promise<Object>} A promise that resolves to an object containing the status and data.
 *                           - { status: 200, data } if the request is successful.
 *                           - { status: 401 } if the response is not OK.
 *                           - { status: 500 } if there is an error during the request.
 */
const fetchData = async (url, req) => {
    let authorization = req.headers.authorization
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': authorization},
        user: req.user
    }

    try {
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            return { status: 401 }
        }
        const data = await response.json()
        return { status: 200, data }
    } catch (error) {
        console.error('Error during the request:', error)
        return { status: 500 }
    }
}

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
    productTransfer,
    fetchData,
    addProductToShelf,
    updateProductInShelf,
    deleteProductOfShelf
}