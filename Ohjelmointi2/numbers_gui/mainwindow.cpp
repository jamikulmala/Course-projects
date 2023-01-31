#include "mainwindow.hh"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , game_in_progress_(false)
    , ignore_commands_(false)
    , totalmove_count_(0)
    , movecount_(0)
{
    ui->setupUi(this);
    scene_ = new QGraphicsScene(this);
    ui->graphicsView->setScene(scene_);
    timer_ = new QTimer(this);
    connect(timer_, &QTimer::timeout, this, &MainWindow::update_timer);
    // font for the numbers in the tiles
    f.setPointSize(20);
    f.setBold(true);
    // some limitations to improve the game usability
    ui->seedSpinBox->setMaximum(100);
    ui->goalSpinBox->setMaximum(65536);
    ui->easeSpinBox->setMinimum(10);
}



MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::new_tile()
{
    board_.new_value();
}

void MainWindow::move()
{
    scene_->clear();
    new_tile();
    initialize();
    ++ totalmove_count_;
    ++ movecount_;
    update_movecount();
}

void MainWindow::enable_all()
{
    ui->startPushButton->setEnabled(true);
    ui->seedSpinBox->setEnabled(true);
    ui->goalSpinBox->setEnabled(true);
    ui->usernameLineEdit->setEnabled(true);
    ui->easeCheckBox->setEnabled(true);
}

void MainWindow::disable_all()
{
    ui->startPushButton->setEnabled(false);
    ui->seedSpinBox->setEnabled(false);
    ui->goalSpinBox->setEnabled(false);
    ui->usernameLineEdit->setDisabled(true);
    ui->easeCheckBox->setDisabled(true);
}

void MainWindow::clear_counters()
{
    ui->lcdNumberSec->display(0);
    ui->lcdNumberMin->display(0);
    ui->usernameLineEdit->clear();
    totalmove_count_ = 0;
    movecount_ = 0;
    ui->moveCountLabel->setText(QString::number(0));
}

void MainWindow::update_goal()
{
   QString default_goal = "2048";
   QString goal = QString::number(ui->goalSpinBox->value());
   if(ui->goalSpinBox->value() == 0){
       goal_ = DEFAULT_GOAL;
       ui->goalLabel->setText(default_goal);
   }
   // checking if the goal number is a power of two
   else if(!(ceil(log2(ui->goalSpinBox->value())) == floor(log2(ui->goalSpinBox->value())))){
       goal_ = DEFAULT_GOAL;
       ui->goalLabel->setText(default_goal);
        }
   else{
    goal_ = ui->goalSpinBox->value();
    ui->goalLabel->setText(goal);
   }
}

void MainWindow::initialize()
{
    delete_random_tile();
    for (int row = 0; row < SIZE; row++) {
        for (int column = 0; column < SIZE; column++) {
            QRectF square(column * GRID_SIDE, row * GRID_SIDE,
                          GRID_SIDE, GRID_SIDE);
            std::pair <int,int> coords_;
            coords_ = std::make_pair(row,column);
            // Numbers greater than 2048 are dark grey
            if(board_.get_item(coords_)->value() > 2048){
                scene_->addRect(square, border_color, QColor(64,64,64));
                QGraphicsTextItem *text = scene_->addText(
                            QString::number(board_.get_item(coords_)->value()));
                text->setDefaultTextColor(QColor(0,0,0));
                text->setFont(f);
                text->setPos(column * GRID_SIDE, row * GRID_SIDE);
                }
            // Others have a color of their own which is fetched from struct Value
            // containing their color and their number
            else{
            Value value = find_value(board_.get_item(coords_)->value());
            scene_->addRect(square, border_color, value.color);
            QGraphicsTextItem *text = scene_->addText(value.marker);
            text->setDefaultTextColor(QColor(0,0,0));
            text->setFont(f);
            text->setPos(column * GRID_SIDE, row * GRID_SIDE);
                }
            }
      }
}

void MainWindow::keyPressEvent(QKeyEvent *key)
{
    if(game_in_progress_){
        if(!ignore_commands_){
    if(key->key() == Qt::Key_W){
        if(board_.move(UP,goal_)){
            def_win();
        }
    }
    else if(key->key() == Qt::Key_S){
        if(board_.move(DOWN,goal_)){
            def_win();
        }
    }
    else if(key->key() == Qt::Key_D){
        if(board_.move(RIGHT,goal_)){
            def_win();
        }
    }
    else if(key->key() == Qt::Key_A){
        if(board_.move(LEFT,goal_)){
            def_win();
        }
    }
    else{
        return;
    }

    if(board_.is_full()){
        def_lose();
    }
    move();
    }
        else{
            key->ignore();
        }
    }
    else{
        key->ignore();
    }
}

 void MainWindow::def_win()
{
    ui->winLabel->setText("You win!");
    ui->winLabel->setStyleSheet({"background:green; color:white; font: bold 50px"});
    game_in_progress_ = false;
    ui->winLabel->show();
    timer_->stop();
    this->setStyleSheet({"background: green"});
    ui->graphicsView->setStyleSheet({"background: green"});
    save_score();
 }

 void MainWindow::def_lose()
 {
        ui->loseLabel->setText("You lose!");
        ui->loseLabel->setStyleSheet({"background:red; color:white; font: bold 50px"});
        game_in_progress_ = false;
        ui->loseLabel->show();
        timer_->stop();
        this->setStyleSheet({"background: red"});
        ui->graphicsView->setStyleSheet({"background: red"});
 }


