const {Storage} = require ('../entities/storage')
/**
 * Creates a storage object using storage data.
 *
 * This function generates an order object based on the provided storage data.
 *
 * @param {Object} storageData - The storage data used to create the storage object.
 * @returns {Storage} The newly created Storage object.
 */
function createStorageFromData(storageData) {
    return new Storage(storageData._zoneCodeList, storageData._codStorage);
}

module.exports = {createStorageFromData}