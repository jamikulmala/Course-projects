/* Hitori
 *
 * Kuvaus:
 *   Ohjelma toteuttaa Hitori-pelin. Pelissä on peliruudukko kooltaan
 * 5 x 5. Kukin ruutu sisältää jonkin numeroista 1-5. Vaaka- ja
 * pystyriveillä voi aluksi olla useita samoja numeroita, mutta
 * tarkoituksena on poistaa numeroita niin, että kullakin vaaka- ja
 * pystyrivillä on kutakin numeroa vain yksi tai ei yhtään. Kuitenkaan
 * vierekkäisten ruutujen numeroita ei saa poistaa, eikä mikään jäljelle
 * jäävä numero (ruutu) saa jäädä irralleen muista, eli sen ympäriltä
 * (yläpuolelta, alapuolelta, vasemmalta, oikealta) ei saa poistaa
 * kaikkia numeroita.
 *   Aluksi käyttäjältä kysytään, täytetäänkö peliruudukko satunnaisesti
 * arvottavilla luvuilla 1-5 vai käyttäjän valitsemilla 25 luvulla.
 * Ensimmäisessä vaihtoehdossa käyttäjältä kysytään satunnaisluku-
 * generaattorin siemenlukua ja jälkimmäisessä häntä pyydetään syöttämään
 * 25 lukua.
 *   Joka kierroksella käyttäjältä kysytään poistettavan numeron
 * koordinaatteja eli kahta lukua. Peli päättyy pelaajan voittoon,
 * jos peliruudukon kaikilla vaaka- ja pystyriveillä esiintyy kukin
 * numero 1-5 korkeintaan kerran. Peli päättyy pelaajan häviöön,
 * jos hän poistaa jo poistetun numeron viereisen numeron tai jos
 * jokin numero jää irralleen muista.
 *   Ohjelma tarkistaa annetut koordinaatit. Koordinaattien pitää olla
 * peliruudukon sisällä, ja niiden osoittaman ruudun pitää sisältää
 * numero, eli jo poistettua numeroa ei voi poistaa toiseen kertaan.
 *   Pelin päättyessä kerrotaan, voittiko vai hävisikö pelaaja.
 *
 * Ohjelman kirjoittaja
 * Nimi: Jami Kulmala
 * Opiskelijanumero: 150425043
 * Käyttäjätunnus: fgjaku
 * E-Mail: jami.kulmala@tuni.fi
 * */

#include <iostream>
#include <vector>
#include <random>
#include <algorithm>

using namespace std;

const unsigned int BOARD_SIDE = 5;
const unsigned char EMPTY = ' ';
const string NUMBERS = "12345";

// Muuttaa annetun numeerisen merkkijonon vastaavaksi kokonaisluvuksi
// (kutsumalla stoi-funktiota).
// Jos annettu merkkijono ei ole numeerinen, palauttaa nollan.
//
// Converts the given numeric string to the corresponding integer
// (by calling stoi).
// If the given string is not numeric, returns zero.
unsigned int stoi_with_check(const string& str)
{
    bool is_numeric = true;
    for(unsigned int i = 0; i < str.length(); ++i)
    {
        if(not isdigit(str.at(i)))
        {
            is_numeric = false;
            break;
        }
    }
    if(is_numeric)
    {
        return stoi(str);
    }
    else
    {
        return 0;
    }
}

// Tulostaa pelilaudan rivi- ja sarakenumeroineen.
//
// Prints the game board with row and column numbers.
void print(std::vector<std::vector<int>>& gameboard)
{
    cout << "=================" << endl;
    cout << "|   | 1 2 3 4 5 |" << endl;
    cout << "-----------------" << endl;
    for(unsigned int i = 0; i < BOARD_SIDE; ++i)
    {
        cout << "| " << i + 1 << " | ";
        for(unsigned int j = 0; j < BOARD_SIDE; ++j)
        {
            if(gameboard.at(i).at(j) == 0)
            {
                cout << EMPTY << " ";
            }
            else
            {
                cout << gameboard.at(i).at(j) << " ";
            }
        }
        cout << "|" << endl;
    }
    cout << "=================" << endl;
}

