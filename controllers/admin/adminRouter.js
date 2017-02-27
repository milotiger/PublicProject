let route = require('express').Router();

route.use('/auth', require('./authController'));
route.use('/services', require('./serviceController'));
route.use('/i20', require('./i20_Controller'));
route.use('/personal', require('./ThongTinController'));
route.use('/manage', require('./manageController'));
route.use('/account', require('./accountController'));
route.use('/fee', require('./feeController'));
route.use('/paypal', require('./paypalController'));

module.exports = route;