const {Corridor} = require("../../src/entities/corridor")
const {describe, it, expect} = require('@jest/globals')
const {createCorridor, getCorridorsByZoneCode, findCorridorByCode, updateCorridorData} = require("../../src/repositories/corridorRepository");
const {findZoneByCode, updateZoneData} = require("../../src/repositories/zoneRepository");
const corridorRepository = () => describe('Storage testing', () => {

    it("it should create a new storage", async ()  => {
        let shelfCodeList = [ "01120", "01124"]
        const result = await createCorridor(new Corridor("Corridor 2", shelfCodeList, "001878"))
        expect(result).toBeDefined()
    })

    it('it should return all the corridors of the zone', async() => {
        const result = await getCorridorsByZoneCode("096723")
        expect(result.length).toEqual(1)
    })

    it('it should find a corridor by code', async () => {
        const corridor = await findCorridorByCode("002023")
        const shelfCodeList = ["001023"]
        expect(corridor._shelfCodeList).toEqual(shelfCodeList)
    });

    it('it should return null if corridor is not found', async () => {
        const codCorridor = '002123'
        const corridor = await findCorridorByCode(codCorridor)

        expect(corridor).toBeNull()
    });

    it('it should return an updated corridor with new name', async() => {
        const newName = "Corridor 12"
        const filter = { _codCorridor: "002023" }
        const update = { $set: { _name: newName } }

        const updatedCorridor = await updateCorridorData(filter, update)
        expect(updatedCorridor._name).toEqual(newName)
    })

    it('it should return null if the filter is not correct', async() => {
        const newName = "Corridor 12"
        const filter = { _codCorridor: "" }
        const update = { $set: { _name: newName } }

        const updatedCorridor = await updateCorridorData(filter, update)
        expect(updatedCorridor).toBeNull()
    })

});

module.exports = {corridorRepository}