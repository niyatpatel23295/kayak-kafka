var mysql = require("./mysql");
var fs = require('fs-extra');
var _ = require('lodash');
/**
 *
 * @param filter:{
 *
			@param	"city_id": city_id of city
			@param	"hotel_price": Array with [start, end] for example : [0,150] - to get rooms priced betwwen 0 to 150
			@param	"hotel_ratings": Decimal number for minimum rating for example : 8.60 will give hotels with ratings 8.60 or higher
			@param	"no_rooms" : minimun number of rooms required for example : 3 will return hotels having atleast 3 rooms available with matching criteria

 * }
 *
 *
 * Sample Request:
 * {
        "filter": {
				"city_id": 1,
				"hotel_price": [0,150],
				"hotel_ratings": 8.4,
				"no_rooms" : 3
		}
 * }
 *
 *
 * Sample Response:
 * {
    "message": "Success",
    "data": [
        {
            "hid": 1,
            "hotel_name": "Sheraton San Jose Hotel",
            "hotel_address": "Costa Rica",
            "zip_code": "95112",
            "hotel_stars": 5,
            "hotel_ratings": 8.9,
            "description": "Excellent city hotel. Easily accessible by car and close to shopping areas.",
            "cid": 1,
            "hotel_image": "/files/photos/default_hotel.png",
            "created": "2017-11-17T09:12:55.000Z",
            "modified": "2017-11-17T09:12:55.000Z",
            "rid": 1,
            "price": 100,
            "room_number": "101",
            "room_description": "2 Queen Beds 366-sq-foot (34-sq-meter) room with city views",
            "room_type": "Standard",
            "room_image": "/files/photos/default_room.png"
        },
        {
            "hid": 1,
            "hotel_name": "Sheraton San Jose Hotel",
            "hotel_address": "Costa Rica",
            "zip_code": "95112",
            "hotel_stars": 5,
            "hotel_ratings": 8.9,
            "description": "Excellent city hotel. Easily accessible by car and close to shopping areas.",
            "cid": 1,
            "hotel_image": "/files/photos/default_hotel.png",
            "created": "2017-11-17T09:14:42.000Z",
            "modified": "2017-11-17T09:14:42.000Z",
            "rid": 2,
            "price": 100,
            "room_number": "201",
            "room_description": "2 Queen Beds 366-sq-foot (34-sq-meter) room with city views Internet - Free WiFi and wired Internet access",
            "room_type": "Standard",
            "room_image": "/files/photos/default_room.png"
        },
        {
            "hid": 1,
            "hotel_name": "Sheraton San Jose Hotel",
            "hotel_address": "Costa Rica",
            "zip_code": "95112",
            "hotel_stars": 5,
            "hotel_ratings": 8.9,
            "description": "Excellent city hotel. Easily accessible by car and close to shopping areas.",
            "cid": 1,
            "hotel_image": "/files/photos/default_hotel.png",
            "created": "2017-11-17T09:15:17.000Z",
            "modified": "2017-11-17T09:15:17.000Z",
            "rid": 3,
            "price": 300,
            "room_number": "301",
            "room_description": "2 Queen Beds 366-sq-foot (34-sq-meter) room with city views",
            "room_type": "Premium",
            "room_image": "/files/photos/default_room.png"
        }
    ]
 * }
 *
 */
function handle_search_flights_request(msg, callback) {
    try {

        var filter = msg.filter;
        var Search_SQL = "";


        var basic_SQL       = "select * from flights where to_airport = " +filter.to_airport + " and from_airport= " +filter.from_airport +" " +
                                                " and DATE(departure) between date_sub(str_to_date('" +filter.departure_date +"','%Y-%m-%d'), interval " +filter.flex_days +" day) and date_add(str_to_date('" +filter.departure_date +"','%Y-%m-%d'), interval " +filter.flex_days +" day) " ;
        var class_filter    =  filter.flight_class ? " and class = '" +filter.flight_class +"' " : "" ;
        var order_by_filter = filter.order_by ? " order by " +filter.order_by[0]+ " " +filter.order_by[1] : " order by price asc" ;

        var Search_SQL = basic_SQL + class_filter + order_by_filter;

        mysql.executequery(Search_SQL, function (err, result) {
            if(err){

                console.log(err);
                callback(err, {})
            }
            else{
                callback(null, response);
            }
        })
    }
    catch (e) {
        console.log(e);
        callback(e, {});
    }
}

module.exports = {handle_search_flights_request};