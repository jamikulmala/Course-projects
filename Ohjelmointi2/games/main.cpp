/*  COMP.CS.100 Project 2: GAME STATISTICS
 * ===============================
 * Ohjelma lukee tiedostosta pelitilastoihin liittyvät tiedot ja tallentaa ne tietorakenteeseen.
 * Käyttäjä voi etsiä kaikki pelit ja pelaajat, kaikki pelit mitä tietty pelaaja pelaa,
 * pelaajat, jotka pelaavat tiettyä peliä, lisätä pelejä ja pelaajia tietorakenteeseen
 * ja poistaa pelaajia tietorakenteesta.
 * Aluksi käyttäjää pyydetään syöttämään tiedoston nimi, jos tiedosto pystytään avata ja sen
 * sisältämä tieto on oikeassa muodossa, pystytään jatkamaan.
 * games> syötteen jälkeen pelaaja voi syöttää haluamiaan komentoja. komennolla "Quit" ohjelman suoritus päättyy.
 *
 * Ohjelman kirjoittaja
 * Nimi: Jami Kulmala
 * Opiskelijanumero: 150425043
 * Käyttäjätunnus: fgjaku
 * E-Mail: Jami.kulmala@tuni.fi
 *
 * Huomioita ohjelmasta ja sen toteutyksesta:
 * Hieman ylimääräisiä committeja, sillä lopussa git päivitti vain main.cpp
 * tiedoston eli automaattitesteri luki vanhan version. Huomasin, että ohjelma tulee
 * myös ajaa, että se kääntää ohjelman, pelkkä tallentaminen ei riittänyt.
 * */
#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <algorithm>
#include <map>
#include <set>

// Casual split func, if delim char is between "'s, ignores it.
std::vector<std::string> split(const std::string& str, char delim){

    std::vector<std::string> result={""};
    bool inside_quatation = false;
    for ( auto current_char : str )
    {
        if ( current_char == '"' )
        {
            inside_quatation = not inside_quatation;
        }
        else if ( current_char == delim and not inside_quatation )
        {
            result.push_back("");
        }
        else
        {
            result.back().push_back(current_char);
        }
    }
    if ( result.back() == "" )
    {
        result.pop_back();
    }
    return result;
}

// function to read file and save it's containing to data structure.
// returns true if succeed if file contains empty parts returns false.
bool construct(std::map<std::string, std::map<std::string,int>>& data, std::string input){

    std::map <std::string,std::string> stats = {};
    std::ifstream tiedosto(input);
    std::string row = "";

    while(std::getline(tiedosto,row)){
        std::vector<std::string> parts = split(row,';');
        // checking vector for empty parts.
        for(std::string& part : parts)
        {
            if(part.length() == 0)
            {
                return false;
            }
        }
        // saving data from file to map containing map.
        std::string game = parts.at(0);
        std::string player = parts.at(1);
        int points = stoi(parts.at(2));
        data[game][player] = points;
        }
    return true;
   }

// function to print all players alphabetically.
void printall(std::map<std::string,std::map<std::string,int>>& data){

    // Saving player data to a vector.
    std::vector <std::string> sub = {};
    for (auto& tiedot : data){
        for(auto& pelaajat : tiedot.second){
            if(std::find(sub.begin(),sub.end(),pelaajat.first) == sub.end()){
                sub.push_back(pelaajat.first);
            }
        }
    }
    // sorting the vector, deleting duplicates and printing the info.
    std::sort(sub.begin(),sub.end());
    std::vector<std::string>::iterator ip;
    ip = std::unique(sub.begin(),sub.begin() + sub.size());
    sub.resize(std::distance(sub.begin(),ip));
    std::cout << "All players in alphabetical order:" << std::endl;
    for(ip = sub.begin(); ip != sub.end(); ++ip){
    std::cout << *ip << std::endl;
    }
}

// prints the information of a given game by points.
// Saving score to a new map and players by score there.
void printgame(std::map<std::string,std::map<std::string,int>>& data,std::string game){

    std::map < int , std::set <std::string> > snp = {};
    if(data.find(game) == data.end()){
        std::cout << "Error: Game could not be found." << std::endl;
    }
    else{
        // if game is available saves it payload to map snp
        std::cout << "Game " << game << " has these scores and players, listed in ascending order:" << std::endl;
        for(auto& tiedot : data.at(game)){
            if(snp.count(tiedot.second) > 0){
                snp.at(tiedot.second).insert(tiedot.first);
            }
            else{
                std::set <std::string> players = {tiedot.first};
                snp.insert({tiedot.second,players});
            }
        }
        // printing the game data in the format Points : players, ...
        for(auto& pisteet : snp){
            if (pisteet.first > 0){
            std::cout << pisteet.first << " : ";
            bool first = true;
                for(auto& player : pisteet.second){
                    if(not first){
                    std::cout << ", ";
                    }
                    std::cout << player;
                    first = false;
                }
                std::cout << std::endl;
            }
        }
    }
}

// prints the games that a given player plays
void printplayer(std::map<std::string,std::map<std::string,int>>& data,std::string player){

    // first testing if player is available by searching for player name in data.
    int flag = 0;
    for(auto& testi : data){
        if(testi.second.count(player) > 0){
            flag +=1;
        }
    }
    // if player is found function goes through data structure and prints the games.
    if(flag > 0){
    std::cout << "Player " << player << " playes the following games:" << std::endl;
    }
    for(auto& tiedot : data){
        if(tiedot.second.count(player) > 0){
        for(auto& pelaaja : tiedot.second){
                if(pelaaja.first == player){
                std::cout << tiedot.first << std::endl;
                break;
                }

            }
        }
        // if player is not found
        if (flag == 0){
        std::cout << "Error: Player could not be found." << std::endl;
        break;
        }
    }
}

