const dotenv = require('dotenv')
const {describe, beforeEach, it, expect} = require('@jest/globals')
const {generateShelf} = require("../../src/services/shelfService");
dotenv.config()
const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
};
const req = {
    body : "",
    user : "",
    params: ""
}

const shelfService = () => describe('Shelf testing', () => {

    beforeEach(async() => {
        req.body = ""
        req.user = ""
        req.params = ""
    })

    it('it should return 401 if the data are invalid', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _name : "",
            _productCodeList : ["001013"]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid shelf data'})
    });

    it('it should return 401 if creating a new shelf without specified the corridor code', async () => {
        const res = mockResponse()
        req.params = { codCorridor: ""}

        req.body = {
            _name : "Shelf 4",
            _productCodeList : ["001013"]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid corridor data'})
    });

    it('it should return 401 if creating a new corridor without correct corridor code', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "0a1323"}

        req.body = {
            _name : "Shelf 4",
            _productCodeList : ["001013"]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Corridor not found'})
    });

    it('it should return 200 if the shelf generation is successful', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _name : "Shelf 4",
            _productCodeList : ["001013"]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });

});

module.exports = {shelfService}