//Kysyy kayttajalta tulostetaanko pelilauta satunnaissyotteella vai kayttajan valitsemilla luvuilla.
//Kummassakin syotteen saatuaan, lisaa numerosta viisilukua vektoriin ja vektorin taytyttya
//lisaa se vektorin vektorien vektori gameboardiin.

void takeinput(std::vector<std::vector<int>>& gameboard){
    std::string choice = "";
    while (true){
    cout << "Select start (R for random, I for input): ";
    getline(cin,choice);
    if(choice == "i" or choice == "I"){
        cout << "Input: ";
        for(int j = 0;j < 5; ++ j){
            std::vector<int> row;
            for(int k = 0;k < 5; ++ k){
            int input;
            cin >> input;
            row.push_back(input);
        }
        gameboard.push_back(row);

    }
        break;
    }


    else if(choice == "r" or choice == "R"){
        std::default_random_engine rand_gen;
        std::string seed_value = "";
        cout << "Enter seed value: ";
        cin >> seed_value;
        if( seed_value == "" ) {
            rand_gen.seed( time(0) );
        } else {
            rand_gen.seed( stoi(seed_value) );
        }

        std::uniform_int_distribution<int> distribution(1, 5);
        int board = BOARD_SIDE;
        for( int y = 0; y < board; ++y ) {
            std::vector< int > row;
            for( int x = 0; x < board; ++x ) {
                row.push_back(distribution(rand_gen));
            }
            gameboard.push_back(row);
    }
        break;
    }

    }
}

// tarkastaa pelilaudan rivit. Jos kaksi poistettua ovat vierekkäin palauttaa false.

bool checkrows(std::vector<std::vector<int>> & gameboard){
    for (int i = 0; i < 5; i++){
        for (int j = 0;j < 5; j++){
            for (int k = i + 1;k < 5; ++k){
                if (gameboard.at(j).at(i) == 0 && gameboard.at(j).at(i) == gameboard.at(j).at(k)){
                    return false;
            }
        }
    }
}
    return true;
}

//tarkistaa pelilaudan sarakkeet. Jos kaksi poistettua ovat allekkain palauttaa false.

bool checkcolumns(std::vector<std::vector<int>> & gameboard){
        for (int j = 0; j < 5; j++){
            for (int i = 0;i < 5; i++){
                for (int k = i + 1;k < 5; ++k){
                    if (gameboard.at(i).at(j) == 0 && gameboard.at(i).at(j) == gameboard.at(k).at(j)){
                        return false;

                }
            }
        }
    }
        return true;
}

// tarkistaa ruutuja poistaessa, jääko joitain ruutuja eristyksiin.
// kay lapi eri mahdolliset tilanteet ja palauttaa false, jos niin kay.

bool checkinsulated(std::vector<std::vector<int>> & gameboard){
    if(gameboard.at(1).at(4)==0 && gameboard.at(0).at(3)==0){
        return false;
    }
    else if(gameboard.at(3).at(4)==0 && gameboard.at(4).at(3)==0){
        return false;
    }
    else if(gameboard.at(4).at(1)==0 && gameboard.at(3).at(0)==0){
        return false;
    }
    else if(gameboard.at(1).at(0)==0 && gameboard.at(0).at(1)==0){
        return false;
    }
    else if(gameboard.at(1).at(0) ==0 && gameboard.at(1).at(1)==0){
        return false;
    }
    else if(gameboard.at(1).at(2)==0 && gameboard.at(2).at(1)==0
            && gameboard.at(3).at(2)==0 && gameboard.at(2).at(3)==0){
        return false;
    }
    else if(gameboard.at(0).at(1)==0 && gameboard.at(0).at(3)==0
            && gameboard.at(1).at(2)==0){
        return false;
    }
    else if(gameboard.at(1).at(0)==0 && gameboard.at(3).at(0)==0
            && gameboard.at(2).at(1)==0){
        return false;
    }
    else if(gameboard.at(4).at(1)==0 && gameboard.at(4).at(3)==0
            && gameboard.at(3).at(2)==0){
        return false;
    }
    else if(gameboard.at(3).at(4)==0 && gameboard.at(1).at(4)==0
            && gameboard.at(2).at(3)==0){
        return false;
    }
    return true;
}

