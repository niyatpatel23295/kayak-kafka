var mysql = require("./mysql");
var fs = require('fs-extra');

function handle_search_cars_request(msg, callback) {
    try {

        var filter = msg.filter;
        var Search_SQL = "";


        var basic_SQL       = "select * from cars where cid in ( select cid from city where city_name like '" +filter.city_name + "') " ;
        var price_filter    = filter.price ? " and price between " +filter.price[0] +" and " +filter.price[1] : "";
        var passanger_filter= filter.no_passangers ? " and no_passangers >=  " + filter.no_passangers : ""; 
        var bags_filter     = filter.no_largebags ? " and no_largebags >=  " + filter.no_largebags : "";
        var class_filter    =  filter.car_class   ? " and car_class like " + filter.car_class : "";
        var order_by_filter = filter.order_by ? " order by " +filter.order_by[0]+ " " +filter.order_by[1] : " order by price asc" ;

        var Search_SQL = basic_SQL + price_filter + passanger_filter + bags_filter + class_filter + order_by_filter;

        mysql.executequery(Search_SQL, function (err, result) {
            if(err){
                console.log(err);
                callback(err, {})
            }
            else{
                callback(null, result);
            }
        })
    }
    catch (e) {
        console.log(e);
        callback(e, {});
    }
}

module.exports = {handle_search_cars_request};