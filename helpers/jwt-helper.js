var key = "milotiger";
var jwt = require('jsonwebtoken');

var helper = {};

helper.getToken = function (data) {
    return jwt.sign(data, key, { expiresIn: '7 days'});
};

helper.checkToken = function (token) {
    try {
        var decoded = jwt.verify(token, key);
        decoded.now = Math.floor(Date.now()/1000);
        return {valid: true, data: decoded};
    } catch(err) {
        return false;
    }
};

module.exports = helper;