/*******************************************************************************
 #      ____               __          __  _      _____ _       _               #
 #     / __ \              \ \        / / | |    / ____| |     | |              #
 #    | |  | |_ __   ___ _ __ \  /\  / /__| |__ | |  __| | ___ | |__   ___      #
 #    | |  | | '_ \ / _ \ '_ \ \/  \/ / _ \ '_ \| | |_ | |/ _ \| '_ \ / _ \     #
 #    | |__| | |_) |  __/ | | \  /\  /  __/ |_) | |__| | | (_) | |_) |  __/     #
 #     \____/| .__/ \___|_| |_|\/  \/ \___|_.__/ \_____|_|\___/|_.__/ \___|     #
 #           | |                                                                #
 #           |_|                 _____ _____  _  __                             #
 #                              / ____|  __ \| |/ /                             #
 #                             | (___ | |  | | ' /                              #
 #                              \___ \| |  | |  <                               #
 #                              ____) | |__| | . \                              #
 #                             |_____/|_____/|_|\_\                             #
 #                                                                              #
 #                              (c) 2011-2012 by                                #
 #           University of Applied Sciences Northwestern Switzerland            #
 #                     Institute of Geomatics Engineering                       #
 #                          Author:robert.wst@gmail.com                         #
 ********************************************************************************
 *     Licensed under MIT License. Read the file LICENSE for more information   *
 *******************************************************************************/
//-----------------------------------------------------------------------------
/** @constructor */
function GlobeGame(gameData)
{
    /* State definitions
     0: Idle Mode intro
     1: Configuring Player
     2: Landmark Quiz
     3: Positioning Quiz
     4: Terminate show highscore
     */
    this.state = 0;
    this.qCount = 0;
    this.currentChallenge = null;
    this.gameData = gameData;
    var that = this;
}

GlobeGame.prototype.Init = function()
{
    this.state = 1;
    var name = prompt(m_locale.entername, "Name");
    m_player = new Player(name);
    m_score = new ScoreCount(m_ui);
    this.currentChallenge = this.gameData.PickChallenge();
    this.InitQuiz();
};

GlobeGame.prototype.InitQuiz = function()
{
    this.currentChallenge.Activate();
    /* if(challenge.type == 0)
     {
     this.state = 2;
     m_ui.setAlpha(0.0);
     }
     if(challenge.type == 1)
     {
     this.state = 3;
     }*/
};

GlobeGame.prototype.NextChallenge = function()
{
    if(this.gameData.questions.length > 0){
        this.currentChallenge = this.gameData.PickChallenge();
        this.InitQuiz();
    }
}


//-----------------------------------------------------------------------------
/** @constructor */
function Player(name)
{
    this.playerName = name;
    this.playerScore = 0;
}

Player.prototype.ScorePoints = function(amount, description)
{
    var text = new FlyingText(m_static, "+"+amount+" "+m_locale.points+" "+ description, "#00FF00");
    this.playerScore += amount;
}

//-----------------------------------------------------------------------------
/** @constructor */
function GameData()
{
    // load question array
    this.questions = [];
    var that = this;
    jQuery.getJSON('../data/challenges_'+m_lang+'.json', function(data) {

        var items = [];

        jQuery.each(data, function(key, val) {
            if(val.Type == 0)
            {
                var challenge = new LandmarkChallenge(val.BaseScore, val.Options, val.CorrectOption, val.Views, val.Title);
                items.push(challenge);
            }

        });
        that.questions = items;
    });

}
GameData.prototype.PickChallenge = function()
{
    // Random pick a challenge
    var index = Math.floor(Math.random()*this.questions.length);
    var challenge = this.questions[index];
    this.questions.splice(index,1);
    return challenge;
};
//-----------------------------------------------------------------------------
/** @constructor */
function Challenge(type)
{
    /*
     0: Landmark question
     1: Positioning question
     */
    this.type = type;
    this.baseScore = 0;
    this.Activate = function() {};
    this.Destroy = function() {};
    this.OnDestroy = function() {};
}

