var mysql = require("./mysql");
var fs = require('fs-extra');
var _ = require('lodash');

function handle_search_flights_request(msg, callback) {
    try {

        var filter = msg.filter;
        var Search_SQL = "";


        var basic_SQL       = "select fid, flight_name, departure, arrival, class, fair, duration, to1.airport as to_airport, from1.airport as from_airport from flights " +
                                " inner join airports as to1  on to1.apid = flights.to_airport " +
                                " inner join airports as from1  on from1.apid = flights.from_airport " + 
                                " where to_airport in (select apid from airports where airport like '" +filter.to_airport +"') " + " and from_airport in (select apid from airports " + " where airport like '" +filter.from_airport +"') " +" " +
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
                result.to_airport = filter.to_airport;
                result.from_airport = filter.from_airport;
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