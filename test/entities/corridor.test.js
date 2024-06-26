
const path = require("path");
const fs = require("fs");
const {createCorridorFromData} = require("../../src/factories/corridorFactory");
const {describe, beforeAll, it, expect} = require('@jest/globals')
describe('Corridor testing', () => {
    let corridor;

    beforeAll(() => {
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Corridor.json')
        const corridorData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
        corridor = createCorridorFromData(corridorData[1])
    });

    it('it should return the correct code of corridor', () => {
        expect(corridor.codCorridor).toBe("002024");
    });

    it('it should return the correct name', () => {
        expect(corridor.name).toBe("Corridor 2");
    });

    it('it should return the number of shelfs', () => {
        expect(corridor.shelfCodeList.length).toBeDefined();
    });

    it('it should set a new name of corridor', () => {
        let newName = "Corridor 2"
        corridor.name = newName
        expect(corridor.name).toBe(newName)
    })

    it('it should set a new code of corridor', () => {
        let newCode = "000004"
        corridor.codCorridor = newCode
        expect(corridor.codCorridor).toBe(newCode)
    })

    it('it should set a new shelfList of corridor', () => {
        let newShelfCodeList = ["001334", "000664", "988067"]
        corridor.shelfCodeList = newShelfCodeList
        expect(corridor.shelfCodeList).toBe(newShelfCodeList)
    })
});