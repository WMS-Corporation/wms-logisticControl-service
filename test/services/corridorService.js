const dotenv = require('dotenv')
const {describe, beforeEach, it, expect} = require('@jest/globals')
const {generateCorridor} = require("../../src/services/corridorService");
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

const corridorService = () => describe('Corridor testing', () => {

    beforeEach(async() => {
        req.body = ""
        req.user = ""
        req.params = ""
    })

    it('it should return 401 if the data are invalid', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723"}
        req.body = {
            _name : "",
            _shelfCodeList : ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid corridor data'})
    });

    it('it should return 401 if creating a new corridor without specified the zone code', async () => {
        const res = mockResponse()
        req.params = { codZone: ""}

        req.body = {
            _name : "Corridor 2",
            _shelfCodeList : ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid zone data'})
    });

    it('it should return 401 if creating a new corridor without correct zone code', async () => {
        const res = mockResponse()
        req.params = { codZone: "001223"}

        req.body = {
            _name : "Corridor 2",
            _shelfCodeList : ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Zone not found'})
    });

    it('it should return 200 if the corridor generation is successful', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723"}
        req.body = {
            _name : "Corridor 2",
            _shelfCodeList : ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });

});

module.exports = {corridorService}