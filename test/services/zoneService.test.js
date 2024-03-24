const dotenv = require('dotenv')
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../../src/config/dbConnection");
const {generateZone, getAllZones} = require("../../src/services/zoneService");

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

describe('Zone services testing', () => {

    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_SERVICES);
        const jsonFilePathStorage = path.resolve(__dirname, '../Resources/MongoDB/WMS.Storage.json');
        const storageData =  JSON.parse(fs.readFileSync(jsonFilePathStorage, 'utf-8'));
        if(!(await collections.storage.findOne({_codStorage: storageData[1]._codStorage}))){
            await collections.storage.insertOne(storageData[1])
        }

        const jsonFilePathZone = path.resolve(__dirname, '../Resources/MongoDB/WMS.Zone.json');
        const zoneData = JSON.parse(fs.readFileSync(jsonFilePathZone, 'utf-8'));
        await collections.zones.insertOne(zoneData)
    });

    beforeEach(async() => {
        req.body = ""
        req.user = ""
        req.params = ""
    })

    afterAll(async () => {
        await closeDB()
    });

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

});