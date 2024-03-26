const {Corridor} = require("../../src/entities/corridor")
const {describe, it, expect} = require('@jest/globals')
const {createCorridor, getCorridorsByZoneCode} = require("../../src/repositories/corridorRepository");
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

});

module.exports = {corridorRepository}