//-----------------------------------------------------------------------------
/** @constructor */
function LandmarkChallenge(baseScore, options, correctOption, views, title)
{
    this.correctOption = correctOption;
    this.options = options;
    this.baseScore = baseScore;
    this.views = views;
    this.stop = false;
    this.flymode = false;
    this.text = title;
    var buttonArray = [];
    var screenText = null;
    var clock = null;
    var that = this;
    this.onOption1 = function(){
        that.PickOption(1, clock.seconds);
    }
    this.onOption2 = function(){
        that.PickOption(2, clock.seconds);
    }
    this.onOption3 = function(){
       that.PickOption(3, clock.seconds);
    }
    this.onOption4 = function(){
        that.PickOption(4, clock.seconds);
    }
    this.Activate = function()
    {
        var btn1 = null;
        var btn2 = null;
        var btn3 = null;
        var btn4 = null;
        btn1 = new Button01(m_ui, "btn1", m_centerX-310, window.innerHeight-239, 300, 69, this.options[0], 15);
        btn1.onClickEvent = that.onOption1;
        btn2 = new Button01(m_ui, "btn2", m_centerX+10, window.innerHeight-239, 300, 69, this.options[1], 15);
        btn2.onClickEvent = that.onOption2;
        btn3 = new Button01(m_ui, "btn3", m_centerX-310, window.innerHeight-150, 300, 69, this.options[2], 15);
        btn3.onClickEvent = that.onOption3;
        btn4 = new Button01(m_ui, "btn4", m_centerX+10, window.innerHeight-150, 300, 69, this.options[3], 15);
        btn4.onClickEvent = that.onOption4;
        buttonArray.push(btn1);
        buttonArray.push(btn2);
        buttonArray.push(btn3);
        buttonArray.push(btn4);
        screenText = new ScreenText(m_ui, this.text,m_centerX, window.innerHeight-255, 20, "center");
        clock = new Clock(m_ui, 50, 75, 60);
        clock.Start();
        FadeIn(function() {});
        var flightduration = Math.floor(40/(views.length-1))*1000;
        var scene = ogGetScene(m_context);
        ogSetFlightDuration(scene,flightduration);
        var camId = ogGetActiveCamera(scene);
        ogSetPosition(camId,views[0].longitude,views[0].latitude, views[0].elevation);
        ogSetOrientation(camId,views[0].yaw,views[0].pitch, views[0].roll);
        that.FlightCallback(1, flightduration, views);
    }
    this.Destroy = function()
    {
        that.stop = true;
        clock.Pause();
        if(that.flymode == false)
        {
            that.OnDestroy();
        }
    }
    this.OnDestroy = function()
    {   clock.Destroy();
        FadeOut(function(){
            buttonArray[0].Destroy();
            buttonArray[1].Destroy();
            buttonArray[2].Destroy();
            buttonArray[3].Destroy();
            screenText.Destroy();
            m_game.NextChallenge();
        });
    };
    this.PickOption = function(option, timeleft)
    {
        buttonArray[0].setEnabled(false);
        buttonArray[1].setEnabled(false);
        buttonArray[2].setEnabled(false);
        buttonArray[3].setEnabled(false);
        if(that.correctOption == option)
        {
            m_player.ScorePoints(that.baseScore,"");
            m_player.ScorePoints(timeleft, m_locale.timebonus);
            if(timeleft > 50)
            {
                m_player.ScorePoints(20, m_locale.speedbonus);
            }
            buttonArray[option-1].setEnabled(true);
            buttonArray[option-1].setState(3);
            that.Destroy();
        }else
        {
            buttonArray[option-1].setEnabled(true);
            buttonArray[that.correctOption-1].setEnabled(true);
            buttonArray[option-1].setState(4);
            buttonArray[that.correctOption-1].setState(5);
            that.Destroy();
        }
    };
    this.FlightCallback = function(state, duration,views)
    {
        that.flymode = true;
        setTimeout(function(){
            if(that.stop == true)
            {
                that.OnDestroy();
            }
            else if(state-1 < views.length)
            {
                that.FlightCallback(state+1,duration,views);
            }
            else
            {
                that.flymode = false;
            }
        }, duration);
        var oView = views[state];
        var scene = ogGetScene(m_context);
        ogFlyTo(scene,oView.longitude,oView.latitude, oView.elevation,oView.yaw,oView.pitch,oView.roll);
    };
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor=LandmarkChallenge;

