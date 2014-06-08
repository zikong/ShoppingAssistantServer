/**
 * Created by zikong on 14-5-24.
 */
var mongodb = require('./db');

function User(pUsername, pPassword, pEmail) {
    this.username = pUsername;
    this.password = pPassword;
    this.email = pEmail;
    this.likeList = new Array();
    this.avatar = undefined;
    this.balance = 0.0;
}

module.exports = User;

//存储用户信息到数据库
User.prototype.save = function(callback) {

    var user = {
        username: this.username,
        password: this.password,
        email: this.email,
        likeList: this.likeList,
        avatar: this.avatar,
        balance: this.balance
    }

    //定义或读取一个users集合
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        //读取users集合
        db.collection('users', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }
            //插入user数据
            collection.insert(user, {safe: true}, function(err, users) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, users[0]);
            });
        });
    });
};

//从数据库读取用户信息
User.prototype.getOne = function(username, callback) {
      mongodb.open(function(err, db) {
          if (err) {
              return callback(err);
          }

          db.collection('users', function(err, collection) {
              if (err) {
                  mongodb.close();
                  return callback(err);
              }

              collection.findOne({
                  username: username
              }, function(err, user) {
                  mongodb.close();
                  if (err) {
                      return callback(err);
                  }
                  callback(null, user);
              })
          })
      })
};

User.prototype.update = function(username, callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

        })
    });
};

