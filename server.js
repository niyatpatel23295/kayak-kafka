var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var hotels = require('./services/hotels');
var flights = require('./services/flights');

var consumer_hotel = connection.getConsumer('hotel_topic');
var consumer_flight = connection.getConsumer('flight_topic');

var producer = connection.getProducer();


consumer_hotel.on('message', function (message) {


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

                producer.send(payloads, function(err, data){});
                return;
            }

        });
    }
    else if(message.key == 'search_hotels'){
        var data = JSON.parse(message.value);

        try {
            hotels.handle_search_hotels_request(data.data, function(err, res){
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

                    producer.send(payloads, function(err, data){});
                    return;
                }

            });
        }
        catch(e){
            console.log(e);
        }

    }
});

consumer_flight.on('message', function (message) {

    if(message.key == 'search_flights'){
        var data = JSON.parse(message.value);

        try {
            flights.handle_search_flights_request(data.data, function(err, res){
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

                    producer.send(payloads, function(err, data){});
                    return;
                }

            });
        }
        catch(e){
            console.log(e);
        }

    }
})

