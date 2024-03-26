const {Corridor} = require("../../src/entities/corridor")
const {describe, it, expect} = require('@jest/globals')
const {createShelf} = require("../../src/repositories/shelfRepository");
const {Shelf} = require("../../src/entities/shelf");
const shelfRepository = () => describe('Shelf testing', () => {

    it("it should create a new shelf", async ()  => {
        let productCodeList = [ "01320", "01164"]
        const result = await createShelf(new Shelf("Shelf 3", productCodeList, "001478"))
        expect(result).toBeDefined()
    })

});

module.exports = {shelfRepository}