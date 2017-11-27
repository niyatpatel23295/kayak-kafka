var mongo = require("./mongo");
var fs = require('fs-extra');

function handle_search_hotels_request(msg, callback) {
    try {
        console.log("In kakfa - handle_search_hotels_requests")
        mongo.connect(function (db) {
            var hotels_coll = db.collection('hotels');
            hotels_coll.find({}).toArray( function (err,result) {
                callback(null, result);
            });
        });
    }
    catch (e) {
        callback(e, {});
    }
}

module.exports = {handle_search_hotels_request};