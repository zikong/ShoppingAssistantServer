/**
 * Created by zikong on 14-5-23.
 */

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');

/* GET home page. */
module.exports = function(app) {

    //POST username=xxx&password=xxx&email=xxx&name=xxx
    app.get('/register', function(req, res) {
        console.log(req.query.username);
        if (!(req.query.username && req.query.password && req.query.email && req.query.name)) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }

        var user = new User(req.query.username, req.query.password, req.query.email, req.query.name);
        user.save(function(err, user) {
            if(err) {
                return res.json({
                    code: 0,
                    msg: err.toString()
                });
            }
            return res.json({
                code: 1,
                msg: '注册成功'
            });
        })
    });

};
