/**
 * Created by zikong on 14-5-23.
 */

var express = require('express');
var router = express.Router();
//var crypto = require('crypto');
var User = require('../models/user.js');
var fs = require('fs');
var mongodb = require('../models/db.js');
var Category = require('../models/category.js');
var Item = require('../models/item.js');
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
            return response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        new User().getOne(request.query.username, function(error, user) {
            if (error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
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

    //返回商店所有商品的类目信息
    //GET
    app.get('/category', function(request, response) {
        new Category().get(function(error, categorys) {
            console.log("========= GET itemCategory :", categorys);
            if (error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            response.json({
                categorys: categorys
            });
        });
    });

    //根据categoryId返回商品信息
    //GET itemWithCategory?categoryId=xxx
    app.get('/itemWithCategory', function(request, response) {
        if (!request.query.categoryId) {
            response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        new Item().getWithCategory(request.query.categoryId, function(error, items) {
            console.log(items);
            if (error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            response.json({
                item: items
            });
        });
    });

    //返回商品图片
    //GET itemImage?itemId=xxx
    app.get('/itemImage', function(request, response) {
        if (!request.query.itemId) {
            return response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        var filename = request.query.itemId + '.png';
        var avatarPath = './itemimage/' + filename;
        response.sendfile(avatarPath);
    });

    //收藏商品
    //GET star?username=xxx&itemId=xxx
    app.get('/star', function(request, response) {
        if (!(request.query.itemId && request.query.username)) {
            return response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        new User().star(request.query.username, request.query.itemId, function(error) {
            if (error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            return response.json({
                code: 1,
                msg: '收藏成功'
            });
        });
    });

    //添加商品
    //GET addItem?name=xxx&shortInfo=xxx&price=xxx&info=xxx&category=xxx&image=xxx
    app.get('/addItem', function(request, response) {
        if (!(request.query.name && request.query.shortInfo && request.query.price && request.query.info && request.query.category && request.query.image)) {
            return response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }

        var newItem = new Item(request.query.name, request.query.shortInfo, request.query.price, request.query.info, request.query.category, request.query.image);
        newItem.add(function(error, item) {
            if(error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            console.log(item);
            return response.json({
                code: 1,
                msg: '添加成功'
            });

        });
    });

    //添加商品
    //GET item?itemId=xxx
    app.get('/item', function(request, response) {
        if (!request.query.itemId) {
            return response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }

        new Item().getOne(request.query.itemId, function(error, item) {
            if(error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            console.log(item);
            return response.json(item);

        });
    });

    app.get('/pay', function(request, response) {
        new Item().getWithCategory("5394b8c4f7f12c598a91ecb3", function(error, items){
            if(error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            console.log(items);
            return response.json({
                item: items
            });
        });
    });

    //GET payMoney?username=xxx&price=xxx
    app.get('/payMoney',function(request, response) {
        if (!(request.query.price && request.query.username)) {
            return response.json({
                code: 0,
                msg: '参数信息不完整'
            });
        }
        var price = parseFloat(request.query.price);
        new User().payMoney(request.query.username, price, function(error) {
            if(error) {
                return response.json({
                    code: 0,
                    msg: error.toString()
                });
            }
            return response.json({
                code: 1,
                msg: '支付成功'
            });
        });

    });

};
