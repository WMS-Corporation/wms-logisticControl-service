const dotenv = require('dotenv')
const {generateZone, getAllZones, getZoneByCode, updateZoneByCode} = require("../../src/services/zoneService");
const {updateStorageByCode} = require("../../src/services/storageService");

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

const zoneService = () => describe('Zone testing', () => {

    beforeEach(async() => {
        req.body = ""
        req.user = ""
        req.params = ""
    })

    it('it should return 401 if the data are invalid', async () => {
        const res = mockResponse()
        req.params = { codStorage: "096523"}
        req.body = {
            _temperature : 23.5,
            _coolingSystemStatus : "",
            _humidityLevel: "",
            _corridorCodeList: ""
        }

        await generateZone(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid zone data'})
    });

    it('it should return 401 if creating a new zone without specified the storage code', async () => {
        const res = mockResponse()
        req.params = { codStorage: ""}

        req.body = {
            _temperature : 23.5,
            _coolingSystemStatus : "Active",
            _humidityLevel: 54,
            _corridorCodeList: ["009873", "178354"]
        }

        await generateZone(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid storage data'})
    });

    it('it should return 401 if creating a new zone without correct storage code', async () => {
        const res = mockResponse()
        req.params = { codStorage: "000123"}

        req.body = {
            _temperature : 23.5,
            _coolingSystemStatus : "Active",
            _humidityLevel: 54,
            _corridorCodeList: ["009873", "178354"]
        }

        await generateZone(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Storage not found'})
    });

    it('it should return 200 if the zone generation is successful', async () => {
        const res = mockResponse()
        req.params = { codStorage: "001548"}
        req.body = {
            _temperature : 23.5,
            _coolingSystemStatus : "Active",
            _humidityLevel: 54,
            _corridorCodeList: ["009873", "178354"]
        }

        await generateZone(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('it should return 200 and all zones of storage', async() => {
        const res = mockResponse()
        req.params = { codStorage: "001548" }
        await getAllZones(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code of storage does not exists or is not correct', async () => {
        const res = mockResponse()
        req.params = { codStorage: "000877" }

        await getAllZones(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Storage not found"})
    })

    it('it should return 200 and the zone with the code specified', async () => {
        const res = mockResponse()
        req.params = { codZone: "096523" }

        await getZoneByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code is wrong', async () => {
        const res = mockResponse()
        req.params = { codZone: "000877" }

        await getZoneByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Zone not found"})
    })

    it('it should return 401 if the code is not specified', async () => {
        const res = mockResponse()
        req.params = { codZone: "" }

        await getZoneByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid zone data"})
    })

    it('it should return 200 and the zone updated with a new data', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codZone: "096523"
            },
            body:{
                _name: "zone 1"
            }
        };

        await updateZoneByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if updating zone data without correct zone code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codZone: "0001877"
            }, body:{
                _name: "zone 1"
            }
        };

        await updateZoneByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Zone not found"})
    })

    it('it should return 401 if updating zone data without specified the zone code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codZone: ""
            }, body:{
                _name: "zone 1"
            }
        };
        await updateZoneByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid zone data"})
    })

});

module.exports = {zoneService}