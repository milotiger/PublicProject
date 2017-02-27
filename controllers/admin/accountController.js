let router = require('express').Router();
let UserModel = require('../../models/UserModel').model;
let auth = require('../../helpers/auth-helper');

router.get('/all-accounts', (req, res) => {
      if (!auth(req, res, 3))
          return;

      UserModel.find({}, '-__v -activeAccountToken -Role', (err, result) => {
          if (err)
              return res.status(400).json(err);
          return res.json(result);
      })
});

router.put('/role/:account_id', (req, res) => {
    if (!auth(req, res, 3))
        return;

    let account_id = req.params.account_id;
    let Role = req.body.LoaiTaiKhoan;

    if (!Role || !account_id)
        return res.status(400).json({message: 'Information missed!'});

    UserModel.findOne({_id: account_id}, (err, result) =>{
        if (err)
            return res.status(400).json(err);
        if (result == null)
            return res.status(400).json({message: 'Account Not Found!'});
        result.LoaiTaiKhoan = Role;
        result.save(function (err, result) {
            if (err)
                return res.status(400).json(err);
            return res.json({status: 'success', result: result});
        })
    })
});

router.delete('/:account_id', (req, res)=>{
    if (!auth(req, res, 3))
        return;
    let account_id = req.params.account_id;

    UserModel.findOneAndRemove({_id: account_id},  (err, result) => {
        if (err)
            return res.status(400).json(err);
        return res.json({status: 'delete', result: result});
    })
});

module.exports = router;