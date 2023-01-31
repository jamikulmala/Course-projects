// Datastructures.hh
//
// Student name: Jami Kulmala
// Student email: jami.kulmala@tuni.fi
// Student number: 150425043

#ifndef DATASTRUCTURES_HH
#define DATASTRUCTURES_HH

#include <string>
#include <vector>
#include <tuple>
#include <utility>
#include <limits>
#include <functional>
#include <exception>
#include <map>
#include <deque>

// Types for IDs
using StationID = std::string;
using TrainID = std::string;
using RegionID = unsigned long long int;
using Name = std::string;
using Time = unsigned short int;

// Return values for cases where required thing was not found
StationID const NO_STATION = "---";
TrainID const NO_TRAIN = "---";
RegionID const NO_REGION = -1;
Name const NO_NAME = "!NO_NAME!";
Time const NO_TIME = 9999;

// Return value for cases where integer values were not found
int const NO_VALUE = std::numeric_limits<int>::min();


// Type for a coordinate (x, y)
struct Coord
{
    int x = NO_VALUE;
    int y = NO_VALUE;
};

// Example: Defining == and hash function for Coord so that it can be used
// as key for std::unordered_map/set, if needed
inline bool operator==(Coord c1, Coord c2) { return c1.x == c2.x && c1.y == c2.y; }
inline bool operator!=(Coord c1, Coord c2) { return !(c1==c2); } // Not strictly necessary

struct CoordHash
{
    std::size_t operator()(Coord xy) const
    {
        auto hasher = std::hash<int>();
        auto xhash = hasher(xy.x);
        auto yhash = hasher(xy.y);
        // Combine hash values (magic!)
        return xhash ^ (yhash + 0x9e3779b9 + (xhash << 6) + (xhash >> 2));
    }
};

// Example: Defining < for Coord so that it can be used
// as key for std::map/set
inline bool operator<(Coord c1, Coord c2)
{
    if (c1.y < c2.y) { return true; }
    else if (c2.y < c1.y) { return false; }
    else { return c1.x < c2.x; }
}

// Return value for cases where coordinates were not found
Coord const NO_COORD = {NO_VALUE, NO_VALUE};

// Type for a distance (in metres)
using Distance = int;

// Return value for cases where Distance is unknown
Distance const NO_DISTANCE = NO_VALUE;

// This exception class is there just so that the user interface can notify
// about operations which are not (yet) implemented
class NotImplemented : public std::exception
{
public:
    NotImplemented() : msg_{} {}
    explicit NotImplemented(std::string const& msg) : msg_{msg + " not implemented"} {}

    virtual const char* what() const noexcept override
    {
        return msg_.c_str();
    }
private:
    std::string msg_;
};


// This is the class you are supposed to implement

class Datastructures
{
public:
    Datastructures();
    ~Datastructures();

    // Estimate of performance: O(1)
    // Short rationale for estimate: funktio kutsuu map:in metodia size(), jonka tehokkuus on vakio
    unsigned int station_count();

    // Estimate of performance: O(n)
    // Short rationale for estimate: kutsuu metodeja clear mapille ja vectorille, jotka ovat tehokkuudeltaan lineaarisia
    void clear_all();

    // Estimate of performance: O(n)
    // Short rationale for estimate: yksi for-loop, jonka tehokkuus on lineaarinen
    std::vector<StationID> all_stations();

    // Estimate of performance: O(n)
    // Short rationale for estimate: unordered_map:in find operaation tehokkuus on pahimmassa tapauksessa lineaarinen, muuten toiminnot vakioita
    bool add_station(StationID id, Name const& name, Coord xy);

    // Estimate of performance: O(n)
    // Short rationale for estimate: unordered_map:in find operaation tehokkuus on pahimmassa tapauksessa lineaarinen, muuten toiminnot vakioita
    Name get_station_name(StationID id);

    // Estimate of performance: O(n)
    // Short rationale for estimate: unordered_map:in find operaation tehokkuus on pahimmassa tapauksessa lineaarinen, muuten toiminnot vakioita
    Coord get_station_coordinates(StationID id);

    // Estimate of performance: O(n^2 log n)
    // Short rationale for estimate: for-loopin tehokkuus on lineaarinen ja for loopissa suoritetaan operaatio
    // joka kutsuu metodeja insert, jonka tehokkuus on lineaarinen ja upperbound, jonka tehokkuus on logaritminen
    std::vector<StationID> stations_alphabetically();

    // Estimate of performance: O(n log n)
    // Short rationale for estimate: sisältää kaksi erillistä for loopia ja tehokkuudeltaan linearitmisen operaation sort
    std::vector<StationID> stations_distance_increasing();

    // Estimate of performance: O(n)
    // Short rationale for estimate: yksi for loop, joka pahimmassa tapauksessa ei löydä koordinaatteja
    StationID find_station_with_coord(Coord xy);

