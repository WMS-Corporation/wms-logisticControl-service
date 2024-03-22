class Corridor{
    constructor(name, shelfList, codCorridor) {
        this._name = name;
        this._shelfList = shelfList;
        this._codCorridor = codCorridor;

    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get shelfList() {
        return this._shelfList;
    }

    set shelfList(value) {
        this._shelfList = value;
    }

    get codCorridor() {
        return this._codCorridor;
    }

    set codCorridor(value) {
        this._codCorridor = value;
    }
}

module.exports = {Corridor}