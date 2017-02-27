let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    UserId: String,
    HoTen: {
        Ho: String,
        ChuLot: String,
        Ten: String
    },
    GioiTinh: Boolean,
    NgaySinh: String,
    NoiSinh: {
        ThanhPho: String,
        QuocGia: String
    },
    QuocTich: String,
    DiaChi: {
        SoNha: String,
        ThanhPho: String,
        QuocGia: String
    },
    SoDienThoai: String,
    Email: String,
    NguoiGiamHo: {
        HoTen: {
            Ho: String,
            Ten: String,
            ChuLot: String
        },
        QuanHe: String,
        DiaChi: {
            SoNha: String,
            ThanhPho: String,
            QuocGia: String
        },
        SoDienThoai: String,
        Email: String
    },
    isCheck: {type: Boolean, default: false}
});

let ThongTin = mongoose.model('ThongTinCaNhan',userSchema,'ThongTinCaNhan');

module.exports = {
    model: ThongTin
};