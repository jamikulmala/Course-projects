// Datastructures.cc
//
// Student name: Jami Kulmala
// Student email: jami.kulmala@tuni.fi
// Student number: 150425043

#include "datastructures.hh"

#include <random>

#include <cmath>

std::minstd_rand rand_engine; // Reasonably quick pseudo-random generator

template <typename Type>
Type random_in_range(Type start, Type end)
{
    auto range = end-start;
    ++range;

    auto num = std::uniform_int_distribution<unsigned long int>(0, range-1)(rand_engine);

    return static_cast<Type>(start+num);
}

Datastructures::Datastructures()
{

}

Datastructures::~Datastructures()
{

}

/**
 * @brief calculates stations size by using map.size()
 * @return station count
 */
unsigned int Datastructures::station_count()
{
    return stations.size();
}

/**
 * @brief clears stations and regions
 */
void Datastructures::clear_all()
{
    stations.clear();
    regions.clear();
}

/**
 * @brief gets all station ids
 * @return stations ids
 */
std::vector<StationID> Datastructures::all_stations()
{
    std::vector<StationID> ids = {};
    for(auto& id : stations){
        ids.push_back(id.first);
    }
    return ids;
}

/**
 * @brief adds station to datastructure
 * @param id station id
 * @param name station name
 * @param xy coords
 * @return true or false
 */
bool Datastructures::add_station(StationID id, const Name& name, Coord xy)
{
    Station station;
    station.id = id;
    station.name = name;
    station.coords = xy;
    auto it = stations.find(id);
    if(it == stations.end()){
        stations[station.id] = station;
        return true;
    }
    else{
        return false;
    }

}

/**
 * @brief gets station name by finding right element by id
 * @param id station id
 * @return station name or no name
 */
Name Datastructures::get_station_name(StationID id)
{
    auto station_id = stations.find(id);
    if(station_id != stations.end()){
        return station_id->second.name;
    }
    else{
        return NO_NAME;
    }
}

/**
 * @brief gets station coords by finding right element by id
 * @param id station id
 * @return coords or no coord
 */
Coord Datastructures::get_station_coordinates(StationID id)
{
    auto station_id = stations.find(id);
    if(station_id != stations.end()){
        return station_id->second.coords;
    }
    else{
        return NO_COORD;
    }
}

/**
 * @brief lists stations alphabetically by sorting it and doing temp vector
 * @return station ids alphabetically
 */
std::vector<StationID> Datastructures::stations_alphabetically()
{
    std::vector<StationID> ids_alpha= {};
    ids_alpha.reserve(stations.size());
    for(auto& id : stations){
        ids_alpha.insert(std::upper_bound(std::begin(ids_alpha),std::end(ids_alpha),id.second.name),id.first);
    }
    return ids_alpha;
}

/**
 * @brief lists sattions by distance
 * @return stations by distance
 */
std::vector<StationID> Datastructures::stations_distance_increasing()
{
    std::vector<Station> temp = {};
    temp.reserve(stations.size());
    for(auto& i : stations){
        temp.push_back(i.second);
    }

    std::sort(std::begin(temp), std::end(temp),compare_coords);
    std::vector<StationID> ids_coords = {};
    ids_coords.reserve(stations.size());
    for(auto& id : temp){
        ids_coords.push_back(id.id);
    }
    return ids_coords;
}

/**
 * @brief finds station with given coords
 * @param xy coords
 * @return station id or no station
 */
StationID Datastructures::find_station_with_coord(Coord xy)
{
    for(auto& station : stations){
        if(station.second.coords == xy){
            return station.first;
        }
    }
    return NO_STATION;
}

/**
 * @brief changes station coords by returning false or true
 * @param id station id
 * @param newcoord new coords
 * @return true or false
 */
bool Datastructures::change_station_coord(StationID id, Coord newcoord)
{
    auto station_id = stations.find(id);
    if(station_id != stations.end()){
        station_id->second.coords = newcoord;
        return true;
    }
    else{
        return false;
    }
}

/**
 * @brief adds departure to station
 * @param stationid station id
 * @param trainid id of the train
 * @param time departure time
 * @return true or false
 */
bool Datastructures::add_departure(StationID stationid, TrainID trainid, Time time)
{
    for(auto& station : stations){
        if(station.first == stationid && station.second.departures.find(trainid)
            == station.second.departures.end()){
                station.second.departures[trainid] = time;
                return true;
        }
    }
    return false;
}

/**
 * @brief removes departure from station
 * @param stationid station id
 * @param trainid id of the train
 * @param time departure time
 * @return true or false
 */
