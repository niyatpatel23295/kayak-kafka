const bcrypt = require('bcrypt');
var mysql = require('./mysql');

function handle_signup_request(msg, callback) {
    var reqUsername = msg.email;
    var reqPassword = msg.password;

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(reqPassword, salt, function(err, hash){
        var getUser="select * from users where email='"+reqUsername+"';";
        console.log(getUser);
        mysql.executequery(getUser, function (err, result) {
                if(err){
                    console.log(err);
                    callback(err, {})
                }
                else{
                    console.log("in result");

                    if(result.length <= 0) {
                        console.log("creating new user");
                        var adduser = "insert into users (firstname,lastname,address,cid,zipcode,phone_number,email,profile_photo,card_id,password) values('" + msg.firstName + "','" + msg.lastName + "','" + msg.address + "','" + msg.city + "','" + msg.zipCode + "','" + msg.phoneNo + "','" + msg.email + "','" + msg.profilephoto + "','1','"+hash+"');";
                        console.log("Insert Query is:" + adduser);

                        mysql.executequery(adduser, function (err, result) {
                            if(err){
                                console.log(err);
                                callback(err, {})
                            }
                            else{
                                console.log("City added to the DB!");
                                callback(null, result);
                            }
                        })
                    }
                    else {
                        callback({"error": "User already exists... Try login instead!"}, false);
                    }

                }
        })
})})}




function handle_signup_request1(msg, callback){
    var salt = '';
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    var getUser="select * from user where username='"+reqUsername+"'";

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
                        //fs.mkdirsSync('./files/' + msg.username);
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
