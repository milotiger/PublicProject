let mongoose = require('mongoose');

let serviceSchema = new mongoose.Schema({
	agencyID : {type : String, ref: 'Users', default: null}, //Agency quản lý hồ sơ này
	//employeeID : { type : String, required : true, unique : true }, sau này sẽ dùng
	userID : { type : String, required : true, ref: 'Users'},
	serviceType : { type : Number, required : true }, //0: I20
	serviceName : { type : String, required : true }, //Tên: I20 Du Học,v.v.v
	profileID: { type : String, required : true, ref: 'I20'}, //object ID của hồ sơ tương ứng
	stage : { type : String, required : true }, //Trạng thái của hồ sơ
	TimeStamp : { type : Number, required : true }, //thời gian update gần nhất
	AdminStep: {type: Number, default: 0},
	StepTracking: [{
		Step: {type: Number, default: 0},
		TimeStamp: {type: Number, default: Date.now()}
	}]
});

module.exports = {model: mongoose.model('Services', serviceSchema, 'Services')};