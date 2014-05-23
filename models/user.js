/**
 * Created by zikong on 14-5-24.
 */
var mongodb = require('./db');

function User(pUsername, pPassword, pEmail, pName) {
    this.username = pUsername;
    this.password = pPassword;
    this.email = pEmail;
    this.name = pName;
    this.likeList = new Array();
    this.avatarId = null;
    this.balance = 0.0;
}

module.exports = User;

User.prototype.save = function(callback) {

    var user = {
        username: this.username,
        password: this.password,
        email: this.email,
        name: this.name,
        likeList: this.likeList,
        avatarId: this.avatarId,
        balance: this.balance
    }

    //定义或读取一个users集合
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('users', function(err, collection) {
            if(err) {
                mongodb.close();
                return callback(err);
            }

            collection.insert(user, {safe: true}, function(err, users) {
                mongodb.close();
                if(err) {
                    return callback(err);
                }
                callback(null, users[0]);
            });
        });
    });
}