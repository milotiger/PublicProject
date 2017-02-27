var mongoose = require('mongoose');

var AgencyDetailsSchema = new mongoose.Schema({
	EmployeeInfomation : { type : Schema.Types.ObjectId, ref : 'Users' };
	AgencyID : { type : mongoose.Schema.Types.ObjectId, ref : 'Agencies' };
});

module.exports = mongoose.model('AgencyDetails', AgencyDetailsSchema, 'AgencyDetails');