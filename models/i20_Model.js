let mongoose = require('mongoose');

let i20Schema = new mongoose.Schema({
    UserId: String,
    isCheck: {type: Boolean, default: false},
    AdminNote: [String],
    HocBa: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        FileUrl: String,
        FileEngUrl: String,
        ThongTinTruong: {
            TenTruong: String,
            NamTotNghiep: Number,
            DiaChi: {
                SoNha: String,
                ThanhPho: String,
                QuocGia: String
            },
            Check: Boolean,
            Note: String
        },
        KetQua: {
            Lop10: {
                HocLuc: String,
                HanhKiem: String,
                DiemToan: Number
            },
            Lop11: {
                HocLuc: String,
                HanhKiem: String,
                DiemToan: Number
            },
            Lop12: {
                HocLuc: String,
                HanhKiem: String,
                DiemToan: Number
            },
            Check: Boolean,
            Note: String
        }
    },
    BangTotNghiep: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        FileUrl: String,
        FileEngUrl: String,
        NgayCapBang: String,
        XepLoai: String,
        Check: Boolean,
        Note: String
    },
    BangTiengAnh: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        Valid: Boolean,
        TimeStamp: String,
        FileUrl: String,
        LoaiBang: String,
        NgayThi: String,
        Diem: {
            DiemTong: Number,
            Nghe: Number,
            Noi: Number,
            Doc: Number,
            Viet: Number
        },
        Check: Boolean,
        Note: String
    },
    HoChieu: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        FileUrl: String,
        SoHoChieu: String,
        NgayCap: String,
        NgayHetHan: String,
        Check: Boolean,
        Note: String
    },
    HinhHoChieu: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        FileUrl: String,
        Check: Boolean,
        Note: String
    },
    ChuKy: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        NguoiDangKy: String,
        NguoiGiamHo: String,
        Check: Boolean,
        Note: String
    },
    BieuMau: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        CMTCTruong: String,
        CMTCNganHang: String,
        KSKTruong: String,
        KSKBenhVien: String,
        Check: Boolean,
        Note: String
    },
    Truong: {
        isCheck: {type: Boolean, default: false},
        AdminNote: [String],
        TimeStamp: String,
        Id: String,
        TenTruong: String,
        Nganh1: String,
        Nganh2: String,
        Check: Boolean,
        Note: String
    },
    Fees: Array,
    Invoices: Array,
    Step: Number
});

let profile = mongoose.model('I20', i20Schema,'I20');

module.exports = {
    model: profile
};
