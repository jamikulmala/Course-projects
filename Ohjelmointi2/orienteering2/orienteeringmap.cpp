#include "orienteeringmap.hh"
#include <vector>
#include <memory>
#include <iostream>
#include <algorithm>
#include <map>
#include <set>
#include <cmath>
#include <iomanip>

OrienteeringMap::OrienteeringMap():
    width_(0),height_(0),map_({}),points_({}),routes_({}),point_names_({})
{

}

OrienteeringMap::~OrienteeringMap()
{

}

void OrienteeringMap::set_map_size(int width, int height)
{
    width_ = width;
    height_ = height;
    for(int yy = 0;yy < height_;++yy){
        std::vector <std::shared_ptr<Point> > line;
        for(int xx = 0;xx < width_;++xx){
            // data structure is initialized with empty points
            std::shared_ptr <Point> point = nullptr;
            line.push_back(point);
            }
        map_.push_back(line);
        }
}

void OrienteeringMap::add_point(std::string name, int x, int y, int height, char marker)
{
    if(valid_point(name,x,y)){
        // if a point is valid, the empty point is being deleted and
        // the point is being added
        map_.at(y-1).at(x-1).reset();
        std::shared_ptr <Point> point = nullptr;
        point = std::make_shared<Point>(name,x,y,height,marker,this);
        map_.at(y-1).at(x-1) = point;
        update_points(point);
        }
}



bool OrienteeringMap::connect_route(std::string from, std::string to, std::string route_name)
{
    if(search_points(from,to)){
        if(routes_.find(route_name) == routes_.end()){
            // a new route is created from two points if the route is not found
            std::vector<std::string> sub = {from, to};
            routes_.insert({route_name,sub});
        }
    else{
        // elsewise a new point is added to route
        routes_.at(route_name).push_back(to);
        }
        return true;
    }
    return true;
}

void OrienteeringMap::print_map() const
{
    print_topbar();

    for(int y = 0; y < height_; ++y) {
        std::cout.width(2);
        std::cout << (y+1);
        for(int x = 0; x < width_; ++x) {
            // a dot is printed in place of an empty point
            if(map_.at(y).at(x) == nullptr){
               std::cout << "  .";
                }
            else{
                // and if a point is in the map its abbreviation is being printed
                std::cout << "  ";
                map_.at(y).at(x)->print_char();
                }
            }
        std::cout << std::endl;
        }
}


void OrienteeringMap::print_routes() const
{
    std::cout << "Routes:" << std::endl;
    for(auto& route : routes_){
        std::cout << " - " << route.first << std::endl;
        }
}

void OrienteeringMap::print_points() const
{
    // point names and their abbreviations are added to strcture
    // map to be able to print them alphabetically
    std::map<std::string, char> temp = {};
    for(auto& point : points_){
        if(temp.find(point->get_name()) == temp.end()){
            temp[point->get_name()] = point->get_char();
            }
        }
    // when the data structure is ready point info is being printed
    std::cout << "Points:" << std::endl;
    for(auto& pair : temp){
        std::cout << " - " << pair.first << " : " << pair.second << std::endl;
        }
}

void OrienteeringMap::print_route(const std::string &name) const
{
    // route and its points are added to data structure map
    std::map<std::string,std::vector<std::string>> temp = routes_;
    if(search_routes(name)){
        // styling the printout so that first point is seperated
        std::cout << temp.at(name)[0] << std::endl;
        temp.at(name).erase(temp.at(name).begin());
        for(auto& route : temp.at(name)){;
            std::cout << " -> " << route << std::endl;
            }
        }
}

// just here for the automatic tests, not finished
void OrienteeringMap::route_length(const std::string &name) const
{
    search_routes(name);
}

// just here for the automatic tests, not finished
void OrienteeringMap::greatest_rise(const std::string &point_name) const
{
    search_routes(point_name);
}

void OrienteeringMap::update_points(std::shared_ptr<Point> point)
{
    points_.push_back(point);
    point_names_.push_back(point->get_name());
}

bool OrienteeringMap::search_routes(const std::string &name) const
{
    if(routes_.find(name) == routes_.end()){
       std::cout << "Error: Route named " << name << " can't be found" << std::endl;
       return false;
       }
    return true;
}

bool OrienteeringMap::search_points(std::string first, std::string second)
{
    if(std::find(point_names_.begin(),point_names_.end(),first) != point_names_.end() &&
       std::find(point_names_.begin(),point_names_.end(),second) != point_names_.end()){
       return true;
        }
    else{
        return false;
        }
}

bool OrienteeringMap::valid_point(std::string name,int x,int y)
{
    if(x > width_ || y > height_){
        return false;
        }
    else if(std::find(point_names_.begin(),point_names_.end(),name) != point_names_.end()){
        return false;
        }
    return true;
}

void OrienteeringMap::print_topbar() const
{
    for(int x = 0; x < width_; ++x) {
        std::cout.width(2);
        if(x==0){
        std::cout << "   " << (x+1)  << " ";
            }
        else{
            std::cout << (x+1)  << " ";
            }
        }
    std::cout << std::endl;
}

