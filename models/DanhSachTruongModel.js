var mongoose = require('mongoose');

var schoolSchema = new mongoose.Schema({
    TieuBang: String,
    LoaiTruong: String,
    TenTruong: String,
    MaTruong: String,
    Nganh: Array,
    BieuMau: { type : String, required : true, default: null },
    MauKhamSucKhoe: { type : String, default: null },
    ChungMinhTaiChinh: { type : String, default: null }
});

var school = mongoose.model('DanhSachTruong',schoolSchema,'DanhSachTruong');

module.exports = {
    model: school
};
