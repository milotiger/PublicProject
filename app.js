let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path');


app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');

//config
//app.use(require('./config/CORS'));

//middleware stack
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: false,
    parameterLimit: 1000000 }));

//route
app.use('/api', require('./route'));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/uploads'));

//for uploading
app.get('/up', function(req, res) {
    res.redirect('htmls/upload.html');
});

app.get('/', function(req, res) {
    res.redirect('index.html');
});

app.get('/dashboard/*', function(req, res) {
    res.sendFile(path.join(__dirname, './views', 'home.html'));
});

//Database
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||
    'mongodb://milotiger:quynhgiao97@ds021166.mlab.com:21166/masdoc';

mongoose.Promise = global.Promise;
mongoose.connect(uristring, function(err, res) {
    if (err) {
        console.log('ERROR connecting to: database' + '. ' + err);
    } else {
        console.log('Succeeded connected to: database');
    }
});

//Listen
var port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server Started on Port ' + port);
});


