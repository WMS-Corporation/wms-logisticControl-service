const {Corridor} = require("../../src/entities/corridor")
const {describe, it, expect} = require('@jest/globals')
const {createCorridor} = require("../../src/repositories/corridorRepository");
const corridorRepository = () => describe('Storage testing', () => {

    it("it should create a new storage", async ()  => {
        let shelfCodeList = [ "01120", "01124"]
        const result = await createCorridor(new Corridor("Corridor 2", shelfCodeList, "001878"))
        expect(result).toBeDefined()
    })

});

module.exports = {corridorRepository}