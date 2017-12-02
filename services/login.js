const bcrypt = require('bcrypt');
var mysql = require('./mysql');

function handle_login_request(msg, callback){
    try {

        var reqUsername = msg.email;
        var reqPassword = msg.password;

        var getUser = "select * from users where email='" + reqUsername + "';";
        console.log("Query is:" + getUser);

        mysql.executequery(getUser, function (err, results) {
            if(err){
                console.log(err);
                callback(err, {})
            }
            else{

                if (results.length > 0) {

                    var hashedPassword = results[0].password;
                    bcrypt.compare(reqPassword, hashedPassword, function(err, result) {
                        if (err) {
                            console.log('bcrypt - error - ', err);
                            callback(err, {});
                        } else {
                            console.log('bcrypt - result - ', result);
                    console.log("User authenticated!");
                    callback(null, result);
                }
                });
                }
                else {
                    console.log('incorrect password')
                    callback(null, false);
                }
            }
        });
    }
    catch (e) {
        console.log('incorrect password')
        callback(null, false);
    }

}

exports.handle_login_request = handle_login_request;


function handle_login_request1(msg, callback){
    crypto.randomBytes(256, function(err, buffer){
        if(err) {}
        else{
            try {
                mongo.connect(function(){

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
