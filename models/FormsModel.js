let mongoose = require('mongoose');

let formSchema = new mongoose.Schema({
    KhamSucKhoe: {type: String, default: null},
    ChungMinhTaiChinh: {type: String, default: null}
});

let form = mongoose.model('GeneralForms',formSchema,'GeneralForms');

module.exports = {
    model: form
};
