/**
 * Created by zikong on 14-5-24.
 */
var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Collection,
    Server = require('mongodb').Server

module.exports = new Db(settings.db, new Server(settings.host, 27017), {safe: true});


