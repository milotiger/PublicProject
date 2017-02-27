let mongoose = require('mongoose');

let PaypalSchema = new mongoose.Schema({
    email: String,
    first_name: String,
    last_name: String,
    business_name: String,
    phone: {
        country_code: Number,
        national_number: Number,
    },
    address: {
        line1: String,
        city: String,
        state: String,
        postal_code: Number,
        country_code: String
    },
    client_id: {type: String, required: true},
    client_secret: {type: String, required: true}
});

module.exports = {model: mongoose.model('PaypalInformation', PaypalSchema, 'PaypalInformation')};