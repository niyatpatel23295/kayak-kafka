var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/kayak";
const crypto = require('crypto');

function handle_login_request(msg, callback){
    crypto.randomBytes(256, function(err, buffer){
        if(err) {}
        else{
            try {
                mongo.connect(mongoURL, function(){

                    var coll = mongo.collection('creds');

                    coll.findOne({username: msg.username}, function(err, user){
                        if(err){
                            console.log(err);
                        }
                        if (user) {

                            // create salt
                            var salt = user.salt

                            // create hash from salt
                            var hash = crypto.createHmac('sha512', salt);
                            hash.update(msg.password);

                            //update hash by password
                            var password_hash = hash.digest('hex');

                            try {
                                mongo.connect(mongoURL, function(){

                                    var coll = mongo.collection('creds');

                                    coll.findOne({username: msg.username, password: password_hash}, function(err, user){
                                        if(err){
                                            console.log(err);
                                        }
                                        if (user) {
                                            user.password = undefined;
                                            console.log("user",user);
                                            var activity = [];
                                            if(user.activity && user.activity.length > 0){
                                                user.activity.forEach(function(item, index){
                                                    activity.push(item.message)
                                                })
                                            }

                                            callback(null, user);

                                        } else {
                                            console.log('incorrect password')
                                            callback(null, false);
                                        }
                                    });
                                });
                            }
                            catch (e){
                                callback(e,{});
                            }

                        } else {
                            console.log('user not found')
                            callback(null, false);
                        }
                    });
                });
            }
            catch (e){
                callback(e,{});
            }



        }
    });

}

exports.handle_login_request = handle_login_request;