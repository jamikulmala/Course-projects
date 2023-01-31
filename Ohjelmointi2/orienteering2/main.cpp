/*  COMP.CS.100 Project 3: Orienteering
 * ===============================
 * Ohjelma lukee tiedostosta suunnistusreitteihin liittyviä tieotja ja tallentaa ne tietorakenteisiin.
 * Käyttäjä voi tulostaa näytölle: suunnistuskartan, jossa näkyy kaikki rastit, kaikki rastit lyhenteineen,
 * Reitit rasteineen ja kaikki rastit. Kartan, rastien ja reittien käsittelyyn käytetään erilaisia tietorakenteita
 * ja luokkia.
 * Aluksi käyttäjää pyydetään syöttämään tiedoston nimi, jos tiedosto pystytään avaamaan ja sen
 * sisältämä tieto on oikeassa muodossa, pystytään jatkamaan.
 * CMD> syötteen jälkeen pelaaja voi syöttää haluamiaan komentoja. komennolla "Quit" ohjelman suoritus päättyy.
 *
 * Ohjelman kirjoittaja
 * Nimi: Jami Kulmala
 * Opiskelijanumero: 150425043
 * Käyttäjätunnus: fgjaku
 * E-Mail: Jami.kulmala@tuni.fi
 *
 * Huomioita ohjelmasta ja sen toteutyksesta:
 * lisätty luokka Point rastien käsittelemistä varten
 * Toteutettu vain vapaaehtoiset komennot
 * */

#include "orienteeringmap.hh"
#include "parser.hh"
#include "cli.hh"
#include <iostream>

int main()
{
    std::shared_ptr<OrienteeringMap> routes(new OrienteeringMap);
    std::cout << "Input> ";
    std::string input;
    getline(std::cin, input);
    if( not read_input_from_file(input, routes) )
    {
        return EXIT_FAILURE;
    }
    Cli cli(routes);
    while( cli.exec_prompt() ){ }
    return EXIT_SUCCESS;
}


