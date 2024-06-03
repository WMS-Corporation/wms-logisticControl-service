const dotenv = require('dotenv')
const {describe, beforeEach, it, expect} = require('@jest/globals')
const {generateShelf, getAllShelfs, getShelfByCode, updateShelfByCode, deleteShelfByCode, productTransfer} = require("../../src/services/shelfService");
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
    params: "",
    headers: {
        authorization: 'Bearer some-token'
    }
}
const mockFetch = jest.fn().mockImplementation(async (url, requestOptions) => {
    const defaultResponse = {
        ok: true,
        json: async () => ({ someData: 'someValue' })
    }

    return Promise.resolve(defaultResponse);
})
global.fetch = mockFetch

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
            _name : ""
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request body. Please ensure all required fields are included and in the correct format.'})
    });

    it('it should return 401 if the name of shelf are invalid', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _name : "",
            _productList : ["001013"]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid shelf name'})
    });

    it('it should return 401 if creating a new shelf without specified the corridor code', async () => {
        const res = mockResponse()
        req.params = { codCorridor: ""}

        req.body = {
            _name : "Shelf 4",
            _productList : [{
                "_codProduct": "000234",
                "_stock": 20
            }]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid corridor data'})
    });

    it('it should return 401 if creating a new shelf without specified the product list', async () => {
        const res = mockResponse()
        req.params = { codCorridor: ""}

        req.body = {
            _name : "Shelf 4",
            _productList : [{
                "_codProduct": "000234",
                "_stock": 20
            }]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid corridor data'})
    });

    it('it should return 401 if creating a new shelf without specified the correct format of product list', async () => {
        const res = mockResponse()
        req.params = { codCorridor: ""}

        req.body = {
            _name : "Shelf 4",
            _productList : [
                 "000234"
            ]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid format of product list'})
    });

    it('it should return 401 if creating a new corridor without correct corridor code', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "0a1323"}

        req.body = {
            _name : "Shelf 4",
            _productList :  [{
                "_codProduct": "000234",
                "_stock": 20
            }]
        }

        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: 'Corridor not found'})
    });

    it('it should return 401 if the product is not defined', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _name : "Shelf 4",
            _productList :  [{
                "_codProduct": "000234",
                "_stock": 20
            }]
        }

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });
        await generateShelf(req, res)

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not defined.' });
    });

    it('it should return 200 if the shelf generation is successful', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _name : "Shelf 4",
            _productList :  [{
                "_codProduct": "000234",
                "_stock": 20
            }]
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
        req.params = { codShelf: "001023" }
        req.body = {_name: "Shelf 3"}

        await updateShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 200 and the shelf updated with a new product list', async () => {
        const res = mockResponse()
        req.params = { codShelf: "001023" }
        req.body = {_productList: [
                {
                    _codProduct: "001103",
                    _stock: 12
                }
            ]}

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

    it('it should return 401 if try to updating field that is not specified for the shelf ', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: "001023"
            }, body:{
                _names: "storage 1"
            }
        };
        await updateShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid request body. Please ensure all required fields are included and in the correct format."})
    })

    it('it should return 401 if try to updating shelf data with a new product that is not defined', async () => {
        const res = mockResponse()
        req.params = { codCorridor: "002024"}
        req.body = {
            _name : "Shelf 4",
            _productList :  [{
                "_codProduct": "000334",
                "_stock": 20
            }]
        }

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        });
        await updateShelfByCode(req, res)

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Product not defined.' });
    });

    it('it should return 200 if the product transfer operation is completed', async () => {
        const res = mockResponse()
        const req = {
            body:{
                _productList: [{
                    "_codProduct" : "000234",
                    "_from": null,
                    "_to": "001023",
                    "_quantity": 5
                }, {
                    "_codProduct" : "002123",
                    "_from": "001025",
                    "_to": null,
                    "_quantity": 5
                }]
            }
        };
        await productTransfer(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 200 and the code of the shelf that has been deleted', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: "001023"
            }
        }
        await deleteShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).not.toBeNull()
    })

    it('it should return 401 if deleting shelf without correct shelf code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: "0b0978"
            }
        };

        await deleteShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Shelf not found"})
    })

    it('it should return 401 if deleting shelf without specified the shelf code', async () => {
        const res = mockResponse()
        const req = {
            params: {
                codShelf: ""
            }
        };
        await deleteShelfByCode(req, res)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({message: "Invalid shelf data"})
    })

});

module.exports = {shelfService}