// pysayttaa ohjelman, jos joku pelaajan havion aiheuttavista tilanteista tapahtuu.

void checklose(std::vector<std::vector<int>> & gameboard){
    if((checkrows(gameboard) == false || checkcolumns(gameboard)) == false || checkinsulated(gameboard) == false){
        cout << "You lost";
        exit(0);
    }
}

// tarkastaa onko rivissa samoja numeroita. Jos on palauttaa false.
// tyhjia eli int = 0 ei oteta huomioon.

bool checkuniquerows(std::vector<std::vector<int>> & gameboard){
    for (int i = 0; i < 5; i++){
        for (int j = 0;j < 5; j++){
            for (int k = j + 1;k < 5; ++k){
                    if(gameboard.at(i).at(j) == gameboard.at(i).at(k) && gameboard.at(i).at(j) > 0){
                    return false;
                    }
                }
    }
    }
    return true;
}

// tarkistaa onko sarakkeessa samoja numeroita. Jos on palauttaa false.
// tyhjia eli int = 0 ei oteta huomioon.

bool checkuniquecolumns(std::vector<std::vector<int>> & gameboard){
    for (int j = 0; j < 5; j++){
        for (int i = 0;i < 5; i++){
            for (int k = i + 1;k < 5; ++k){
                    if(gameboard.at(i).at(j) == gameboard.at(k).at(j) && gameboard.at(i).at(j) > 0){
                    return false;
                    }
            }
    }
    }
    return true;
}

// jos kumpikin voittoon tarvittava ehto on totta pysayttaa ohjelman.
// funktiota kaytetaan ohjelmassa, niin etta ensin tarkastetaan haviotilanteet
// ja sitten edetaan voittotilanteeseen, joten muita ehtoja
// ei tarvitse tassa funktiossa tarkastaa.

void checkwin(std::vector<std::vector<int>> & gameboard){
    if( checkuniquerows(gameboard) == true && checkuniquecolumns(gameboard) == true){
        cout << "You won";
        exit(0);

    }
}

// Pyytaa kayttajalta poistettavan ruudun koordinaatit. Jos koordinaatit eivat ole
// valilta 1-5 tulostaa naytolle "out of board" ja pyytaa syottamaan uudet koordinaatit.
// hakee y koordinaatilla oikean vektorin gameboardista ja x koordinaatilla oikean kohdan.
// jos kohde on poistettavissa ruutu poistetaan. Jos on jo poistettu tulostaa "already removed"
// ja pyytaa syottamaan uudet koordinaatit. Ruudun poiston jalkeen tulostaa pelilaudan naytolle.
// tarkistaa tayttyyko voitto tai havioehdot. kayttajan syottaessa "q" lopettaa ohjelman.

void remove_element(std::vector<std::vector<int>>& gameboard){
        cout << "Enter removable element (x, y): ";
            std::string x = "";
            std::string y = "";
                cin >> x;
                if(x != "q"){
                cin >> y;
                while(true){
                if(NUMBERS.find(x) != std::string::npos and NUMBERS.find(y) != std::string::npos){
                std::vector <int>& vector = gameboard[stoi_with_check(y)-1];
                int & element = vector[stoi_with_check(x)-1];
                if(element != 0){
                element = int();
                print(gameboard);
                checklose(gameboard);
                checkwin(gameboard);
                cout << "Enter removable element (x, y): ";
                cin >> x;
                if(x != "q"){
                cin >> y;
                }
                }

                else{
                    cout << "Already removed" <<std::endl;
                    cout << "Enter removable element (x, y): ";
                    cin >> x;
                    if(x != "q"){
                    cin >> y;
                }
                }
                }
                    else if(x == "q"){
                        cout << "Quitting";
                        break;
                    }
                    else{
                        cout << "Out of board" <<std::endl;
                        cout << "Enter removable element (x, y): ";
                        cin >> x;
                        if(x != "q"){
                        cin >> y;
                        }
                }

                }

            }
                else if(x == "q"){
                    cout << "Quitting";
                }

}

int main()
{
    std::vector<std::vector<int>> gameboard;
    takeinput(gameboard);
    print(gameboard);
    remove_element(gameboard);
    return 0;
}
