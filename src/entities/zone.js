class Zone{
    constructor(temperature, coolingSystemStatus, humidityLevel, corridorCodeList, codZone) {
        this._temperature = temperature;
        this._coolingSystemStatus = coolingSystemStatus;
        this._humidityLevel = humidityLevel;
        this._corridorCodeList = corridorCodeList;
        this._codZone = codZone;
    }

    get temperature() {
        return this._temperature;
    }

    set temperature(value) {
        this._temperature = value;
    }

    get coolingSystemStatus() {
        return this._coolingSystemStatus;
    }

    set coolingSystemStatus(value) {
        this._coolingSystemStatus = value;
    }

    get humidityLevel() {
        return this._humidityLevel;
    }

    set humidityLevel(value) {
        this._humidityLevel = value;
    }

    get corridorCodeList() {
        return this._corridorCodeList;
    }

    set corridorCodeList(value) {
        this._corridorCodeList = value;
    }

    get codZone() {
        return this._codZone;
    }

    set codZone(value) {
        this._codZone = value;
    }
}

module.exports = {Zone}