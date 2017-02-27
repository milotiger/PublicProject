let route = require('express').Router();
let ProfileModel = require('../../models/i20_Model').model;
let feesModel = require('../../models/FeesModel').model;
let jwt = require('../../helpers/jwt-helper');
let auth = require('../../helpers/auth-helper');

route.post('/hoc-ba/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (!data.FileUrl || !data.ThongTinTruong || !data.KetQua) {
        return res.status(400).json({message: "information missed!"});
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.HocBa = data;
        result.HocBa.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.HocBa);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/bang-tot-nghiep/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (!data.FileUrl || !data.NgayCapBang || !data.XepLoai) {
        return res.status(400).json({message: "information missed!"});
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.BangTotNghiep = data;
        result.BangTotNghiep.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.BangTotNghiep);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/hinh-ho-chieu/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (!data.FileUrl) {
        return res.status(400).json({message: "information missed!"});
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.HinhHoChieu = data;
        result.HinhHoChieu.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.HinhHoChieu);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/bang-tieng-anh/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (data.Valid) {
        if (!data.FileUrl || !data.LoaiBang || !data.NgayThi || !data.Diem) {
            return res.status(400).json({message: "information missed!"});
        }
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.BangTiengAnh = data;
        result.BangTiengAnh.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.BangTiengAnh);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/ho-chieu/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (!data.FileUrl || !data.SoHoChieu || !data.NgayCap || !data.NgayHetHan) {
        return res.status(400).json({message: "information missed!"});
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.HoChieu = data;
        result.HoChieu.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.HoChieu);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/chu-ky/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (!data.NguoiDangKy || !data.NguoiGiamHo) {
        return res.status(400).json({message: "information missed!"});
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.ChuKy = data;
        result.ChuKy.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.ChuKy);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/bieu-mau/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.BieuMau = data;
        result.BieuMau.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.BieuMau);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});

route.post('/truong/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let data = req.body;
    if (!data.Id || !data.TenTruong) {
        return res.status(400).json({message: "information missed!"});
    }
    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        result.Truong = data;
        result.Truong.TimeStamp = Date.now();
        result.save(function (err) {
            if (!err) {
                return res.json(result.Truong);
            } else {
                return res.status(400).json({message: err});
            }
        })
    })
});


route.post("/step/:id", function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;
    let Step = req.body.Step;

    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "Không tìm thấy hồ sơ."});
        }
        else {
            if (!result.Step)
                result.Step = 0;
            if (result.Step <= Step) {
                result.Step = Step;
                result.save(function (err, saved) {
                    if (!err) {
                        return res.json({message: "changed", step: saved.Step});
                    }
                    return res.status(400).json(err);
                });
            } else return res.json({message: "unchanged!"});
        }
    })
});

route.get('/step/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;

    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "Không tìm thấy hồ sơ."});
        }
        let Step = 0;
        if (result.Step)
            Step = result.Step;
        return res.json({step: Step});
    })
});

route.get('/user-profile/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;

    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        else res.json(result);
    })
});

route.get('/fees/:id', function (req, res) {
    if (!auth(req, res))
        return;

    let id = req.params.id;

    ProfileModel.findOne({_id: id}, function (err, result) {
        if (!result) {
            return res.status(400).json({message: "profile not found!"});
        }
        else {
            feesModel.findOne({Name: "I20"}, function (err2, result2) {
                result.Fees = result2.Fees;
                result.save(function (err3, saved) {
                    if (err3)
                        return res.status(400).json({message: err3});
                    else return res.json(saved.Fees);
                })
            })
        }
    })
});

module.exports = route;