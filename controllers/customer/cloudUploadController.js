let multiparty = require('connect-multiparty');
let cloudinary = require('cloudinary');
let fs = require('fs');
let progress = require('progress-stream');
let multipartyMiddleware = multiparty({maxFilesSize: 1024 * 1024 * 1024});
let auth = require('../../helpers/auth-helper');

let s3fs = require('s3fs');
let s3Options = {
    accessKeyId: '-----------',
    secretAccessKey: 'Jgf/9mK//----------'
};
let s3fsImpl = new s3fs('--------', s3Options);


module.exports = function (router) {

    cloudinary.config({
        cloud_name: '-------',
        api_key: '--',
        api_secret: '--------'
    });

    router.use(multipartyMiddleware);

    router.post('/cloudinary', function(req, res) {
        console.log(req.files);
        let file = req.files.file;
        
        let stream = cloudinary.uploader.upload_stream(function(result) { res.json(result) });
        let rs = fs.createReadStream(file.path).pipe(stream);
    
        let currSize = 0;
        rs.on('data', function (data) {
            currSize += data.length;
            console.log(Math.round(currSize*100/file.size) + "%");
        })
    });

    router.post('/amazon', function (req, res) {
        let authData = auth(req, res);
        if (!authData)
            return;

        let file = req.files.file;
        let fileName = file.originalFilename;
        let relativePath = authData.data.Email + authData.data.Id + "/" + fileName;
        
        let stream = fs.createReadStream(file.path);

        s3fsImpl.writeFile(relativePath, stream, {ContentType: file.type}).then(function () {
            fs.unlink(file.path, function (err) {
                if (err)
                    console.log(err);
                let link = 'https://s3-ap-southeast-1.amazonaws.com/' + s3fsImpl.getPath(relativePath);
                res.json({message: 'success', fileName: fileName, url: link});
            })
        })
    });
};
