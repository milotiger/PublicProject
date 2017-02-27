"use strict";

let route = require('express').Router();
let md5 = require('js-md5');
let UserModel = require('../../models/UserModel').model;
let jwt = require('../../helpers/jwt-helper');
let mailHelper = require('../../helpers/mail-helper');
let async = require('async');
let crypto = require('crypto');

route.get('/', function(req, res) {
    res.json(true);
});

route.post('/register', function(req, res) {
    let newUser = req.body;
    if (!newUser.Email || !newUser.Password || !newUser.Role.toString() || !newUser.HoTen) {
        return res.status(400).json({ error: true, message: "Thông tin đăng ký thiếu." });
    }

    let hidePassword = '';

    for (let i = 0; i < newUser.Password.length; i++) {
        if (i < newUser.Password.length - 2)
            hidePassword += newUser.Password[i].replace(newUser.Password[i], "*");
        else hidePassword += newUser.Password[i];
    }

    newUser.Password = md5(newUser.Password);

    UserModel.findOne({ Email: newUser.Email }, function(err, result) {
        if (result) {
            return res.status(400).json({ error: true, message: "Email đã tồn tại." });
        } else {
            let newData = new UserModel(newUser); //tạo tài khoản mới

            newData.save(function(err, justSaved) {
                if (err) {
                    return res.status(400).json({ error: true, message: err });
                } else {
                    async.waterfall([
                            function(done) {
                                crypto.randomBytes(20, function(err, buf) {
                                    let token = buf.toString('hex');
                                    done(err, token);
                                });
                            },
                            function(token, done) {
                                justSaved.activeAccountToken = token;
                                justSaved.save(function(err) {
                                    let subject = 'MASDOC Verify Email';
                                    let text = 'Your Account has been created \n\n' +
                                        'Your email: ' + newData.Email + '\n\n' +
                                        'Your password: ' + hidePassword + '\n\n' +
                                        'Please click on the following link, or paste this into your browser to verify your email \n\n' +
                                        'http://' + req.headers.host + '/api/admin/auth/verify/' + token + '\n';
                                    mailHelper.sendMail(newData.Email, subject, text, done);
                                });
                            }
                        ],
                        function(err) {
                            if (err) res.status(401).json({ 'error': true });
                            else res.status(200).json({ 'error': false });
                        });
                }
            });
        }
    });
});

route.get('/verify/:token', function(req, res) {
    UserModel.findOneAndUpdate({ activeAccountToken: req.params.token, isActive: false }, { activeAccountToken: undefined, isActive: true }, function(err, user) {
        if (!user) {
            res.render('404');
        } else {
            res.render('verify');
        }
    });
});

route.get('/logout', function(req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1];
    if (!jwt.checkToken(token)) {
        return res.status(401).json({ message: "Invalid Token" });
    }
});

route.post('/login', function(req, res) {
    let logUser = req.body;
    let md5Pass = md5(logUser.Password);
    UserModel.findOne({ Email: logUser.Email, Password: md5Pass }, function(err, result) {
        if (!result) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không tồn tại." });
        } else {
            let token = jwt.getToken({ Email: result.Email, Id: result._id, HoTen: result.HoTen });
            return res.json({ message: "success", Id: result._id, HoTen: result.HoTen, token: token });
        }
    })
});

route.get('/check-login', function(req, res) {
    let token = "";
    if (req.headers.authorization)
        token = req.headers.authorization.split(' ')[1]; //get token
    let data = jwt.checkToken(token);
    if (!data) {
        res.status(401).json({ message: 'invalid token' });
    } else {
        res.json(data);
    }
});

route.route('/forgot')
    .post(function(req, res, next) {

        async.waterfall([
            function(done) {
                crypto.randomBytes(20, function(err, buf) {
                    let token = buf.toString('hex');
                    done(err, token);
                });
            },

            function(token, done) {
                UserModel.findOne({ 'Email': req.body.Email }, function(err, user) {
                    if (!user) {
                        return res.status(404).json({ 'message': 'No Account With That Email', 'error': true });
                    }

                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                        done(err, token, user);
                    });
                });
            },

            function(token, user, done) {
                let subject = 'MASDOC Reset Password';
                let text = 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/api/admin/auth/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                mailHelper.sendMail(user.Email, subject, text, done);
            }

        ], function(err, token) {
            if (err) return res.status(401).json({ 'error': true });
            else res.status(200).json({ 'error': false, 'token': token });
        });
    });

route.route('/reset/:token')
    .get(function(req, res) {
        UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                res.render('404');
            } else {
                res.render('reset');
            }
        });
    })
    .post(function(req, res) {
        async.waterfall([
            function(done) {
                UserModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                    if (!user) {
                        return res.status(404).json({ 'error': 'Password reset token is invalid or has expired' });
                    }

                    user.Password = md5(req.body.Password);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        done(err, user);
                    });
                });
            },

            function(user, done) {
                let subject = 'Your password has been changed';
                let text = 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.Email + ' has just been changed.\n';
                mailHelper.sendMail(user.Email, subject, text, done);
            }

        ], function(err) {
            if (!err) {
                res.status(200).json({ 'error': false, 'message': 'Password has been changed' });
            }
        });
    });

module.exports = route;
