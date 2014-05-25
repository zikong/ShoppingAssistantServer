/**
 * Created by zikong on 14-5-23.
 */

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');

/* GET home page. */
module.exports = function(app) {

    //GET username=xxx
    app.get('/checkUsername', function(req, res) {
        if(!(req.query.username)) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }

        new User().getOne(req.query.username, function(err, user) {
            if (err) {
                return res.json({
                    code: 0,
                    msg: err.toString()
                });
            }
            if (user) {
                return res.json({
                    code: 1,
                    msg: '用户名已被使用',
                    isExist: true
                });
            }
            else {
                return res.json({
                    code: 1,
                    msg: '用户名未被使用',
                    isExist: false
                });
            }
        });
    });

    //POST username=xxx&password=xxx&email=xxx&name=xxx
    app.get('/register', function(req, res) {
        if (!(req.query.username && req.query.password && req.query.email && req.query.name)) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        var newUser = new User(req.query.username, req.query.password, req.query.email, req.query.name);
        newUser.getOne(req.query.username, function(err, user) {
            if (err) {
                return res.json({
                    code: 0,
                    msg: err.toString()
                });
            }
            if (user) {
                return res.json({
                    code: 1,
                    msg: '用户名已存在',
                    success: false
                });
            }

            newUser.save(function(err, user) {
                if(err) {
                    return res.json({
                        code: 0,
                        msg: err.toString()
                    });
                }
                return res.json({
                    code: 1,
                    msg: '注册成功',
                    success: true
                });
            })
        });
    });

};
