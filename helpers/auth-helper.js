let jwt = require('./jwt-helper');

function auth_helper(req, res, requireRole = 0) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];

    let data  = jwt.checkToken(token);

    console.log(data);

    if (!data) {
        res.status(401).json({message: "Invalid Token"});
        return false;
    }

    if (requireRole > data.LoaiTaiKhoan) {
        res.status(401).json({message: "You do not have the right to access!"});
        return false;
    }


    else return data;
}

module.exports = auth_helper;