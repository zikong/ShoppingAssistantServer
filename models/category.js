/**
 * Created by zikong on 14/6/9.
 */
var mongodb = require('./db');

function Category(pname) {
    this.name = pname;
}

module.exports = Category;

Category.prototype.get = function(callback) {
    mongodb.open(function(error, db) {
        if (error) {
            return callback(error);
        }

        db.collection('categorys', function(error, collection) {
            if (error) {
                mongodb.close();
                return callback(error);
            }

            collection.find({}).toArray(function (error, categorys) {
                mongodb.close();
                if (error) {
                    return callback(error);
                }
                callback(null, categorys);
            });
        });
    });
};

