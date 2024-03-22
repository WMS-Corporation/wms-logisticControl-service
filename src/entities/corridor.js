class Corridor{
    constructor(name, shelfCodeList, codCorridor) {
        this._name = name;
        this._shelfCodeList = shelfCodeList;
        this._codCorridor = codCorridor;

    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get shelfCodeList() {
        return this._shelfCodeList;
    }

    set shelfCodeList(value) {
        this._shelfCodeList = value;
    }

    get codCorridor() {
        return this._codCorridor;
    }

    set codCorridor(value) {
        this._codCorridor = value;
    }
}

module.exports = {Corridor}