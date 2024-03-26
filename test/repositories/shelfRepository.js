
const {describe, it, expect} = require('@jest/globals')
const {createShelf, getShelfsByCorridorCode, findShelfByCode} = require("../../src/repositories/shelfRepository");
const {Shelf} = require("../../src/entities/shelf");
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

    it('it should find a shelf by code', async () => {
        const shelf = await findShelfByCode("001023")
        const productCodeList = ["000234", "000123", "000456"]
        expect(shelf._productCodeList).toEqual(productCodeList)
    });

    it('it should return null if shelf is not found', async () => {
        const codShelf = '0a2123'
        const shelf = await findShelfByCode(codShelf)

        expect(shelf).toBeNull()
    });
});

module.exports = {shelfRepository}