class Shelf{
    constructor(name, productList, codShelf) {
        this._name = name;
        this._productList = productList;
        this._codShelf = codShelf;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get productList() {
        return this._productList;
    }

    set productList(value) {
        this._productList = value;
    }

    get codShelf() {
        return this._codShelf;
    }

    set codShelf(value) {
        this._codShelf = value;
    }
}

module.exports = {Shelf}