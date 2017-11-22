var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');


var consumer_hotel = connection.getConsumer('hotel_topic');

var producer = connection.getProducer();


consumer_hotel.on('message', function (message) {
    console.log('backend server js consumer_hotel: on ', JSON.stringify(message));
    var data = JSON.parse(message.value);
    if(message.key == 'login_api'){
        login.handle_login_request(data.data, function(err,res){
            if(err){
                console.log(err);
                producer.send({error: err}, function(err, data){
                   
                });
                return;
            }
            else{
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                
                producer.send(payloads, function(err, data){
                    
                });
                return;
            }
        });
    }
    else if(message.key == 'signup_api'){
        console.log("Some other request");
        console.log('backend server js consumer_signup: on ', JSON.stringify(message));
        var data = JSON.parse(message.value);
        signup.handle_signup_request(data.data, function(err, res){
            if(err){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : {error: err}
                        }),
                        partition : 0
                    }
                ];
                console.log('err');
                producer.send(payloads, function(err, res){});
                return;
            }
            else{
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                console.log(payloads)
                producer.send(payloads, function(err, data){});
                return;
            }

        });
    }
});


