/* COMP.CS.110 Ohjelmointi 2: Rakenteet / Programming 2: Structures
 * Project3: Suunnistus / Orienteering
 *
 * Module: Point
 *
 * a single point and its information and methods
 *
 * Jami Kulmala
 * jami.kulmala@tuni.fi
 * 150425043
 * */

#ifndef POINT_HH
#define POINT_HH

#include <string>
#include <vector>

class OrienteeringMap;

class Point
{
public:
    // constructor
    Point(std::string name, int x, int y, int height, char abb, OrienteeringMap* map);
    // prints the abbreviation of the point for map to use
    void print_char();
    // returns the name of the point
    std::string get_name();
    // returns x cordinate of the point
    int get_x();
    // returns y cordinate of the point
    int get_y();
    // returns height of the point
    int get_height();
    // returns abbreviation of the point
    char get_char();

private:
    // name of the point
    std::string name_;
    // x cordinate of the point
    int x_;
    // y cordinate of the point
    int y_;
    // height of the point
    int height_;
    // abbreviation of the point
    char abb_;
    // reference to datastructure map_
    OrienteeringMap* map_;
};

#endif // POINT_HH
