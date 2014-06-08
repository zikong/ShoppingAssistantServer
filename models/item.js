/**
 * Created by zikong on 14/6/9.
 */
var mongodb = require('./db');

function Item(pname, pshortInfo, pPrice, pInfo, pCategory, pImage) {
    this.name = pname;
    this.shortInfo = pshortInfo;
    this.price = pPrice;
    this.info = pInfo;
    this.category = pCategory;
    this.image = pImage;
}

module.exports = Item;

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

            collection.findOne({"category": categoryId}, function (error, item) {
                mongodb.close();
                if (error) {
                    return callback(error);
                }
                callback(null, item);
            });
        });
    });
};