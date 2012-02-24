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


//-----------------------------------------------------------------------------
/** @constructor */
function Player(name)
{
    this.playerName = name;
    this.playerScore = 0;
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
                var challenge = new LandmarkChallenge(val.BaseScore, val.Options, val.CorrectOption, val.Views);
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
   // this.player = null;
    this.baseScore = 0;
    this.Activate = function() {};
    this.Destroy = function() {};
}

//-----------------------------------------------------------------------------
/** @constructor */
function LandmarkChallenge(baseScore, options, correctOption, views)
{
    this.correctOption = correctOption;
    this.options = options;
    this.baseScore = baseScore;
    this.views = views;
    var btn1 = null;
    var btn2 = null;
    var btn3 = null;
    var btn4 = null;
    var that = this;
    this.onOption1 = function(){
        alert("bla");
        that.PickOption(that.options[0], 60);
    }
    this.onOption2 = function(){
        that.PickOption(that.options[1], 60);
    }
    this.onOption3 = function(){
       that.PickOption(that.options[2], 60);
    }
    this.onOption4 = function(){
        that.PickOption(that.options[3], 60);
    }
    this.Activate = function()
    {

        btn1 = new Button01(m_ui, m_centerX-310, window.innerHeight-239, 300, 69, this.options[0], 15);
        btn1.onClickEvent = that.onOption1;
        btn2 = new Button01(m_ui, m_centerX+10, window.innerHeight-239, 300, 69, this.options[1], 15);
        btn2.onClickEvent = that.onOption2;
        btn3 = new Button01(m_ui, m_centerX-310, window.innerHeight-150, 300, 69, this.options[2], 15);
        btn3.onClickEvent = that.onOption3;
        btn4 = new Button01(m_ui, m_centerX+10, window.innerHeight-150, 300, 69, this.options[3], 15);
        btn4.onClickEvent = that.onOption4;
        FadeIn();
    }
    this.Destroy = function()
    {
        FadeOut(function(){
            m_ui.remove(btn1);
            m_ui.remove(btn2);
            m_ui.remove(btn3);
            m_ui.remove(btn4);
        });
    };
    this.PickOption = function(option, timeleft)
    {
        if(that.correctOption == option)
        {
            m_player.playerScore += that.baseScore;
            m_player.playerScore += timeLeft;
            if(timeLeft > 50)
            {
                m_player.playerScore += 20;
            }
        }
    };
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor=LandmarkChallenge;

