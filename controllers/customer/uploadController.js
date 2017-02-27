let path = require('path');
let route = require('express').Router();
let formidable = require('formidable');
let fs = require('fs');
let mkdirp = require('mkdirp');
let jwt = require('../../helpers/jwt-helper');

route.post("/:profileId", function ( req, res) {
	let token = "";
	if (req.headers.authorization)
		token = req.headers.authorization.split(' ')[1];
	let tokenData = jwt.checkToken(token);
	if (!tokenData) {
		return res.status(401).json({message: "Invalid Token"});
	}

	let form = new formidable.IncomingForm();
	form.multiples = true;

	let mainFolder = path.dirname(module.parent.filename);

	let id = req.params.profileId + '-' + tokenData.data.Email;
	let link = "files/" + id + "/";

	mkdirp(mainFolder + '/uploads/files/' + id, function(err) {

		form.uploadDir = path.join(mainFolder + '/uploads/files/' + id);

		form.on('file' , function(field,file) {
			fs.rename(file.path , path.join(form.uploadDir, file.name));
			link = "/files/"	 + id + "/" + file.name;
		});

		form.on('end',function(){
			res.json({message: 'success', FileUrl: link});
		});

		form.parse(req);

	});
});


module.exports = route;