const obj = {
    mapped2Json: function (map, data) {
        var result = {}
        for (var key in map) {
            var value = map[key]

            if (typeof value === 'object') {
                result[key] = obj.mapped2Json(value, data[key])
            } else {
                result[value] = data[key]
            }
        }
        return result;
    }
}

module.exports = obj;