const {Corridor} = require ('../entities/corridor')
/**
 * Creates a corridor object using corridor data.
 *
 * This function generates a corridor object based on the provided corridor data.
 *
 * @param {Object} corridorData - The corridor data used to create the corridor object.
 * @returns {Corridor} The newly created corridor object.
 */
function createCorridorFromData(corridorData) {
    return new Corridor(corridorData._name, corridorData._shelfList, corridorData._codCorridor);
}

module.exports = {createCorridorFromData}