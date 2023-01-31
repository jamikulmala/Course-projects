#include "point.hh"
#include <string>
#include <iostream>
#include <memory>

Point::Point(std::string name, int x, int y, int height, char abb, OrienteeringMap *map):
    name_(name),x_(x),y_(y),height_(height),abb_(abb),map_(map)
{

}

void Point::print_char()
{
    std::cout<< abb_;
}

std::string Point::get_name()
{
    return name_;
}

int Point::get_x()
{
    return x_;
}

int Point::get_y()
{
    return y_;
}

int Point::get_height()
{
    return height_;
}

char Point::get_char()
{
    return abb_;
}
