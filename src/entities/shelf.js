class Shelf{
    constructor(name, productCodeList, codShelf) {
        this._name = name;
        this._productCodeList = productCodeList;
        this._codShelf = codShelf;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get productCodeList() {
        return this._productCodeList;
    }

    set productCodeList(value) {
        this._productCodeList = value;
    }

    get codShelf() {
        return this._codShelf;
    }

    set codShelf(value) {
        this._codShelf = value;
    }
}

module.exports = {Shelf}