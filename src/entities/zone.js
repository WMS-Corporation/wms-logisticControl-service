class Zone{
    constructor(temperature, coolingSystemStatus, humidityLevel, corridorList, codZone) {
        this._temperature = temperature;
        this._coolingSystemStatus = coolingSystemStatus;
        this._humidityLevel = humidityLevel;
        this._corridorList = corridorList;
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

    get corridorList() {
        return this._corridorList;
    }

    set corridorList(value) {
        this._corridorList = value;
    }

    get codZone() {
        return this._codZone;
    }

    set codZone(value) {
        this._codZone = value;
    }
}

module.exports = {Zone}