void MainWindow::on_startPushButton_clicked()
{
    board_.init_empty();
    update_goal();
    if(ui->seedSpinBox->value() != 0){
        int seed = ui->seedSpinBox->value();
        board_.fill(seed);
    }
    else{
    int seed = time(NULL);
    board_.fill(seed);
    }
    initialize();
    game_in_progress_ = true;
    timer_->start(1000);
    hide_screens();
    disable_all();
}

void MainWindow::on_newgamePushButton_clicked()
{
    board_.reset_gameboard();
    scene_->clear();
    goal_ = DEFAULT_GOAL;
    hide_screens();
    game_in_progress_ = false;
    timer_->stop();
    this->setStyleSheet({"background: black"});
    ui->graphicsView->setStyleSheet({"background: white"});
    clear_counters();
    enable_all();
}

void MainWindow::on_exitPushButton_clicked()
{
    delete scene_;
    delete timer_;
    MainWindow::close();
}

void MainWindow::on_pausePushButton_clicked()
{
    if(game_in_progress_){
    ui->pauseLabel->setText("PAUSE");
    ui->pauseLabel->setStyleSheet({"background:grey; color:white; font: bold 50px"});
    if(ignore_commands_ == false){
        timer_->stop();
        ui->pauseLabel->show();
        ignore_commands_ = true;
    }
    else{
        timer_->start(1000);
        ignore_commands_ = false;
        ui->pauseLabel->hide();
        }
    }
}

MainWindow::Value MainWindow::find_value(int value)
{
        for(auto& s:VALUES){
            if(s.number == value){
                return s;
            }
        }
        // to prevent warning label
        return VALUES.at(0);
}

void MainWindow::update_timer()
{
    ui->lcdNumberSec->display(ui->lcdNumberSec->value()+1);
    if (ui->lcdNumberSec->value() == 60){
        ui->lcdNumberMin->display(ui->lcdNumberMin->value()+1);
        ui->lcdNumberSec->display(0);
    }
}

void MainWindow::hide_screens()
{
    ignore_commands_ = false;
    ui->pauseLabel->hide();
    ui->winLabel->hide();
    ui->loseLabel->hide();
}

int MainWindow::return_highest()
{
    std::vector<int> values = {};
    for (int row = 0; row < SIZE; row++) {
        for (int column = 0; column < SIZE; column++) {
            std::pair <int,int> coords_;
            coords_ = std::make_pair(row,column);
            if(std::find(values.begin(),values.end(),board_.get_item(coords_)->value()) == values.end()){
                values.push_back(board_.get_item(coords_)->value());
            }
        }
    }
    int highest = *std::max_element(values.begin(),values.end());
    return highest;
}

std::string MainWindow::generate_grade(int minutes, int seconds, int score, int moves)
{
    int time = seconds + minutes*60;
    int grade = score - time - moves;
    if(grade > 1000){
        return "MICHAEL JORDAN";
    }
    else if(grade > 750){
        return "ELITE";
    }
    else if(grade > 500){
        return "GREAT";
    }
    else if(grade > 250){
        return "GOOD";
    }
    else{
        return "NOOB";
    }
}

void MainWindow::update_movecount()
{
    QString moves = QString::number(totalmove_count_);
    ui->moveCountLabel->setText(moves);
    if(totalmove_count_ > 500){
        ui->moveCountLabel->setStyleSheet({"color: gold; font: 24px bold"});
    }
    else if(totalmove_count_ > 200){
        ui->moveCountLabel->setStyleSheet({"color: silver; font: 24px bold"});
    }
    else if(totalmove_count_ > 100){
        ui->moveCountLabel->setStyleSheet({"color: darkgoldenrod; font: 24px bold"});
    }
    else if(totalmove_count_ > 50){
        ui->moveCountLabel->setStyleSheet({"color: goldenrod; font: 24px bold"});
    }
    else if(totalmove_count_ > 25){
        ui->moveCountLabel->setStyleSheet({"color: khaki; font: 24px bold"});
    }
    else if(totalmove_count_ > 10){
        ui->moveCountLabel->setStyleSheet({"color: lemonchiffon; font: 24px bold"});
    }
}

void MainWindow::delete_random_tile()
{
    int when = ui->easeSpinBox->value();
    if(ui->easeCheckBox->isChecked()){
        if(movecount_ == when){
            board_.delete_random_element();
            movecount_ = 0;
        }
        else{
            return;
        }
    }
    else{
        return;
    }
}

void MainWindow::save_score()
{
    if(ui->usernameLineEdit->text() != ""){
        int score = return_highest();
        QString name = ui->usernameLineEdit->text();
        std::string username = name.toStdString();
        int minutes = ui->lcdNumberMin->value();
        int seconds = ui->lcdNumberSec->value();
        int move_count = totalmove_count_;
        std::string file = "leaderboard.txt";
        std::ofstream leaderboard(file,std::ios::app);
        if(leaderboard){
            leaderboard << username << " - " << score << " - " << move_count << " - "
             << minutes << "min " << seconds << "sec - " <<
                generate_grade(minutes,seconds,score,move_count) << std::endl;
        }
        else{
            return;
        }
        leaderboard.close();
    }
}
