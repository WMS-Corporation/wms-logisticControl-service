const {Zone} = require("../../src/entities/zone")
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../../src/config/dbConnection");
const {createZone} = require("../../src/repositories/zoneRepository");
describe('zoneRepository testing', () => {
    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_REPOSITORY);
    });

    beforeEach(async() => {
        await collections.zones.deleteMany()
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Zone.json');
        const zoneData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        await collections.zones.insertOne(zoneData)
    })
    afterAll(async () => {
        await closeDB()
    });

    it("should create a new zone", async ()  => {
        let corridorCodeList = [ "00140", "00144"]
        const result = await createZone(new Zone(26, "Active", 55, corridorCodeList, "125678"))
        expect(result).toBeDefined()
    })

});