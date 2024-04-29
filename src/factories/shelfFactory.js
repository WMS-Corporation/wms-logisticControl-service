const {Shelf} = require ('../entities/shelf')
/**
 * Creates a shelf object using shelf data.
 *
 * This function generates a shelf object based on the provided shelf data.
 *
 * @param {Object} shelfData - The shelf data used to create the shelf object.
 * @returns {Shelf} The newly created shelf object.
 */
function createShelfFromData(shelfData) {
    return new Shelf(shelfData._name, shelfData._productList, shelfData._codShelf);
}

module.exports = {createShelfFromData}