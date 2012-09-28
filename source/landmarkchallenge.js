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
goog.provide('owg.gg.LandmarkChallenge');

goog.require('owg.gg.Challenge');
goog.require('owg.gg.Button01');
goog.require('owg.gg.FlyingText');
goog.require('owg.gg.ScreenText');
goog.require('owg.gg.Clock');

//-----------------------------------------------------------------------------
/**
 * @class LandmarkChallenge
 * @constructor
 *
 * @description 4 option challenge with various camera movements
 *
 * @author Robert Wüest robert.wst@gmail.ch
 *
 * @param {number} baseScore
 * @param {Array.<string>} options
 * @param {number} correctOption
 * @param {Array.<Object>} views
 * @param {string} title
 *
 */
function LandmarkChallenge(baseScore, options, correctOption, views, title)
{
    this.correctOption = correctOption;
    this.options = options;
    this.baseScore = baseScore;
    this.views = views;
    this.flystate = 1;
    this.text = title;
    this.stop = false;
    this.clock = null;
    this.buttonArray = [];
    this.screenText = null;

    var that = this;

    /* Inline functions*/
    this.onOption1 = function(){
        that.PickOption(1, that.clock.GetSeconds());
    };
    this.onOption2 = function(){
        that.PickOption(2, that.clock.GetSeconds());
    };
    this.onOption3 = function(){
        that.PickOption(3, that.clock.GetSeconds());
    };
    this.onOption4 = function(){
        that.PickOption(4, that.clock.GetSeconds());
    };
    this.FlightCallback = function()
    {
        if(that.stop != true && that.flystate < that.views.length)
        {
            var oView = that.views[that.flystate];
            that.flystate +=1;
            ogFlyTo(m_scene,oView["longitude"],oView["latitude"], oView["elevation"],oView["yaw"],oView["pitch"],oView["roll"]);
           m_flystate = GlobeGame.FLYSTATE.FLYAROUND;
        }
    };
}
LandmarkChallenge.prototype = new Challenge(0);
LandmarkChallenge.prototype.constructor=LandmarkChallenge;
//-----------------------------------------------------------------------------
/**
 * @description activate challenge
 */
LandmarkChallenge.prototype.Prepare = function(delay)
{
    var btn1 = null;
    var btn2 = null;
    var btn3 = null;
    var btn4 = null;

    var that = this;
    var prepFunc = function()
    {
        btn1 = new Button01(m_ui, "btn1", m_centerX-310, window.innerHeight-239, 300, 69, that.options[0], 15);
        btn1.onClickEvent = that.onOption1;
        btn2 = new Button01(m_ui, "btn2", m_centerX+10, window.innerHeight-239, 300, 69, that.options[1], 15);
        btn2.onClickEvent = that.onOption2;
        btn3 = new Button01(m_ui, "btn3", m_centerX-310, window.innerHeight-150, 300, 69, that.options[2], 15);
        btn3.onClickEvent = that.onOption3;
        btn4 = new Button01(m_ui, "btn4", m_centerX+10, window.innerHeight-150, 300, 69, that.options[3], 15);
        btn4.onClickEvent = that.onOption4;
        that.buttonArray.push(btn1);
        that.buttonArray.push(btn2);
        that.buttonArray.push(btn3);
        that.buttonArray.push(btn4);
        that.screenText = new ScreenText(m_ui, that.text,m_centerX, window.innerHeight-255, 26, "center");
        that.clock = new Clock(m_ui, 50, 75, 60);
        var flightduration = Math.floor(40/(that.views.length-1))*1000;
        ogSetFlightDuration(m_scene,flightduration);
        ogSetPosition(m_camera,that.views[0].longitude,that.views[0].latitude, that.views[0].elevation);
        ogSetOrientation(m_camera,that.views[0]["yaw"],that.views[0]["pitch"], that.views[0]["roll"]);
        ogSetInPositionFunction(m_context,that.FlightCallback);
    };
    if(delay > 0)
    {
        setTimeout(prepFunc, delay);
    }else
    {
        prepFunc();
    }
};
//-----------------------------------------------------------------------------
/**
 * @description activate challenge
 */
