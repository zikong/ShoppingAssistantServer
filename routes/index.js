/**
 * Created by zikong on 14-5-23.
 */

var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var fs = require('fs');

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

    //
    app.post('/avatar', function(req, res) {
        // 获得文件的临时路径
        var tmp_path = req.files.avatar.path;
        // 指定文件上传后的目录 - 示例为"images"目录。
        var target_path = './public/images/' + req.files.avatar.name;
        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
            if (err) {
                return res.json({
                    code: 0,
                    msg: err.toString()
                });
            }
            // 删除临时文件夹文件,
            fs.unlink(tmp_path, function(err) {
                if (err) throw err;
            });


        });
    });

    //GET username=xxx&password=xxx
    app.get('/login',function(req, res) {
        if (!(req.query.username && req.query.password)) {
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
            console.log(user);
            if (user && user.username === req.query.username && user.password === req.query.password) {
                return res.json({
                    code: 1,
                    msg: '登录成功',
                    login: true
                });
            }
            else {
                return res.json({
                    code: 1,
                    msg: '登录失败',
                    login: false
                });
            }
        });
    });

    //POST username=xxx&password=xxx&email=xxx&name=xxx
    app.get('/register', function(req, res) {
        if (!(req.query.username && req.query.password && req.query.email )) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        var newUser = new User(req.query.username, req.query.password, req.query.email);
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
