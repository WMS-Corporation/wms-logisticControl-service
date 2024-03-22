class Storage{
    constructor(zoneCodeList, codStorage) {
        this._codStorage = codStorage
        this._zoneCodeList = zoneCodeList
    }

    get zoneCodeList() {
        return this._zoneCodeList;
    }

    set zoneCodeList(value) {
        this._zoneCodeList = value;
    }

    get codStorage() {
        return this._codStorage;
    }

    set codStorage(value) {
        this._codStorage = value;
    }
}

module.exports = {Storage}