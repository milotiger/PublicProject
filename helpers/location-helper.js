let NodeGeocoder = require('node-geocoder');

let options = {
    provider: 'google',

    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyBRBHbCmwwf4R6HjsZ72uajmZrp5u_DWhc',
    formatter: null // 'gpx', 'string', ... 
};

module.exports = {
    getDistance: (address1, address2) => {
        let geocoder = NodeGeocoder(options);

        let p1 = new Promise((resolve, reject) => {
            geocoder.geocode(address1, function(err, res) {
                let data = {
                    latitude: res[0].latitude,
                    longitude: res[0].longitude
                };
                resolve(data);
            });
        });

        let p2 = new Promise((resolve, reject) => {
            geocoder.geocode(address2, function(err, res) {
                let data = {
                    latitude: res[0].latitude,
                    longitude: res[0].longitude
                };
                resolve(data);
            });
        });

        return Promise.all([p1, p2]);
    }
}
