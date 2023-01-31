/* COMP.CS.110 Ohjelmointi 2: Rakenteet / Programming 2: Structures
 * Project3: Suunnistus / Orienteering
 *
 * Module: OrienteeringMap
 *
 * contains data structures for map, points and routes and methods to handle the data.
 *
 * Jami Kulmala
 * jami.kulmala@tuni.fi
 * 150425043
 * */

#ifndef ORIENTEERINGMAP_HH
#define ORIENTEERINGMAP_HH

#include <string>
#include "point.hh"
#include <vector>
#include <memory>
#include <map>
#include <tuple>

class OrienteeringMap
{
public:
    // Constructor and destructor
    OrienteeringMap();
    ~OrienteeringMap();

    // Sets the width and height for the map.
    void set_map_size(int width, int height);

    // Adds a new point in the map, with the given name, position (x and y
    // coordinates), height and marker.
    void add_point(std::string name, int x, int y, int height, char marker);

    // Connects two existing points such that the point 'to' will be
    // immediately after the point 'from' in the route 'route_name'.
    // The given route can be either a new or an existing one,
    // if it already exists, the connection between points will be
    // updated in the aforementioned way.
    // Returns true, if connection was successful, i.e. if both the points
    // exist, otherwise returns false.
    bool connect_route(std::string from,
                       std::string to,
                       std::string route_name);

    // Prints the map.
    void print_map() const;

    // Prints all routes' names, ordered alphabetically.
    void print_routes() const;

    // Prints all points' names and their markers on the map.
    void print_points() const;

    // Prints points belonging to the given route in the order they are
    // in the route.
    void print_route(const std::string& name) const;

    // Prints the given route's combined length,
    // the length is counted as a sum of the distances of adjacent points.
    void route_length(const std::string& name) const;

    // Finds and prints the highest rise in any of the routes after the given
    // point.
    void greatest_rise(const std::string& point_name) const;

private:
    // width of the orienteering map to be printed and used
    int width_;

    // height of the orienteering map to be printed and used
    int height_;

    // all the points and their locations in the system.
    std::vector<std::vector<std::shared_ptr<Point>>> map_;

    // all points in the system
    std::vector<std::shared_ptr<Point>> points_;

    // all routes in the system
    std::map<std::string,std::vector<std::string>> routes_;

    // contains all the names of the points
    std::vector<std::string> point_names_;

    // updates structures points_ and point_names_ when a point is added
    void update_points(std::shared_ptr<Point> point);

    // Checks if the given route can be found.
    // returns true if route is found. false if not
    bool search_routes(const std::string &name) const;

    // Checks if the given points can be found.
    // return true if points are found. false if not
    bool search_points(std::string first, std::string second);

    // checks whether the point to be added is within
    // map limits and that it's not already added
    // returns true if point is valid. false if not.
    bool valid_point(std::string name, int x, int y);

    // prints the topbar of the map
    void print_topbar() const;
};

#endif // ORIENTEERINGMAP_HH

