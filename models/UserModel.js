let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    Email: { type: String, required: true},
    Password: { type: String, required: true},
    Provider: {type:String, default: 'local'},
    ProviderID: {type:String, default: 'null'},
    ProfileImage: {type: String},
    LoaiTaiKhoan: Number,
    HoTen: String,
    activeAccountToken : String,
    isActive : { type: Boolean, default : false },
    resetPasswordToken: String,
	resetPasswordExpires: Date,
    TimeCreated: {type: Number, default: 0},
    LastLogin: {type: Number, default: 0},
	Role : { type : Number, default : 0} // 0 : customer, -1 : Agency, 1 : Admin
});

let user = mongoose.model('Users',userSchema,'Users');

module.exports = {
    model: user
};
