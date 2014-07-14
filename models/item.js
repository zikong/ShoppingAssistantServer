/**
 * Created by zikong on 14/6/9.
 */
var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Item(pname, pshortInfo, pPrice, pInfo, pCategory, pImage) {
    this.name = pname;
    this.shortInfo = pshortInfo;
    this.price = pPrice;
    this.info = pInfo;
    this.category = pCategory;
    this.image = pImage;
}

module.exports = Item;

Item.prototype.getOne = function(itemId, callback) {
    mongodb.open(function(error, db) {
        if (error) {
            return callback(error);
        }

        db.collection('items', function(error, collection) {
            if (error) {
                mongodb.close();
                return callback(error);
            }

            collection.findOne({_id:new ObjectID(itemId)}, function(error, item) {
                console.log(item);
                mongodb.close();
                if (error) {
                    return callback(error);
                }
                callback(null, item);
            });

        });
    });
};

Item.prototype.getWithCategory = function(categoryId, callback) {
    mongodb.open(function(error, db) {
        if (error) {
            return callback(error);
        }

        db.collection('items', function(error, collection) {
            if (error) {
                mongodb.close();
                return callback(error);
            }

            collection.find({"category": categoryId}).toArray(function (error, items) {
                mongodb.close();
                if (error) {
                    return callback(error);
                }
                callback(null, items);
            });
        });
    });
};

Item.prototype.add = function(callback) {
    var item = {
        name: this.name,
        shortInfo: this.shortInfo,
        price: this.price,
        info: this.info,
        category: this.category,
        image: this.image
    }

    //定义或读取一个users集合
    mongodb.open(function(error, db) {
        if (error) {
            return callback(error);
        }
        //读取users集合
        db.collection('items', function(error, collection) {
            if(error) {
                mongodb.close();
                return callback(error);
            }
            //插入user数据
            collection.insert(item, {safe: true}, function(error, items) {
                mongodb.close();
                if(error) {
                    return callback(error);
                }
                callback(null, items[0]);
            });
        });
    });
};