    // Estimate of performance: O(n)
    // Short rationale for estimate: unordered_map:in find operaation tehokkuus on pahimmassa tapauksessa lineaarinen, muuten toiminnot vakioita
    bool change_station_coord(StationID id, Coord newcoord);

    // Estimate of performance: O(n^2)
    // Short rationale for estimate: yksi for loop, joka pahimmassa tapauksessa käy kaikkiläpi
    // ja sen sisällä vectorin find metodi, joka pahimmillan lineaarinen, muuten vakio
    bool add_departure(StationID stationid, TrainID trainid, Time time);

    // Estimate of performance: O(n)
    // Short rationale for estimate: unordered_mapin metodi find(O(n)), vectorin metodi find(O(n)) ja vektorin metodi erase(O(n))
    bool remove_departure(StationID stationid, TrainID trainid, Time time);

    // Estimate of performance: O(n log n)
    // Short rationale for estimate: unordered_mapin metodi find(O(n)), yksi for loop(O(n) ja vectorin metodi sort(O(n log n))
    std::vector<std::pair<Time, TrainID>> station_departures_after(StationID stationid, Time time);

    // Estimate of performance: O(n)
    // Short rationale for estimate: vectorin metodi find lineaarinen, muut vakiota
    bool add_region(RegionID id, Name const& name, std::vector<Coord> coords);

    // Estimate of performance: O(n)
    // Short rationale for estimate: yksi for loop, joka käy tietorakenteen loppuun
    std::vector<RegionID> all_regions();

    // Estimate of performance: O(n)
    // Short rationale for estimate: yksi for loop, joka pahimmillaan lineaarinen
    Name get_region_name(RegionID id);

    // Estimate of performance: O(n)
    // Short rationale for estimate: yksi for loop, joka pahimmillaan lineaarinen
    std::vector<Coord> get_region_coords(RegionID id);

    // Estimate of performance: O(n log n)
    // Short rationale for estimate: toteuttaa kaksi find operaatiota, joilla O(n log n)
    // ja muut operaatiot vakioita
    bool add_subregion_to_region(RegionID id, RegionID parentid);

    // Estimate of performance: O(n)
    // Short rationale for estimate: toteuttaa findin unordered_mapille(O(n)) ja vectorille(O(n))
    // muut vakioita
    bool add_station_to_region(StationID id, RegionID parentid);

    // Estimate of performance: O(n)
    // Short rationale for estimate: kutsuu mapin metodia find ja rekursiivista funktiota
    // get_all_regions, joka on lineaarinen
    std::vector<RegionID> station_in_regions(StationID id);

    // Non-compulsory operations

    // Estimate of performance: O(n)
    // Short rationale for estimate: kutsuu vectorin metodia find ja rekursiivista funktiota
    // list_all_sub_regions, joka on lineaarinen
    std::vector<RegionID> all_subregions_of_region(RegionID id);

    // Estimate of performance: O(n^2)
    // Short rationale for estimate: yksi for loop ja kutsuu rekursiivista funktiota closest_station, jolla O(n^2)
    std::vector<StationID> stations_closest_to(Coord xy);

    // Estimate of performance:O(n)
    // Short rationale for estimate: kutsuu metodeja find(O(n)) ja erase(O(log n) unordered_mapille
    bool remove_station(StationID id);

    // Estimate of performance: O(n)
    // Short rationale for estimate: Molemmille parametreille, kutsutaan O(n) operaatio findia ja
    // funktiota O(1) find_parent. Sekä funktio kutsuu O(n) funktiotiota find_common
    RegionID common_parent_of_regions(RegionID id1, RegionID id2);

private:
    struct Region;
    struct Station;

    struct Region
    {
        RegionID id = 0;
        Name name = "";
        std::vector<Coord> coords = {};
        std::vector<Region*> subregions = {};
        Region* parent = nullptr;
        std::vector<StationID> stations = {};
    };

    struct Station
    {
        StationID id = "";
        Name name = "";
        Coord coords = {};
        std::unordered_map<TrainID, Time> departures = {};
        RegionID region = 0;
    };


    std::unordered_map<StationID,Station> stations = {};
    std::vector<Region> regions = {};
    static bool compare_coords(Station a, Station b);
    static bool compare_departures(std::pair <Time, TrainID> one, std::pair <Time, TrainID> two);
    std::vector<RegionID> get_all_regions(std::vector<RegionID> result, RegionID id);
    std::vector<RegionID> list_all_sub_regions(std::vector<RegionID> result,std::deque<Region> items);
    std::vector<StationID> closest_station(std::vector<StationID> result,std::vector<Station> from, Coord coords, int size);
    std::vector<RegionID> find_parents(Region region, std::vector<RegionID> parents);
    std::vector<RegionID> find_common(std::vector<RegionID> parents1,std::vector<RegionID> parents2, std::vector<RegionID> result);


};

#endif // DATASTRUCTURES_HH
