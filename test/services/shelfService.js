const dotenv = require('dotenv')
const {describe, beforeEach, it, expect} = require('@jest/globals')
const {generateShelf, getAllShelfs, getShelfByCode, updateShelfByCode} = require("../../src/services/shelfService");
const {getAllCorridors, getCorridorByCode, updateCorridorByCode} = require("../../src/services/corridorService");
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

    it('it should return 200 and all shelf of corridor', async() => {
        const res = mockResponse()
        req.params = { codCorridor: "002024" }
        await getAllShelfs(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code of corridor does not exists or is not correct', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "0a1877" }

        await getAllShelfs(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Corridor not found"})
    })

    it('it should return 200 and the shelf with the code specified', async () => {
        const res = mockResponse()
        req.params = { codShelf: "001023" }

        await getShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code is wrong', async () => {
        const res = mockResponse()
        req.params = { codShelf: "asddfve" }

        await getShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Shelf not found"})
    })

    it('it should return 401 if the code is not specified', async () => {
        const res = mockResponse()
        req.params = { codShelf: "" }

        await getShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid shelf data"})
    })

    it('it should return 200 and the shelf updated with a new data', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: "001023"
            },
            body:{
                _name: "Shelf 3"
            }
        };

        await updateShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if updating shelf data without correct shelf code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: "0a1023"
            },
            body:{
                _name: "Shelf 3"
            }
        };

        await updateShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Shelf not found"})
    })

    it('it should return 401 if updating shelf data without specified the shelf code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: ""
            },
            body:{
                _name: "Shelf 3"
            }
        };
        await updateShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid shelf data"})
    })

});

module.exports = {shelfService}