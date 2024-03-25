const {Zone} = require("../../src/entities/zone")
const {createZone, getZonesByStorageCode} = require("../../src/repositories/zoneRepository");

const zoneRepository = () => describe('Zone testing', () => {

    it("it should create a new zone", async ()  => {
        let corridorCodeList = [ "00140", "00144"]
        const result = await createZone(new Zone(26, "Active", 55, corridorCodeList, "125678"))
        expect(result).toBeDefined()
    })

    it('it should return all the zones of the storage', async() => {
        const result = await getZonesByStorageCode("001548")
        expect(result.length).toEqual(3)
    })

});

module.exports = {zoneRepository}