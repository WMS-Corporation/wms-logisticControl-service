
const path = require("path");
const fs = require("fs");
const {createZoneFromData} = require("../../src/factories/zoneFactory");
const {describe, beforeAll, it, expect} = require('@jest/globals')
describe('Zone testing', () => {
    let zone;

    beforeAll(() => {
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Zone.json')
        const zoneData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
        zone = createZoneFromData(zoneData[0])
    });

    it('it should return the correct code of zone', () => {
        expect(zone.codZone).toBe("096523");
    });

    it('it should return the correct temperature of zone', () => {
        expect(zone.temperature).toBe(23.5);
    });

    it('it should return the correct humidity level of zone', () => {
        expect(zone.humidityLevel).toBe(50);
    });

    it('it should return the correct status of cooling system of the zone', () => {
        expect(zone.coolingSystemStatus).toBe("Active");
    });

    it('it should return the number of corridors', () => {
        expect(zone.corridorCodeList.length).toBe(1);
    });

    it('it should set a new temperature of zone', () => {
        let newTemperature = 24
        zone.temperature = newTemperature
        expect(zone.temperature).toBe(newTemperature)
    })

    it('it should set a new humidity level of zone', () => {
        let newHumidityLevel = 51
        zone.humidityLevel = newHumidityLevel
        expect(zone.humidityLevel).toBe(newHumidityLevel)
    })

    it('it should set a new status of cooling system', () => {
        let newCoolingSystemStatus = "Inactive"
        zone.coolingSystemStatus = newCoolingSystemStatus
        expect(zone.coolingSystemStatus).toBe(newCoolingSystemStatus)
    })

    it('it should set a new code of zone', () => {
        let newCodZone = "001987"
        zone.codZone = newCodZone
        expect(zone.codZone).toBe(newCodZone)
    })

    it('it should set a new corridorList of zone', () => {
        let newCorridorCodeList = ["001234", "001664", "988167"]
        zone.corridorCodeList = newCorridorCodeList
        expect(zone.corridorCodeList).toBe(newCorridorCodeList)
    })
});