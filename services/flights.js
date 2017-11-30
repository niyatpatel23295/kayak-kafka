var mysql = require("./mysql");
var fs = require('fs-extra');
var _ = require('lodash');

function handle_search_flights_request(msg, callback) {
    try {

        var filter = msg.filter;
        var Search_SQL = "";


        var basic_SQL       = "select * from flights where to_airport = " +filter.to_airport + " and from_airport= " +filter.from_airport +" " +
                                                " and DATE(departure) between date_sub(str_to_date('" +filter.departure_date +"','%Y-%m-%d'), interval " +filter.flex_days +" day) and date_add(str_to_date('" +filter.departure_date +"','%Y-%m-%d'), interval " +filter.flex_days +" day) " ;
        var class_filter    =  filter.flight_class ? " and class = '" +filter.flight_class +"' " : "" ;
        var order_by_filter = filter.order_by ? " order by " +filter.order_by[0]+ " " +filter.order_by[1] : " order by fair asc" ;

        var Search_SQL = basic_SQL + class_filter + order_by_filter;

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

module.exports = {handle_search_flights_request};