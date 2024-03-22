const {Zone} = require ('../entities/zone')
/**
 * Creates a zone object using zone data.
 *
 * This function generates a zone object based on the provided zone data.
 *
 * @param {Object} zoneData - The zone data used to create the zone object.
 * @returns {Zone} The newly created zone object.
 */
function createZoneFromData(zoneData) {
    return new Zone(zoneData._temperature, zoneData._coolingSystemStatus, zoneData._humidityLevel, zoneData._corridorCodeList, zoneData._codZone);
}

module.exports = {createZoneFromData}