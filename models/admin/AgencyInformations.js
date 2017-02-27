var mongoose = require('mongoose');

var AgencyInformationsSchema = new mongoose.Schema({
	Address : { type : String, required : true, unique: true }, // Địa chỉ của đại lý
	Name : { type : String, required : true },
	Phone : { type : String, required : true},
	Represent : { type : mongoose.Schema.Types.ObjectId, required : true, ref : 'Users'} // Tài khoản đại diện cho Agency
});

module.exports = mongoose.model('AgencyInformations', AgencyInformationsSchema, 'AgencyInformations');