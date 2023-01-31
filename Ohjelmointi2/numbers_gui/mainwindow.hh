/* COMP.CS.110 Ohjelmointi 2: Rakenteet / Programming 2: Structures
 * Project4: 2048
 *
 * Module: Mainwindow
 *
 * Game 2048 played using WASD keys. Full instructions at instructions.txt
 * Contains Class mainwindow and QMainwindow which inherits it to create GUI. Contains methods,
 * slots, default values and a struct to use in GUI for the game 2048. Modules Gameboard
 * and Numbertile are included in the module to be able to use the game implemention.
 *
 * Jami Kulmala
 * jami.kulmala@tuni.fi
 * 150425043
 * */

#ifndef MAINWINDOW_HH
#define MAINWINDOW_HH

#include <QMainWindow>
#include "gameboard.hh"
#include "numbertile.hh"
#include <QGraphicsRectItem>
#include <QGraphicsScene>
#include <QTimer>
#include <vector>
#include <QPoint>
#include <QLabel>
#include <QString>
#include <QKeyEvent>
#include <QGraphicsTextItem>
#include <QLabel>
#include <QDebug>
#include <random>
#include <QFont>
#include <fstream>
#include <string>
#include <iostream>

// moving directions for key event to use to move the tiles
const Coords LEFT = {0, -1};
const Coords UP = {-1, 0};
const Coords RIGHT = {0, 1};
const Coords DOWN = {1, 0};

// size of the side of one tile
const int GRID_SIDE = 95;

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT


public:
    // constructor
    MainWindow(QWidget *parent = nullptr);
    // destructor
    ~MainWindow();
    // sets the game goal number based on the user behaviour
    void update_goal();
    // creates the game GUI by going through the data structure and finding the
    // numbers and colors for the tiles based on their value.
    void initialize();
    // handles the W, A, S, D key presses and ignores others. Also checks wheter
    // the game is being lost or win.
    void keyPressEvent(QKeyEvent* key);
    // if a player wins a win label is printed on the screen and the game is
    // being ended and the score of the player saved to the leaderboard
    void def_win();
    // If a player loses a lose label is printed on the screen and the game is
    // being ended
    void def_lose();
    // updates the timer minutes when 60seconds are reached
    void update_timer();
    // hides the win, pause and lose labels.
    void hide_screens();
    // saves player win scores to leaderboard.txt
    void save_score();
    // returns the number of the biggest tile on the screen for it to be saved.
    // Goes through the datastrcture and finds the biggest value.
    int return_highest();
    // returns a description based on the performance of the player
    // to add to the leaderboard
    std::string generate_grade(int minutes, int seconds, int score, int moves);
    // updates both the movecounters on the screen and in the code when tiles are moved
    void update_movecount();
    // deletes a random element after user given moves by calling
    // delete_random_element from Gameboard if easeCheckBox is checked
    void delete_random_tile();
    // creates a new tile by calling new_tile method from Gameboard
    void new_tile();
    // key events call this method. defines what happens when tiles are moved.
    void move();
    // enables all the input fields on the ui
    void enable_all();
    // disables all the input fields on the ui
    void disable_all();
    // clears the timer and the movecounts
    void clear_counters();

private slots:
    void on_startPushButton_clicked();
    void on_newgamePushButton_clicked();
    void on_exitPushButton_clicked();
    void on_pausePushButton_clicked();

private:
    Ui::MainWindow *ui;
    // gameboard used to access GameBoard methods and update the data structure
    GameBoard board_;
    // scene on which the game lies
    QGraphicsScene* scene_;
    // game goal number
    int goal_;
    // determines wheter the game is running or not
    bool game_in_progress_;
    // determines wheter the key events are to be ignored or not
    bool ignore_commands_;
    // total movecount, printed in gui and used in scorecount
    int totalmove_count_;
    // movecount used when deleting random tiles is enabled
    int movecount_;
    // timer that keeps track of the gametime
    QTimer* timer_;
    // font for numbers on tiles to use
    QFont f;

    // struct which contains info of one tile on the board
    struct Value {
        int number;
        const QString marker;
        QColor color;
    };

    // contains colors and number values for each number
    const std::vector<Value> VALUES = {

    {2,QString::number(2),QColor(255, 255, 153)},
    {4,QString::number(4),QColor(255, 255, 102)},
    {8,QString::number(8),QColor(255, 255, 0)},
    {16,QString::number(16),QColor(255, 178, 102)},
    {32,QString::number(32),QColor(255, 153, 51)},
    {64,QString::number(64),QColor(255, 128, 0)},
    {128,QString::number(128),QColor(255, 102, 102)},
    {256,QString::number(256),QColor(255, 51, 51)},
    {512,QString::number(512),QColor(204, 0, 0)},
    {1024,QString::number(1024),QColor(153, 0, 0)},
    {2048,QString::number(2048),QColor(128, 128, 128)},
    {0,"",QColor(255, 255, 255)}
};
    QColor border_color = QColor(0, 0, 0);

    // finds the correct value from VALUES for a tile
    Value find_value(int value);


};
#endif // MAINWINDOW_HH
