const {Zone} = require("../../src/entities/zone")
const {createZone, getZonesByStorageCode, findZoneByCode, updateZoneData, deleteZone} = require("../../src/repositories/zoneRepository");
const {describe, it, expect} = require('@jest/globals')
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

    it('it should return an updated zone with new list of corridor', async() => {
        const newCorridorCodeList = ["001124", "123198"]
        const filter = { _codZone: "096523" }
        const update = { $set: { _corridorCodeList: newCorridorCodeList } }

        const updatedZone = await updateZoneData(filter, update)
        expect(updatedZone._corridorCodeList).toEqual(newCorridorCodeList)
    })

    it('it should return null if the filter is not correct', async() => {
        const newCorridorCodeList = ["001124", "123198"]
        const filter = { _codZone: "" }
        const update = { $set: { _corridorCodeList: newCorridorCodeList } }

        const updatedZone = await updateZoneData(filter, update)
        expect(updatedZone).toBeNull()
    })

    it('it should return null if the zone has been deleted', async() => {
        const zoneCode = '096523'
        await deleteZone(zoneCode)
        const deletedZone = await findZoneByCode(zoneCode)

        expect(deletedZone).toBeNull()
    })

});

module.exports = {zoneRepository}