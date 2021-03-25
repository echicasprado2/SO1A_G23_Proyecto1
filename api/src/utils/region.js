
const getRegion = (location) => {
    switch(location) {
        case "Alta Verapaz":
            return "Verapaz"
        case "Baja Verapaz":
            return "Verapaz"
        case "Chimaltenago":
            return "Central"
        case "Chiquimula":
            return "Nororiente"
        case "El Progreso":
            return "Nororiente"
        case "Escuintla":
            return "Central"
        case "Guatemala":
            return "Metropolitana"
        case "Huehuetenango":
            return "Noroccidente"
        case "Izabal":
            return "Nororiente"
        case "Jalapa":
            return "Suroriente"
        case "Jutiapa":
            return "Suroriente"
        case "Peten":
            return "Peten"
        case "Quetzaltenango":
            return "Suroccidente"
        case "Quiche":
            return "Noroccidente"
        case "Retalhuleu":
            return "Suroccidente"
        case "Sacatepequez":
            return "Central"
        case "San Marcos":
            return "Suroccidente"
        case "Santa Rosa":
            return "Suroriente"
        case "Solola":
            return "Suroccidente"
        case "Suchitepequez":
            return "Suroccidente"
        case "Totonicapan":
            return "Suroccidente"
        case "Zacapa":
            return "Nororiente"
    }
}

module.exports = getRegion