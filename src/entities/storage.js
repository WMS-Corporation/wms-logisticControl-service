class Storage{
    constructor(zoneList, codStorage) {
        this._codStorage = codStorage
        this._zoneList = zoneList
    }

    get zoneList() {
        return this._zoneList;
    }

    set zoneList(value) {
        this._zoneList = value;
    }

    get codStorage() {
        return this._codStorage;
    }

    set codStorage(value) {
        this._codStorage = value;
    }
}

module.exports = {Storage}