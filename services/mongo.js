var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var url = "mongodb://ec2-54-153-9-233.us-west-1.compute.amazonaws.com:27017/kayak";

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(callback){
    MongoClient.connect(url, {poolSize: 50},  function(err, _db){
      if (err) { throw new Error('Could not connect: '+err); }
      db = _db;
      connected = true;
      console.log(connected +" is connected?");
      callback(db);
    });
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
      throw new Error('Must connect to Mongo before calling "collection"');
    } 
    return db.collection(name);
  
};