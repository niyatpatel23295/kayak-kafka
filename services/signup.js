var mongo = require("./mongo");
var fs = require('fs-extra');
var fs_native = require('fs');
const crypto = require('crypto');

function handle_signup_request(msg, callback){
    var salt = '';
    crypto.randomBytes(256, function(err, buffer){
        if(err) {}
        else{
            // create salt
            var salt = buffer.toString('hex');
            
            // create hash from salt
            var hash = crypto.createHmac('sha512', salt);
            hash.update(msg.password);
            
            //update hash by password
            var password_hash = hash.digest('hex');

            try {
                console.log('Mark 1 - before mondo data insert');
                mongo.connect(function(){
                    var collection = mongo.collection('creds')
                    collection.insertOne({
                        firstname: msg.firstname,
                        lastname: msg.lastname,
                        email: msg.email,
                        username: msg.username,
                        password: password_hash,
                        salt: salt
                    }).then(function(result){
                        fs.mkdirsSync('./files/' + msg.username);
                        callback(null, result.ops[0]);
                    }).
                    catch(function(e){
                        callback({"error": "User already exists... Try login instead!"}, false);
                    });
                });
            }
            catch (e){
                callback(e,{});
            }

        }
    });

}

exports.handle_signup_request = handle_signup_request;