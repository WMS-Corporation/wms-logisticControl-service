const dotenv = require('dotenv')
const {generateStorage, getAll, getStorageByCode, updateStorageByCode, deleteStorageByCode} = require("../../src/services/storageService");
const {describe, beforeEach, it, expect} = require('@jest/globals')
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

const storageService = () => describe('Storage testing', () => {

    beforeEach(async() => {
        req.body = ""
        req.user = ""
        req.params = ""
    })

    it('it should return 401 if the body data are invalid', async () => {
        const res = mockResponse()
        req.params = { codZone: "096723"}
        req.body = {
            _names : "",
            _zoneCodeList : ["001023"]
        }

        await generateStorage(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request body. Please ensure all required fields are included and in the correct format.'})
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
                _zoneCodeList: ["098764", "123457"]
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
                _zoneCodeList: ["098764", "123457"]
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
                _zoneCodeList: ["098764", "123457"]
            }
        };
        await updateStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid storage data"})
    })

    it('it should return 401 if try to updating field that is not specified for the storage ', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: "001549"
            }, body:{
                _name: "storage 1"
            }
        };
        await updateStorageByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid request body. Please ensure all required fields are included and in the correct format."})
    })

    it('it should return 200 and the code of the storage that has been deleted', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codStorage: "001549"
            }
        }
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

module.exports = {storageService}