bool Datastructures::remove_departure(StationID stationid, TrainID trainid, Time time)
{
    auto station = stations.find(stationid);
    if(station != stations.end()){
        auto index = station->second.departures.find(trainid);
        if(index != station->second.departures.end()){
            station->second.departures.erase(index);
            return true;
        }
    }
    return false;
}

/**
 * @brief lists departures after given time
 * @param stationid station id
 * @param time given time
 * @return departures after or empty
 */
std::vector<std::pair<Time, TrainID>> Datastructures::station_departures_after(StationID stationid, Time time)
{
    std::vector<std::pair<Time, TrainID>> departures = {};
    auto station = stations.find(stationid);
    if(station != stations.end()){
            for(auto departure : station->second.departures){
                if(departure.second >= time){
                    std::pair <Time, TrainID> dep;
                    dep = std::make_pair(departure.second,departure.first);
                    departures.push_back(dep);
                }
            }
            std::sort(std::begin(departures),std::end(departures),compare_departures);
            return departures;
        }
    std::vector<std::pair<Time, TrainID>> nothing = {{NO_TIME,NO_TRAIN}};
    return nothing;
}

/**
 * @brief adds region to data structure
 * @param id of region
 * @param &name name of region
 * @param coords coords of region
 * @return true or false
 */
bool Datastructures::add_region(RegionID id, const Name &name, std::vector<Coord> coords)
{
    Region region;
    region.id = id;
    region.name = name;
    region.coords = coords;
    auto it = std::find_if(std::begin(regions),std::end(regions),
        [id](Region region){return region.id == id;});
    if(it == regions.end()){
        regions.push_back(region);
        return true;
    }
    else{
        return false;
    }
}

/**
 * @brief lists all regions does simple operations to be able to accmoplish this
 * @return ids of all regions
 */
std::vector<RegionID> Datastructures::all_regions()
{
    std::vector<RegionID> ids = {};
    ids.reserve(regions.size());
    for(auto& id : regions){
        ids.push_back(id.id);
    }
    return ids;
}

/**
 * @brief gets region name by id
 * @param id region id
 * @return region name or no name
 */
Name Datastructures::get_region_name(RegionID id)
{
    for(auto& region : regions){
        if(region.id == id){
            return region.name;
        }
    }
    return NO_NAME;
}

/**
 * @brief gets region coords by id
 * @param id region id
 * @return region coords or no coords
 */
std::vector<Coord> Datastructures::get_region_coords(RegionID id)
{
    for(auto& reg : regions){
        if(reg.id == id){
            return reg.coords;
        }
    }
    return {NO_COORD};
}

/**
 * @brief adds subregion to region
 * @param id region id
 * @param parentid region to be added to
 * @return true or false
 */
bool Datastructures::add_subregion_to_region(RegionID id, RegionID parentid)
{
    auto region = std::find_if(std::begin(regions),std::end(regions),[id](Region find){return find.id == id;});
    auto parent = std::find_if(std::begin(regions),std::end(regions),[parentid](Region find){return find.id == parentid;});
    if(region != regions.end() && parent != regions.end() && region->parent == nullptr){
        region->parent = &regions[std::distance(regions.begin(),parent)];
        parent->subregions.push_back(&regions[std::distance(regions.begin(),region)]);
        return true;
    }
    return false;
}

/**
 * @brief adds station to region
 * @param id station id
 * @param parentid region to be added to
 * @return true or false
 */
bool Datastructures::add_station_to_region(StationID id, RegionID parentid)
{
    auto station = stations.find(id);
    auto region = std::find_if(std::begin(regions),std::end(regions),[parentid](Region find){return find.id == parentid;});
    if(station != stations.end() && region != regions.end() && station->second.region == 0){
        station->second.region = parentid;
        region->stations.push_back(id);
        return true;
    }
    return false;
}

/**
 * @brief gets stations inside region
 * @param id station id
 * @return stations or nothing
 */
std::vector<RegionID> Datastructures::station_in_regions(StationID id)
{
    std::vector<RegionID> station_regions = {};
    auto station = stations.find(id);
        if(station != stations.end()){
            if(station->second.region != 0){
                station_regions.push_back(station->second.region);
                return get_all_regions(station_regions,station->second.region);
            }
            else{
                return station_regions;
            }
        }
        else{
            std::vector<RegionID> nothing = {NO_REGION};
            return nothing;
    }
}

/**
 * @brief lists subregions of region
 * @param id region id of wanted
 * @return all regions or nothing
 */
std::vector<RegionID> Datastructures::all_subregions_of_region(RegionID id)
{
    std::vector<RegionID> empty = {};
    auto region = std::find_if(std::begin(regions),std::end(regions),[id](Region find){return find.id == id;});
        if(region != regions.end()){
            return list_all_sub_regions({},{*region});
        }
        else{
            std::vector<RegionID> nothing = {NO_REGION};
            return nothing;
    }
}

