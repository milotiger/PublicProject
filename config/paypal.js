let paypal = {};

paypal.configuration_live = {
    'mode': 'live',
    'client_id': '------',
    'client_secret': '------',
};

paypal.configuration_sandbox = {
    'mode': 'sandbox',
    'client_id': '------',
    'client_secret': '------',
};

paypal.invoice_json = {
    "merchant_info": {},
    "billing_info": [{
        "email": ""
    }],
    "items": [],
    "note": "Invoice for paying i20 fee",
    "payment_term": {
        "term_type": "NET_45"
    },
};

module.exports = paypal;