var mongoose = require('mongoose');

var feesSchema = new mongoose.Schema({
    Name: { type: String, required: true, unique: true },
    Fees: { type: Array, required: true }
});

var fees = mongoose.model('Fees',feesSchema,'Fees');

module.exports = {
    model: fees
};
