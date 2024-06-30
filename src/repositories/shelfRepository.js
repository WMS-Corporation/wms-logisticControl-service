const { collections } = require("../config/dbConnection");
const asyncHandler = require("express-async-handler");
const { getSocket } = require('../utils/socketManager');

/**
 * Creates a new shelf.
 *
 * This function inserts a new shelf into the database.
 *
 * @param {Object} shelf - The shelf object to create.
 * @returns {Object} The result of the shelf creation operation.
 * @throws {Error} If failed to create shelf.
 */
const createShelf = asyncHandler(async (shelf) => {
    return await collections?.shelfs?.insertOne(shelf)
});

/**
 * Retrieves all shelfs about specific corridor.
 *
 * This function handles the retrieval of all shelfs, about specific corridor, from the database.
 *
 * @returns {Array|null} An array containing shelf data if retrieval is successful, otherwise null.
 */
const getShelfsByCorridorCode = asyncHandler(async (codCorridor) => {
    let corridor = await collections?.corridors?.findOne({ _codCorridor: codCorridor })
    return corridor._shelfCodeList
})

/**
 * Retrieves all shelf.
 *
 * This function handles the retrieval of all shelf from the database.
 *
 * @returns {Array|null} An array containing corridor data if retrieval is successful, otherwise null.
 */
const getShelf = asyncHandler(async () => {
    return await collections?.shelfs?.find().toArray()
})

/**
 * Finds a shelf by code.
 *
 * This function queries the database to find a shelf based on the provided code.
 *
 * @param {string} shelfCode - The code of the shelf to find.
 * @returns {Object|null} The shelf object if found, or null if not found.
 */
const findShelfByCode = asyncHandler(async (shelfCode) => {
    return await collections?.shelfs?.findOne({ _codShelf: shelfCode })
});

/**
 * Updates shelf data based on a filter.
 *
 * This function updates shelf data based on the provided filter criteria and the update object.
 *
 * @param {Object} filter - The filter criteria to find the shelf(s) to update.
 * @param {Object} update - The update object containing the fields to update and their new values.
 * @returns {Object|null} The updated shelf data if the corridor is found, otherwise null.
 */
const updateShelfData = asyncHandler(async (filter, update) => {
    const options = { returnOriginal: false };
    await collections?.shelfs?.findOneAndUpdate(filter, update, options);
    let updatedShelf = await collections?.shelfs?.findOne(filter);
    const productCode = update.$set.productCode; // Assumendo che il codice del prodotto sia incluso nell'update
    const allShelves = await getAllShelvesWithProduct(productCode); // Implementa questa funzione per recuperare tutti gli scaffali con il prodotto
    let totalStock = 0;

    allShelves.forEach(shelf => {
        const product = shelf.productList.find(p => p.code === productCode);
        if (product) {
            totalStock += product.quantity;
        }
    });

    const threshold = 10;
    if (totalStock < threshold) {
        const socket = getSocket();
        socket.emit('lowStockAlert', { productCode, totalStock });
    }

    return updatedShelf;
})

const getAllShelvesWithProduct = asyncHandler(async (productCode) => {
    if (!collections?.shelfs) {
        console.error("Database connection is not established.");
        return [];
    }

    try {
        const shelves = await collections.shelfs.find({
            "productList.code": productCode
        }).toArray();

        return shelves;
    } catch (error) {
        console.error("Failed to retrieve shelves with product:", error);
        throw new Error("Failed to retrieve shelves with the specified product.");
    }
});

/**
 * Deletes a shelf based on shelf code.
 *
 * This function deletes a shelf based on the provided shelf code.
 *
 * @param {string} codShelf - The code of the shelf to be deleted.
 * @returns {Object} The result of the deletion operation.
 */
const deleteShelf = asyncHandler(async (codShelf) => {
    return await collections?.shelfs?.deleteOne({ _codShelf: codShelf })
})

module.exports = {
    createShelf,
    getShelfsByCorridorCode,
    getShelf,
    findShelfByCode,
    updateShelfData,
    deleteShelf
}