/**
 * Created by zikong on 14-5-23.
 */

var express = require('express');
var router = express.Router();
//var crypto = require('crypto');
var User = require('../models/user.js');
var fs = require('fs');
var mongodb = require('../models/db.js');
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

    //avatar 上传头像
    app.post('/avatar', function(req, res) {
        console.log(req.body, req.files);
        if(!(req.body.username && req.files.image)) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        // 获得文件的临时路径
        var tmp_path = req.files.image.path;
        console.log(tmp_path);
        // 指定文件上传后的目录
        var filename = 'avatar_' + req.query.username + '.png';
        var target_path = './avatars/' + filename;
        // 移动文件
        console.log(target_path);
        fs.rename(tmp_path, target_path, function(err) {
            if (err) {
                return res.json({
                    code: 0,
                    msg: err.toString()
                });
            }
            mongodb.open(function(err, db) {
                if (err) {
                    return res.json({
                        code: 0,
                        msg: err.toString()
                    });
                }
                //读取users集合
                db.collection('users', function(err, collection) {
                    if(err) {
                        mongodb.close();
                        return res.json({
                            code: 0,
                            msg: err.toString()
                        });
                    }
                    //插入user数据
                    collection.update({username : req.body.username}, {$set:{avatar:filename}}, function(err) {
                        if (err) {
                            return res.json({
                                code: 0,
                                msg: err.toString()
                            });
                        }
                        return res.json({
                            code: 1,
                            msg: '文件上传成功'
                        });
                    });
                });
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

    //GET username=xxx&password=xxx&email=xxx&name=xxx
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

    //GET avatar?username=xxx
    app.get('/avatar', function(request, response) {
        if (!request.query.username) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        var filename = 'avatar_' + request.query.username + '.png';
        var avatarPath = './avatars/' + filename;
        response.sendfile(avatarPath);
    });

    //GET userinfo?username=xxx
    app.get('/userinfo', function(request, response) {
        if (!request.query.username) {
            return res.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        new User().getOne(request.query.username, function(error, user) {
            if (error) {
                return res.json({
                    code: 0,
                    msg: '参数信息不完整'
                });
            }
            response.json({
                username: user.username,
                email: user.email,
                likeList: user.likeList,
                avatar: user.avatar,
                balance: user.balance
            });
        });
    });

};