/**
 * @brief gets stations closest to given coord
 * @param xy coords of spot
 * @return stationids or nothing
 */
std::vector<StationID> Datastructures::stations_closest_to(Coord xy)
{
    std::vector<StationID> closest_stations = {};
    std::vector<Station> stations_copy = {};
    stations_copy.reserve(stations.size());
    for(auto& i : stations){
        stations_copy.push_back(i.second);
    }
    if(stations_copy.size() == 0){
        return closest_stations;
    }
    else if(stations_copy.size() == 1){
        return closest_station(closest_stations,stations_copy,xy,1);
    }
    else if(stations_copy.size() == 2){
        return closest_station(closest_stations,stations_copy,xy,2);
    }
    else{
        return closest_station(closest_stations,stations_copy,xy,3);
    }

}

/**
 * @brief removes given station from data structure
 * @param id region id
 * @return true or false
 */
bool Datastructures::remove_station(StationID id)
{
    auto station = stations.find(id);
    if(station != stations.end()){
        stations.erase(station);
        return true;
    }
    return false;
}

/**
 * @brief gets closest parent of regions
 * @param id1 region id
 * @param id2 regionid
 * @return region or no region
 */
RegionID Datastructures::common_parent_of_regions(RegionID id1, RegionID id2)
{
    auto region1 = std::find_if(std::begin(regions),std::end(regions),[id1](Region find){return find.id == id1;});
    auto region2 = std::find_if(std::begin(regions),std::end(regions),[id2](Region find){return find.id == id2;});
    if(region1 != regions.end() && region2 != regions.end()){
        std::vector<RegionID> parents1 = find_parents(regions[std::distance(regions.begin(),region1)], {});
        std::vector<RegionID> parents2 = find_parents(regions[std::distance(regions.begin(),region2)], {});
        std::vector<RegionID> parents = find_common(parents1,parents2,{});
        if(parents.size() > 0){
            return parents[0];
        }
        else{
            return NO_REGION;
        }
    }

    else{
        return NO_REGION;
    }
}

bool Datastructures::compare_coords(Station a, Station b)
{
    return a.coords < b.coords;
}

bool Datastructures::compare_departures(std::pair <Time, TrainID> one, std::pair <Time, TrainID> two)
{
    if(one.first < two.first){return true;}
    else if(two.first < one.first){return false;}
    else{
        int res = one.second.compare(two.second);
        if(res <= 0){
            return true;
        }
        else{
            return false;
        }
    }
}

std::vector<RegionID> Datastructures::get_all_regions(std::vector<RegionID> result, RegionID id)
{
    auto region = std::find_if(std::begin(regions),std::end(regions),[id](Region find){return find.id == id;});
    if(region->parent == nullptr){
        return result;
    }
    else{
    result.push_back(region->parent->id);
    return get_all_regions(result, region->parent->id);
    }

}

std::vector<RegionID> Datastructures::list_all_sub_regions(std::vector<RegionID> result, std::deque<Region> items)
{
    if(items.empty()){
        return result;
    }
    else{
        auto root_region = items[0];
        if(root_region.subregions.empty() == false){
            for(auto& i : root_region.subregions){
                result.push_back(i->id);
                items.push_back(*i);
            }
        }
        items.pop_front();
        return list_all_sub_regions(result,items);
    }
}

std::vector<StationID> Datastructures::closest_station(std::vector<StationID> result, std::vector<Station> from, Coord coords, int size)
{
    if(size == 0){
        return result;
    }
    else{
        auto closest = std::min_element(from.begin(),from.end(),
            [coords](Station station1, Station station2){return std::abs(station1.coords.y - coords.y) + std::abs(station1.coords.x - coords.x)
                < std::abs(station2.coords.y - coords.y) + std::abs(station2.coords.x - coords.x);});
        result.push_back(from[std::distance(from.begin(),closest)].id);
        from.erase(closest);
        return closest_station(result,from,coords,size-1);
    }
}

std::vector<RegionID> Datastructures::find_parents(Region region, std::vector<RegionID> parents)
{
    if(region.parent == nullptr){
        return parents;
    }
    else{
        parents.push_back(region.parent->id);
        return find_parents(*region.parent, parents);
    }
}

std::vector<RegionID> Datastructures::find_common(std::vector<RegionID> parents1, std::vector<RegionID> parents2, std::vector<RegionID> result)
{
    std::map<RegionID,bool> parents_one;
    for(auto i : parents1){
        parents_one[i] = true;
    }

    for(auto j : parents2){
        if(parents_one[j]){
            result.push_back(j);
        }
    }
    return result;
}