// tries to add a given game to data structure.
// fails if game's already present and succees elsewise.
void addgame(std::map<std::string,std::map<std::string,int>>& data,std::string agame){

    if(data.find(agame) != data.end()){
        std::cout << "Error: Already exists." << std::endl;
    }
    else{
        data[agame][""] = 0;
        std::cout << "Game was added." << std::endl;
    }
}

// tries to to remove given player from data structure.
void remove_player(std::map<std::string,std::map<std::string,int>>& data,std::string rplayer){

    // first testing if player is available by searching for player name in data.
    int flag = 0;
    for(auto& testi : data){
        if(testi.second.count(rplayer) > 0){
            flag +=1;
        }
    }
    // if player is found function goes through data structure and removes the player.
    if(flag > 0){
        std::cout << "Player was removed from all games." << std::endl;
    }
    for(auto& tiedot : data){
       if (tiedot.second.count(rplayer) > 0){
       for(auto& pelaaja : tiedot.second){
           if(pelaaja.first == rplayer){
               tiedot.second.erase(rplayer);
               break;
               }
            }
        }
       // player is not found or already deleted.
       if (flag == 0){
       std::cout << "Error: Player could not be found." << std::endl;
       break;
       }
    }
}

// adds a player to data structure or updates the score of a player
// if a player's already in the data structure.
void add_player(std::map<std::string,std::map<std::string,int>>& data,
                std::string game,std::string player,int points){

    if(data.find(game) != data.end()){
        std::cout << "Player was added." << std::endl;
        if(data.at(game).count(player) > 0){
        data.at(game).erase(player);
        data[game][player] = points;

        }
        else{
            data[game][player] = points;
            }
    }
    else{
        std::cout << "Error: Game could not be found." << std::endl;
    }
}


int main()
{
    // data structure that contains the game info.
    // game as key and another map containing player and points as value.
    std::map<std::string, std::map<std::string, int>> data = {};
    std::string input = "";
    std::cout << "Give a name for input file: ";
    std::getline(std::cin,input);

    std::ifstream tiedosto(input);
    std::string row;
    if (not tiedosto){
        std::cout << "Error: File could not be read.";
        return EXIT_FAILURE;

    }
    // checking that each row of the file contains enough parts
    // and doesn't contain empty rows.
    while (std::getline(tiedosto,row)){
        if(count(row.begin(),row.end(),';') != 2 || row.empty()){
            std::cout << "Error: Invalid format in file." << std::endl;
            return EXIT_FAILURE;
        }
    }
    // reading the file and saving data to data structure.
    // if failed stops the program.
    if(!construct(data,input))
    {
        std::cout << "Error: Invalid format in file." << std::endl;
        return EXIT_FAILURE;
    }
    while(true)
       {
        // user interface. User can give command after games>
        // transforms command to capital letters. Going through available commands.
        // lets user know if command is not available. Quit ends the program.´
           std::string line = "";
           std::cout << "games> ";
           getline(std::cin, line);
           if (line.find(' ') == std::string::npos){
               std::transform(line.begin(), line.end(), line.begin(), ::toupper);

               if (line == "ALL_GAMES"){
                   std::cout << "All games in alphabetical order:" << std::endl;
                   for (auto& tiedot : data){
                       std::cout << tiedot.first << std::endl;
                   }
               }

               else if (line == "ALL_PLAYERS"){
                   printall(data);
               }

               else{
                   if(line == "QUIT"){
                       return EXIT_SUCCESS;
                   }
                   std::cout << "Error: Invalid input." << std::endl;
                   continue;
               }
}
           else{
               std::vector <std::string> parts;
               parts = split(line,' ');
               std::transform(parts.at(0).begin(), parts.at(0).end(), parts.at(0).begin(), ::toupper);

               if(parts.at(0) == "GAME"){
                   if(parts.size() < 2){
                       std::cout << "Error: Invalid input." << std::endl;
                       continue;
                   }

                   else{
                        std::string game = parts.at(1);
                        printgame(data,game);
                    }
               }

               else if(parts.at(0) == "PLAYER"){
                   if(parts.size() < 2){
                       std::cout << "Error: invalid input." << std::endl;
                       continue;
                   }
                   else{
                        std::string player = parts.at(1);
                        printplayer(data,player);
                   }
               }
               else if(parts.at(0) == "ADD_GAME"){
                   if(parts.size() < 2){
                       std::cout << "Error: invalid input." << std::endl;
                       continue;
                   }
                   else{
                       std::string agame = parts.at(1);
                       addgame(data,agame);
                   }
               }
               else if(parts.at(0) == "REMOVE"){
                   if(parts.size() < 2){
                       std::cout << "Error: invalid input." << std::endl;
                       continue;
                   }
                   else{
                       std::string rplayer = parts.at(1);
                       remove_player(data,rplayer);
                    }
               }
               else if(parts.at(0) == "ADD_PLAYER"){
                   if(parts.size() < 4){

                       std::cout << "Error: Invalid input." << std::endl;
                       continue;
                   }
                   else{
                   std::string game = parts.at(1);
                   std::string player = parts.at(2);
                   int points = stoi(parts.at(3));
                   add_player(data,game,player,points);
                   }
           }
               else{
                    std::cout << "Error: Invalid input." << std::endl;
                    continue;
                               }
           }

}
    return EXIT_SUCCESS;
}
