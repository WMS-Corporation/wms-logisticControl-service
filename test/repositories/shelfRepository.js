const {Corridor} = require("../../src/entities/corridor")
const {describe, it, expect} = require('@jest/globals')
const {createShelf, getShelfsByCorridorCode} = require("../../src/repositories/shelfRepository");
const {Shelf} = require("../../src/entities/shelf");
const {getCorridorsByZoneCode} = require("../../src/repositories/corridorRepository");
const shelfRepository = () => describe('Shelf testing', () => {

    it("it should create a new shelf", async ()  => {
        let productCodeList = [ "01320", "01164"]
        const result = await createShelf(new Shelf("Shelf 3", productCodeList, "001478"))
        expect(result).toBeDefined()
    })

    it('it should return all the shelfs of the corridor', async() => {
        const result = await getShelfsByCorridorCode("002024")
        expect(result.length).toEqual(1)
    })
});

module.exports = {shelfRepository}