let route = require('express').Router();
let path = require('path');

route.use('/upload', require('./controllers/customer/uploadController'));

let upload = require('express').Router();
require('./controllers/customer/cloudUploadController')(upload);
route.use('/cloud-upload', upload);

route.use('/auth', require('./controllers/customer/authController'));
route.use('/personal', require('./controllers/customer/ThongTinController'));
route.use('/profile', require('./controllers/customer/i20_Controller'));
route.use('/helper', require('./controllers/helper/helper_apis'));
route.use('/service', require('./controllers/customer/serviceController'));
route.use('/paypal', require('./controllers/customer/paypalController'));
route.use('/admin', require('./controllers/admin/adminRouter'));

module.exports = route;