LandmarkChallenge.prototype.Activate = function()
{
    var that = this;
    FadeIn(function() {
        that.clock.onTimeoutEvent = function(){that.callback()};
        that.clock.Start();

        that.FlightCallback();
    });
};
//-----------------------------------------------------------------------------
/**
 * @description destroy challenge
 */
LandmarkChallenge.prototype.Destroy = function(event)
{
    if(!this.destroyed)
    {
        this.eventDestroyed = event;
        this.clock.Pause();
        ogSetInPositionFunction(m_context,function() {});
        this.stop = true;
        ogStopFlyTo(m_scene);
        this.OnDestroy();
        this.destroyed = true;
    }
};
//-----------------------------------------------------------------------------
/**
 * @description on destroy function
 */
LandmarkChallenge.prototype.OnDestroy = function()
{
    this.clock.Destroy();
    var that = this;
    if(!this.draftmode)
    {
        FadeOut(function(){
            that.buttonArray[0].Destroy();
            that.buttonArray[1].Destroy();
            that.buttonArray[2].Destroy();
            that.buttonArray[3].Destroy();
            that.screenText.Destroy();
            that.eventDestroyed();
        });
    }
    else
    {
        that.buttonArray[0].Destroy();
        that.buttonArray[1].Destroy();
        that.buttonArray[2].Destroy();
        that.buttonArray[3].Destroy();
        that.screenText.Destroy();
        that.eventDestroyed();
    }
};
//-----------------------------------------------------------------------------
/**
 * @description pick solution option
 * @param {number} option
 * @param {number} timeleft
 */
LandmarkChallenge.prototype.PickOption = function(option, timeleft) {
    this.buttonArray[0].SetEnabled(false);
    this.buttonArray[1].SetEnabled(false);
    this.buttonArray[2].SetEnabled(false);
    this.buttonArray[3].SetEnabled(false);
    var that = this;
    if (this.correctOption == option) {
       m_soundhandler.Play("correct");
        if(m_player)
        {
            var score = 0;
            m_player.ScorePoints(this.baseScore, ""); score += this.baseScore;
            m_player.ScorePoints(Math.floor(timeleft / 5), m_locale["timebonus"]);score +=Math.floor(timeleft / 5);
            if (timeleft > 50) {
                m_player.ScorePoints(20, m_locale["speedbonus"]);
                score += 20;
            }
            Timeout(function(){
                var coins = new Coins(m_ui, score);
            }, 1000);
        }
        this.buttonArray[option - 1].SetEnabled(true);
        this.buttonArray[option - 1].SetState(3);
        setTimeout(function () {
            that.callback();
        }, 2000);
    } else {
        m_soundhandler.Play("wrong");
        this.buttonArray[option - 1].SetEnabled(true);
        this.buttonArray[this.correctOption - 1].SetEnabled(true);
        this.buttonArray[option - 1].SetState(4);
        this.buttonArray[this.correctOption - 1].SetState(5);
        setTimeout(function () {
            that.callback();
        }, 2000);
    }
};

goog.exportSymbol('LandmarkChallenge', LandmarkChallenge);
goog.exportProperty(LandmarkChallenge.prototype, 'Prepare', LandmarkChallenge.prototype.Prepare);
goog.exportProperty(LandmarkChallenge.prototype, 'Activate', LandmarkChallenge.prototype.Activate);
goog.exportProperty(LandmarkChallenge.prototype, 'Destroy', LandmarkChallenge.prototype.Destroy);
goog.exportProperty(LandmarkChallenge.prototype, 'OnDestroy', LandmarkChallenge.prototype.OnDestroy);
goog.exportProperty(LandmarkChallenge.prototype, 'PickOption', LandmarkChallenge.prototype.PickOption);
goog.exportProperty(LandmarkChallenge.prototype, 'RegisterCallback', LandmarkChallenge.prototype.RegisterCallback);