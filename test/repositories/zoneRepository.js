const {Zone} = require("../../src/entities/zone")
const {createZone, getZonesByStorageCode, findZoneByCode} = require("../../src/repositories/zoneRepository");
const {findStorageByCode} = require("../../src/repositories/storageRepository");

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

    it('it should find a storage by code', async () => {
        const zone = await findZoneByCode("096523")
        const corridorCodeList = ["002023"]
        expect(zone._corridorCodeList).toEqual(corridorCodeList)
    });

    it('it should return null if zone is not found', async () => {
        const codZone = '000123'
        const zone = await findZoneByCode(codZone)

        expect(zone).toBeNull()
    });

});

module.exports = {zoneRepository}