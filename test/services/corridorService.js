const dotenv = require('dotenv')
const { describe, beforeEach, it, expect } = require('@jest/globals')
const { generateCorridor, getAllCorridors, getCorridorByCode, updateCorridorByCode, deleteCorridorByCode } = require("../../src/services/corridorService");

const { updateZoneData } = require("../../src/repositories/zoneRepository");
jest.mock("../../src/repositories/zoneRepository", () => ({
    ...jest.requireActual("../../src/repositories/zoneRepository"),
    updateZoneData: jest.fn()
}));


dotenv.config()
const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
};
const req = {
    body: "",
    user: "",
    params: ""
}

const corridorService = () => describe('Corridor testing', () => {

    beforeEach(async () => {
        req.body = ""
        req.user = ""
        req.params = ""
        updateZoneData.mockClear();
    })

    it('it should return 401 if the body data are invalid', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723" }
        req.body = {
            _names: "",
            _shelfCodeList: ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Please ensure all required fields are included and in the correct format.' })
    });

    it('it should return 401 if the data are invalid', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723" }
        req.body = {
            _name: "",
            _shelfCodeList: ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid corridor data' })
    });

    it('it should return 401 if creating a new corridor without specified the zone code', async () => {
        const res = mockResponse()
        req.params = { codZone: "" }

        req.body = {
            _name: "Corridor 2",
            _shelfCodeList: ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid zone data' })
    });

    it('it should return 401 if creating a new corridor without correct zone code', async () => {
        const res = mockResponse()
        req.params = { codZone: "001223" }

        req.body = {
            _name: "Corridor 2",
            _shelfCodeList: ["001023"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Zone not found' })
    });

    it('it should return 200 if the corridor generation is successful', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723" }
        req.body = {
            _name: "Corridor 2",
            _shelfCodeList: ["001023", "123098"]
        }

        await generateCorridor(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('it should return 200 and all corridors of zone', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723" }
        await getAllCorridors(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code of zone does not exists or is not correct', async () => {
        const res = mockResponse()
        req.params = { codZone: "001877" }

        await getAllCorridors(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Zone not found" })
    })

    it('it should return 200 and the corridor with the code specified', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002023" }

        await getCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code is wrong', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "asddfve" }

        await getCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Corridor not found" })
    })

    it('it should return 401 if the code is not specified', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "" }

        await getCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid corridor data" })
    })

    it('it should return 200 and the corridor updated with a new data', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: "002023"
            },
            body: {
                _name: "Corridor 3"
            }
        };

        await updateCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if updating corridor data without correct corridor code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: "0001877"
            }, body: {
                _name: "Corridor 3"
            }
        };

        await updateCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Corridor not found" })
    })

    it('it should return 401 if updating corridor data without specified the corridor code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: ""
            }, body: {
                _name: "Corridor 3"
            }
        };
        await updateCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid corridor data" })
    })

    it('it should return 401 if try to updating field that is not specified for the corridor ', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: "002023"
            }, body: {
                _names: "storage 1"
            }
        };
        await updateCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Please ensure all required fields are included and in the correct format." })
    })

    it('it should return 200 and the code of the corridor that has been deleted', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: "002023"
            }
        }
        await deleteCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if deleting corridor without correct corridor code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: "0a0978"
            }
        };

        await deleteCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Corridor not found" })
    })

    it('it should return 401 if deleting corridor without specified the corridor code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codCorridor: ""
            }
        };
        await deleteCorridorByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid corridor data" })
    })

});

module.exports = { corridorService }