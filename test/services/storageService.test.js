const dotenv = require('dotenv')
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../../src/config/dbConnection");
const {generateStorage, getAll, getStorageByCode, updateStorageByCode, deleteStorageByCode} = require("../../src/services/storageService");

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

describe('Storage services testing', () => {

    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_SERVICES);
        await collections.storage.deleteMany()
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Storage.json');
        const storageData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        await collections.storage.insertOne(storageData)

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
        req.body = {
            _zoneCodeList: ""
        }

        await generateStorage(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid storage data'})
    });

    it('it should return 200 if the storage generation is successful', async () => {
        const res = mockResponse()
        req.body = {
            _zoneCodeList: [ "00020", "00024" ]
        }

        await generateStorage(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
    });

    it('it should return 200 and all storages that are stored', async() => {
        const res = mockResponse()

        await getAll(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 200 and the storage with the code specified', async () => {
        const res = mockResponse()
        req.params = { codStorage: "001549" }

        await getStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if the code is wrong', async () => {
        const res = mockResponse()
        req.params = { codStorage: "000877" }

        await getStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Storage not found"})
    })

    it('it should return 401 if the code is not specified', async () => {
        const res = mockResponse()
        req.params = { codStorage: "" }

        await getStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid storage data"})
    })

    it('it should return 200 and the storage updated with a new data', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: "001549"
            },
            body:{
                _zoneCodeList: [ "00120", "00124" ]
            }
        };

        await updateStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if updating storage data without correct storage code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: "000877"
            }, body:{
                _name: "storage 1"
            }
        };

        await updateStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Storage not found"})
    })

    it('it should return 401 if updating storage data without specified the storage code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: ""
            }, body:{
                _name: "storage 1"
            }
        };
        await updateStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid storage data"})
    })

    it('it should return 200 and the code of the storage that has been deleted', async () => {
        const res = mockResponse()
        const req = {
            body:{
                _zoneCodeList: [ "00021", "00124" ]
            }
        }
        await generateStorage(req, res)
        let counter = await collections?.counter?.findOne()
        let codStorage = ((counter.count) - 1).toString().padStart(6, '0')
        req.params = { codStorage: codStorage}
        await deleteStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if deleting storage without correct storage code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: "000977"
            }
        };

        await deleteStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Storage not found"})
    })

    it('it should return 401 if deleting storage without specified the storage code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: ""
            }
        };
        await deleteStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid storage data"})
    })
});