let service = {};

service.checkI20Item = function (profileItem) {
    return !(profileItem != 'HocBa' &&
            profileItem != 'BangTotNghiep' &&
            profileItem != 'BangTiengAnh' &&
            profileItem != 'HoChieu' &&
            profileItem != 'HinhHoChieu' &&
            profileItem != 'ChuKy' &&
            profileItem != 'BieuMau' &&
            profileItem != 'Truong' &&
            profileItem != 'Main')
};

service.checkProperties = function (obj, properties_array) {
    for (let i = 0; i < properties_array.length; ++i)
    {
        if (!obj.hasOwnProperty(properties_array[i] || !obj[properties_array[i]]))
            return false;
    }
    return true;
};

service.validateEmail = function (email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

module.exports = service;