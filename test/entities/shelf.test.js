
const path = require("path");
const fs = require("fs");
const {createShelfFromData} = require("../../src/factories/shelfFactory");
describe('Shelf testing', () => {
    let shelf;

    beforeAll(() => {
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Shelf.json')
        const shelfData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
        shelf = createShelfFromData(shelfData)
    });

    it('should return the correct code of shelf', () => {
        expect(shelf.codShelf).toBe("001023");
    });

    it('should return the correct name', () => {
        expect(shelf.name).toBe("Shelf 1");
    });

    it('should return the number of products', () => {
        expect(shelf.productList.length).toBe(3);
    });

    it('it should set a new name of shelf', () => {
        let newName = "Shelf 2"
        shelf.name = newName
        expect(shelf.name).toBe(newName)
    })

    it('it should set a new code of shelf', () => {
        let newCode = "000003"
        shelf.codShelf = newCode
        expect(shelf.codShelf).toBe(newCode)
    })

    it('it should set a new productList of shelf', () => {
        let newProductList = ["001234", "000564", "987067"]
        shelf.productList = newProductList
        expect(shelf.productList).toBe(newProductList)
    })
});